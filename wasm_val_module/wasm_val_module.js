// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import { Serializer } from './wasm_val_serializer.js';

export class WasmValModule {

    constructor(wasmFile, context, options, ) {
        this.apiVersion = 3;
        this.wasmFile = wasmFile;
        this.options = options;
        this.context = context;
        this.imports = {
            env: {
                get_val_global: this.get_val_global.bind(this),
                get_val: this.get_val.bind(this),
                set_val: this.set_val.bind(this),
                call_0: this.call_0.bind(this),
                call_1: this.call_1.bind(this),
                call_2: this.call_2.bind(this),
                new_0: this.new_0.bind(this),
                new_1: this.new_1.bind(this),
                drop_val: this.drop_val.bind(this),
            }
        }
        this.textDecoder = new TextDecoder('utf8');
        this.last_ref_id = 1;
        this.refs = new Map();

    }

    run() {
        return fetch(this.wasmFile)
            .then(resp => resp.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, this.imports))
            .then(module => {
                const instance = module.instance;
                const exports = instance.exports;

                if (!exports.wasm_val_rust_alloc || !exports.wasm_val_get_api_version) {
                    console.error("wasm_val export functions not found : consider using 'extern crate wasm_val; in your lib.rs'");

                    return Promise.reject("No wasm_val exports found");
                }

                if (exports.wasm_val_get_api_version() != this.apiVersion) {
                    console.error("API version mismatch : consider using the latest versions of wasm_val as well as wasm_val_module");

                    return Promise.reject("wasm_val API version mismatch");
                }

                this.exports = exports;
                this.memory = exports.memory;
                this.rust_alloc = exports.wasm_val_rust_alloc;
                this.buff_ = new Uint8Array(this.memory.buffer);
                this.serializer = new Serializer(this, this.rust_alloc);

                return Promise.resolve(instance);
            });
    }

    get buff() {
        if (this.buff_.length === 0) {
            this.buff_ = new Uint8Array(this.memory.buffer);
        }
        return this.buff_;
    }


    _is_ref_type(val) {
        const t = typeof val;

        return t === "object" || t === "function";
    }

    get_val_global(strLen, namePtr) {
        const nameBytes = this.buff.subarray(namePtr, namePtr + strLen);
        const name = this.textDecoder.decode(nameBytes);
        const foundVal = this.context[name];
        const ptr = this.rust_alloc(9);
        let ref_id;

        if (foundVal && this._is_ref_type(foundVal)) {
            ref_id = this.last_ref_id;

            this.last_ref_id = this.last_ref_id + 1;
            this.refs.set(ref_id, foundVal);

        }
        this.serializer.write_val(ptr, foundVal, ref_id);

        return ptr;
    }

    get_val(refId, strLen, namePtr) {
        const ref = this.refs.get(refId);
        const nameBytes = this.buff.subarray(namePtr, namePtr + strLen);
        const name = this.textDecoder.decode(nameBytes);
        const val = ref[name];
        const ptr = this.rust_alloc(9);

        if (val && this._is_ref_type(val)) {
            const ref_id = this.last_ref_id;

            this.last_ref_id = this.last_ref_id + 1;
            this.refs.set(ref_id, val);

            this.serializer.write_val(ptr, val, ref_id);

        } else {
            this.serializer.write_val(ptr, val);
        }
        return ptr;

    }

    read_val(valPtr) {
        const valBox = this.serializer.read_val(valPtr);

        if (valBox.isRef) {
            return this.refs.get(valBox.val);
        } else {
            return valBox.val;
        }
    }

    set_val(refId, strLen, namePtr, valPtr) {
        const ref = this.refs.get(refId);
        const nameBytes = this.buff.subarray(namePtr, namePtr + strLen);
        const name = this.textDecoder.decode(nameBytes);
        let val = this.read_val(valPtr);

        ref[name] = val;

    }

    call_0(refId, strLen, namePtr) {
        const ref = this.refs.get(refId);
        const nameBytes = this.buff.subarray(namePtr, namePtr + strLen);
        const name = this.textDecoder.decode(nameBytes);
        let fn = ref[name];
        const ptr = this.rust_alloc(9);
        let retVal, ref_id;

        if (fn && typeof fn === "function") {
            //Take into consideration errors
            retVal = fn.apply(ref, []);
            if (retVal && this._is_ref_type(retVal)) {
                ref_id = this.last_ref_id;

                this.last_ref_id = this.last_ref_id + 1;
                this.refs.set(ref_id, retVal);
            }

        }

        this.serializer.write_val(ptr, retVal, ref_id);

        return ptr;
    }

    call_1(refId, strLen, namePtr, argPtr) {
        const ref = this.refs.get(refId);
        const nameBytes = this.buff.subarray(namePtr, namePtr + strLen);
        const name = this.textDecoder.decode(nameBytes);
        let fn = ref[name];
        const ptr = this.rust_alloc(9);
        let retVal, ref_id;

        if (fn && typeof fn === "function") {
            //Take into consideration errors
            const arg = this.read_val(argPtr);
            retVal = fn.apply(ref, [arg]);
            if (retVal && this._is_ref_type(retVal)) {
                ref_id = this.last_ref_id;

                this.last_ref_id = this.last_ref_id + 1;
                this.refs.set(ref_id, retVal);
            }

        } else {
            //TODO Give back error as not function
        }

        this.serializer.write_val(ptr, retVal, ref_id);

        return ptr;

    }

    call_2(refId, strLen, namePtr, arg1Ptr, arg2Ptr) {
        const ref = this.refs.get(refId);
        const nameBytes = this.buff.subarray(namePtr, namePtr + strLen);
        const name = this.textDecoder.decode(nameBytes);
        let fn = ref[name];
        const ptr = this.rust_alloc(9);
        let retVal, ref_id;

        if (fn && typeof fn === "function") {
            //Take into consideration errors
            const arg1 = this.read_val(arg1Ptr);
            const arg2 = this.read_val(arg2Ptr);
            retVal = fn.apply(ref, [arg1, arg2]);
            if (retVal && this._is_ref_type(retVal)) {
                ref_id = this.last_ref_id;

                this.last_ref_id = this.last_ref_id + 1;
                this.refs.set(ref_id, retVal);
            }

        } else {
            //TODO Give back error as not function
        }

        this.serializer.write_val(ptr, retVal, ref_id);

        return ptr;

    }

    new_0(refId) {
        const ref = this.refs.get(refId);
        const newVal = new ref();
        const ptr = this.rust_alloc(9);
        //Take into consideration errors
        // TODO : Wrap in try catch send error if catch
        const ref_id = this.last_ref_id;
        this.last_ref_id = this.last_ref_id + 1;
        this.refs.set(ref_id, newVal);

        this.serializer.write_val(ptr, newVal, ref_id);

        return ptr;
    }

    new_1(refId, argPtr) {
        const ref = this.refs.get(refId);
        const arg = this.read_val(argPtr);
        const newVal = new ref(arg);
        const ptr = this.rust_alloc(9);
        //Take into consideration errors
        // TODO : Wrap in try catch send error if catch
        const ref_id = this.last_ref_id;
        this.last_ref_id = this.last_ref_id + 1;
        this.refs.set(ref_id, newVal);

        this.serializer.write_val(ptr, newVal, ref_id);

        return ptr;
    }

    drop_val(refId) {
        const res = this.refs.delete(refId);
    }

}
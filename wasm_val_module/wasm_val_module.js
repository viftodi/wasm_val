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
        this.apiVersion = 5;
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
                call_args: this.call_args.bind(this),
                call_method_0: this.call_method_0.bind(this),
                call_method_1: this.call_method_1.bind(this),
                call_method_args: this.call_method_args.bind(this),
                new_0: this.new_0.bind(this),
                new_1: this.new_1.bind(this),
                new_args: this.new_args.bind(this),
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

    _prepare_val(val, parent) {
        const boxedVal = { ref_id: null, val: val };

        if (typeof val === "function") {
            boxedVal.val = val.bind(parent);
        }

        if (this._is_ref_type(boxedVal.val)) {
            const ref_id = this.last_ref_id;

            boxedVal.ref_id = ref_id;

            this.last_ref_id = this.last_ref_id + 1;
            this.refs.set(ref_id, boxedVal.val);
        }

        return boxedVal;
    }

    _write_val(val, parent) {
        const ptr = this.rust_alloc(9);
        const boxedVal = this._prepare_val(val, parent);
        
        this.serializer.write_val(ptr, boxedVal.val, boxedVal.ref_id);

        return ptr;
    }

    get_rust_lambda_callback(key) {
        const call = this.exports.wasm_val_call_registered_callback;

        return function () {
            call(key);
        };
    }

    get_rust_lambda_callback_arg(key) {
        const call = this.exports.wasm_val_call_registered_callback_arg;
        const writeVal = this._write_val.bind(this);

        return function (arg) {
            call(key, writeVal(arg));
        };
    }

    _get_str(strLen, strPtr) {
        const strBytes = this.buff.subarray(strPtr, strPtr + strLen);
        const str = this.textDecoder.decode(strBytes);

        return str;
    }

    get_val_global(strLen, namePtr) {
        const name = this._get_str(strLen, namePtr);
        const foundVal = this.context[name];
        const ptr = this._write_val(foundVal, this.context);

        return ptr;
    }

    get_val(refId, strLen, namePtr) {
        const ref = this.refs.get(refId);
        const name = this._get_str(strLen, namePtr);
        const val = ref[name];
        const ptr = this._write_val(val, ref);

        return ptr;

    }

    unbox_val(valBox) {
        if (valBox.isRef) {
            return this.refs.get(valBox.val);
        } else {
            return valBox.val;
        }
    }

    read_val(valPtr) {
        const valBox = this.serializer.read_val(valPtr);

        return this.unbox_val(valBox);
    }

    read_vals(valsLen, valsPtr) {
        const valBoxes = this.serializer.read_vals(valsLen, valsPtr);

        return valBoxes.map(valBox => this.unbox_val(valBox));
    }

    set_val(refId, strLen, namePtr, valPtr) {
        const ref = this.refs.get(refId);
        const name = this._get_str(strLen, namePtr);
        let val = this.read_val(valPtr);

        ref[name] = val;
    }

    call_0(refId) {
        const fn = this.refs.get(refId);
        // TODO Take into consideration errors/exception
        const retVal = fn.apply(null, []);
        const ptr = this._write_val(retVal, fn);

        return ptr;
    }

    call_1(refId, argPtr) {
        const fn = this.refs.get(refId);
        const arg = this.read_val(argPtr);
        const retVal = fn.apply(null, [arg]);
        const ptr = this._write_val(retVal, fn);

        return ptr;
    }

    call_args(refId, argsLen, argsPtr) {
        const fn = this.refs.get(refId);
        const args = this.read_vals(argsLen, argsPtr);
        // TODO Take into consideration exceptions
        const retVal = fn.apply(null, args);
        const ptr = this._write_val(retVal, fn);

        return ptr;
    }

    call_method_0(refId, strLen, namePtr) {
        const ptr = this.rust_alloc(9);
        const parentRef = this.refs.get(refId);
        const name = this._get_str(strLen, namePtr);
        const fn = parentRef[name];

        // TODO Handle case when it's not a function
        if (fn && typeof fn === "function") {
            const retVal = fn.apply(parentRef, []);
            const boxedRetVal = this._prepare_val(retVal, fn);
            this.serializer.write_val(ptr, boxedRetVal.val, boxedRetVal.ref_id);
        }

        return ptr;
    }

    call_method_1(refId, strLen, namePtr, argPtr) {
        const ptr = this.rust_alloc(9);
        const parentRef = this.refs.get(refId);
        const name = this._get_str(strLen, namePtr);
        const fn = parentRef[name];
        const arg = this.read_val(argPtr);

        // TODO Handle case when it's not a function
        if (fn && typeof fn === "function") {
            const retVal = fn.apply(parentRef, [arg]);
            const boxedRetVal = this._prepare_val(retVal, fn);
            this.serializer.write_val(ptr, boxedRetVal.val, boxedRetVal.ref_id);
        }

        return ptr;
    }

    call_method_args(refId, strLen, namePtr, argsLen, argsPtr) {
        const ptr = this.rust_alloc(9);
        const parentRef = this.refs.get(refId);
        const name = this._get_str(strLen, namePtr);
        const fn = parentRef[name];
        const args = this.read_vals(argsLen, argsPtr);

        // TODO Handle case when it's not a function
        if (fn && typeof fn === "function") {
            const retVal = fn.apply(parentRef, args);
            const boxedRetVal = this._prepare_val(retVal, fn);
            this.serializer.write_val(ptr, boxedRetVal.val, boxedRetVal.ref_id);
        }

        return ptr;
    }

    new_0(refId) {
        const fnConstructor = this.refs.get(refId);
        // TODO Take into consideration exceptions
        const newVal = new fnConstructor();
        const ptr = this._write_val(newVal, fnConstructor);

        return ptr;
    }

    new_1(refId, argPtr) {
        const fnConstructor = this.refs.get(refId);
        const arg = this.read_val(argPtr);
        // TODO Take into consideration exceptions
        const newVal = new fnConstructor(arg);
        const ptr = this._write_val(newVal, fnConstructor);

        return ptr;
    }

    new_args(refId, argsLen, argsPtr) {
        const fnConstructor = this.refs.get(refId);
        const args = this.read_vals(argsLen, argsPtr);
        // TODO Take into consideration exceptions
        const newVal = new fnConstructor(...args);
        const ptr = this._write_val(newVal, fnConstructor);

        return ptr;
    }

    drop_val(refId) {
        const res = this.refs.delete(refId);
    }

}
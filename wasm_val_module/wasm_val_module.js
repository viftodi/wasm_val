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

                this.exports = exports;
                this.memory = exports.memory;

                this.rust_alloc = exports.wasm_val_rust_alloc;

                this.buff_ = new Uint8Array(this.memory.buffer);

                this.serializer = new Serializer(this, this.rust_alloc);

                exports.main();


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

    set_val(refId, strLen, namePtr, valPtr) {
        const ref = this.refs.get(refId);
        const nameBytes = this.buff.subarray(namePtr, namePtr + strLen);
        const name = this.textDecoder.decode(nameBytes);
        let val = this.serializer.read_val(valPtr);

        if (val.isRef) {

        } else {
            ref[name] = val.val;
        }
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
            const arg = this.serializer.read_val(argPtr);
            retVal = fn.apply(ref, [arg.val]);
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

    drop_val(refId) {
        const res = this.refs.delete(refId);
    }

}
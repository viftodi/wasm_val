// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import { MapCache } from "./map_cache.js"

export class Serializer {

    static get type_tag() {
        return {
            Empty: 0,
            BoolFalse: 1,
            BoolTrue: 2,
            Int8: 3,
            UInt8: 4,
            Int16: 5,
            UInt16: 6,
            Int32: 7,
            UInt32: 8,
            F32: 9,
            F64: 10,
            String: 11,
            TypedArray: 12,
            Object: 13,
            Function: 14,
            Ref: 15,
            Lambda: 16,
            LambdaArg: 17,
            LambdaArgs: 18,
            Error: 19,
            Unknown: 20, // To be used for sanity checks
        }
    };

    //Used to typed arrays
    static get array_type_tag() {
        return {
            i8: 1,
            u8: 2,
            i16: 3,
            u16: 4,
            i32: 5,
            u32: 6,
            f32: 7,
            f64: 8,
        }
    };


    static get type_size() {
        return {
            empty: 1,
            boolean: 1,
            b8: 1,
            b16: 2,
            b32: 4,
            b64: 8,
            ref: 4,
        }
    }

    constructor(wasmModule, allocFn) {

        this.wasmModule = wasmModule;
        this.allocFn = allocFn;
        // Not sure this is 100% correct
        this.allocBarrier = allocFn(1); // TODO maybe free this someday

        this.stringCache = new MapCache(128); // TODO make it possible to customize the size

        const typeSize = Serializer.type_size;

        this.type_size = typeSize;

        this.type_tag = Serializer.type_tag;

        const typeSizeMap = new Map();

        typeSizeMap.set(typeof undefined, typeSize.empty);
        typeSizeMap.set(typeof true, typeSize.boolean);
        typeSizeMap.set(typeof 0, typeSize.b64);
        typeSizeMap.set(typeof {}, typeSize.ref);
        typeSizeMap.set(typeof function () { }, typeSize.ref);

        this.typeSizeMap = typeSizeMap;

        const buff_1 = new ArrayBuffer(1);
        const view_u8 = new Uint8Array(buff_1);
        const view_i8 = new Int8Array(buff_1);

        this.b8_helper = {
            buff: buff_1,
            view_u8: view_u8,
            view_i8: view_i8,
        }

        const buff_2 = new ArrayBuffer(2);
        const view_u8_b2 = new Uint8Array(buff_2);
        const view_u16 = new Uint16Array(buff_2);
        const view_i16 = new Int16Array(buff_2);

        this.b16_helper = {
            buff: buff_2,
            view_u8: view_u8_b2,
            view_u16: view_u16,
            view_i16: view_i16,
        }

        const buff_4 = new ArrayBuffer(4);
        const view_u8_b4 = new Uint8Array(buff_4);
        const view_u32 = new Uint32Array(buff_4);
        const view_i32 = new Int32Array(buff_4);
        const view_f32 = new Float32Array(buff_4);

        this.b32_helper = {
            buff: buff_4,
            view_u8: view_u8_b4,
            view_u32: view_u32,
            view_i32: view_i32,
            view_f32: view_f32,
        }

        const buff_8 = new ArrayBuffer(8);
        const view_u8_b8 = new Uint8Array(buff_8);
        const view_f64 = new Float64Array(buff_8);

        this.f64_helper = {
            buff: buff_8,
            view_u8: view_u8_b8,
            view_f64: view_f64,
        }

        this.textDecoder = new TextDecoder("utf8");
        this.textEncoder = new TextEncoder("utf8");

        this.ptrBox = function (ptr_val) {
            let ptr = ptr_val;

            return {
                get: function () { return ptr; },
                get_then_inc: function (offset) { const ptr_ = ptr; ptr += offset; return ptr_; },
                inc_then_get: function (offset) { ptr += offset; return ptr },
            }

        }
    }

    get buff() {
        return this.wasmModule.buff;
    }

    get_rust_lambda_callback(key) {
        return this.wasmModule.get_rust_lambda_callback(key);
    }

    get_rust_lambda_callback_arg(key) {
        return this.wasmModule.get_rust_lambda_callback_arg(key);
    }

    get_size_val(val) {
        if (val === null) {
            return this.type_size.empty;
        } else {
            return this.typeSizeMap.get(typeof val);
        }
    }


    write_empty(ptr, _) {
        this.buff[ptr] = this.type_tag.Empty;
        return ptr + 1;
    }


    write_bool(ptr, val) {
        let tag = this.type_tag.Unknown; //Sanity
        if (val === false) {
            tag = this.type_tag.BoolFalse;
        } else if (val === true) {
            tag = this.type_tag.BoolTrue;
        }

        this.buff[ptr] = tag;
        return ptr + 1;
    }

    write_number(ptr, val) {
        this.buff[ptr] = this.type_tag.F64;
        this.f64_helper.view_f64[0] = val;
        this.buff.set(this.f64_helper.view_u8, ptr + 1);

        return ptr + 1 + this.type_size.number;
    }

    write_string(ptr, val) {
        const encodedStr = this.textEncoder.encode(val);
        const strLen = encodedStr.length;

        const strPtr = this.allocFn(strLen);

        this.buff.set(encodedStr, strPtr);

        this.buff[ptr] = this.type_tag.String;

        this.b32_helper.view_u32[0] = strLen;

        this.buff.set(this.b32_helper.view_u8, ptr + 1); // String length

        this.b32_helper.view_u32[0] = strPtr;

        this.buff.set(this.b32_helper.view_u8, ptr + 1 + 4);

        return ptr + 1 + this.type_size.b32 * 2;
    }

    write_object(ptr, val, ref_id) {
        this.buff[ptr] = this.type_tag.Object;
        this.b32_helper.view_u32[0] = ref_id;
        this.buff.set(this.b32_helper.view_u8, ptr + 1);

        return ptr + 1 + this.type_size.ref;
    }

    write_function(ptr, val, ref_id) {
        this.buff[ptr] = this.type_tag.Function;
        this.b32_helper.view_u32[0] = ref_id;
        this.buff.set(this.b32_helper.view_u8, ptr + 1);

        return ptr + 1 + this.type_size.ref;
    }

    write_val(ptr, val, ref_id) {
        if (val === undefined || val === null) {
            return this.write_empty(ptr);
        } else {
            const type = typeof val;

            // TODO refactor using Map<typeof, write_fn>
            if (type === "boolean") {
                this.write_bool(ptr, val);
            } else if (type === "number") {
                this.write_number(ptr, val);
            } else if (type === "string") {
                this.write_string(ptr, val);
            } else if (type === "object") {
                this.write_object(ptr, val, ref_id);
            } else if (type === "function") {
                this.write_function(ptr, val, ref_id);
            }
        }
    }

    read_i8(ptrBox) {
        this.b8_helper.view_u8[0] = this.buff[ptrBox.get_then_inc(1)];

        return this.b8_helper.view_i8[0];
    }

    read_u8(ptrBox) {
        return this.buff[ptrBox.get_then_inc(1)];
    }

    read_i16(ptrBox) {
        const subBuff = this.buff.subarray(ptrBox.get(), ptrBox.inc_then_get(2));

        this.b16_helper.view_u8.set(subBuff);

        return this.b16_helper.view_i16[0];
    }

    read_u16(ptrBox) {
        const subBuff = this.buff.subarray(ptrBox.get(), ptrBox.inc_then_get(2));

        this.b16_helper.view_u8.set(subBuff);

        return this.b16_helper.view_u16[0];
    }

    read_i32(ptrBox) {
        const subBuff = this.buff.subarray(ptrBox.get(), ptrBox.inc_then_get(4));

        this.b32_helper.view_u8.set(subBuff);

        return this.b32_helper.view_i32[0];
    }

    read_u32(ptrBox) {
        const subBuff = this.buff.subarray(ptrBox.get(), ptrBox.inc_then_get(4));

        this.b32_helper.view_u8.set(subBuff);

        return this.b32_helper.view_u32[0];
    }

    read_f32(ptrBox) {
        const subBuff = this.buff.subarray(ptrBox.get(), ptrBox.inc_then_get(4));

        this.b32_helper.view_u8.set(subBuff);

        return this.b32_helper.view_f32[0];
    }

    read_f64(ptrBox) {
        const subBuff = this.buff.subarray(ptrBox.get(), ptrBox.inc_then_get(8));

        this.f64_helper.view_u8.set(subBuff);

        return this.f64_helper.view_f64[0];
    }

    _read_string(strPtr, strLen) {
        const strBytes = this.buff.subarray(strPtr, strPtr + strLen);
        const str = this.textDecoder.decode(strBytes);

        return str;
    }

    read_string_(strLen, strPtr) {
        if (strPtr < this.allocBarrier) {
            return this.stringCache.getOrSet(strPtr, () => {
                return this._read_string(strPtr, strLen);
            })
        } else {
            return this._read_string(strPtr, strLen);
        }
    }

    read_string(ptrBox) {
        const strLen = this.read_u32(ptrBox);
        const strPtr = this.read_u32(ptrBox);

        return this.read_string_(strLen, strPtr);
    }

    read_lambda(ptrBox) {
        const key = this.read_u32(ptrBox);

        return this.get_rust_lambda_callback(key);
    }

    read_lambda_arg(ptrBox) {
        const key = this.read_u32(ptrBox);

        return this.get_rust_lambda_callback_arg(key);
    }

    read_val(ptr) {
        const ptrBox = new this.ptrBox(ptr);

        return this._read_val(ptrBox);
    }

    _read_val(ptrBox) {

        const tag = this.buff[ptrBox.get_then_inc(1)];
        const ret = { isRef: false, val: null };

        // Repetitive code
        // TODO Can be refactored using Map<typeof string, fn read_val>

        if (tag === this.type_tag.BoolFalse) {
            ret.val = false;
        } else if (tag === this.type_tag.BoolTrue) {
            ret.val = true;
        } else if (tag === this.type_tag.Int8) {
            ret.val = this.read_i8(ptrBox);
        } else if (tag === this.type_tag.UInt8) {
            ret.val = this.read_u8(ptrBox);
        } else if (tag === this.type_tag.Int16) {
            ret.val = this.read_i16(ptrBox);
        } else if (tag === this.type_tag.UInt16) {
            ret.val = this.read_u16(ptrBox);
        } else if (tag === this.type_tag.Int32) {
            ret.val = this.read_i32(ptrBox);
        } else if (tag === this.type_tag.UInt32) {
            ret.val = this.read_u32(ptrBox);
        } else if (tag === this.type_tag.F32) {
            ret.val = this.read_f32(ptrBox);
        } else if (tag === this.type_tag.F64) {
            ret.val = this.read_f64(ptrBox);
        } else if (tag === this.type_tag.String) {
            ret.val = this.read_string(ptrBox);
        } else if (tag === this.type_tag.Ref) {
            ret.isRef = true;
            ret.val = this.read_u32(ptrBox);
        } else if (tag === this.type_tag.Lambda) {
            ret.val = this.read_lambda(ptrBox);
        } else if (tag === this.type_tag.LambdaArg) {
            ret.val = this.read_lambda_arg(ptrBox);
        }

        return ret;

    }

    read_vals(len, ptr) {
        const ptrBox = new this.ptrBox(ptr);
        const vals = [];

        for (let nr = 0; nr < len; nr++) {
            const val = this._read_val(ptrBox);
            vals.push(val);
        }

        return vals;
    }

}
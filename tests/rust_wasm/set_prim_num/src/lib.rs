// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

extern crate wasm_val;

use wasm_val::JsValue;

#[no_mangle]
pub extern "C" fn set_i8_min() -> () {
    let i8_min = JsValue::get_global("i8_min");

    i8_min.set_val("set", -128_i8);
}

#[no_mangle]
pub extern "C" fn set_i8_max() -> () {
    let i8_max = JsValue::get_global("i8_max");

    i8_max.set_val("set", 127_i8);
}

#[no_mangle]
pub extern "C" fn set_u8_min() -> () {
    let u8_min = JsValue::get_global("u8_min");

    u8_min.set_val("set", 0_u8);
}

#[no_mangle]
pub extern "C" fn set_u8_max() -> () {
    let u8_min = JsValue::get_global("u8_max");

    u8_min.set_val("set", 255_u8);
}

#[no_mangle]
pub extern "C" fn set_i16_min() -> () {
    let i16_min = JsValue::get_global("i16_min");

    i16_min.set_val("set", -32768_i16);
}

#[no_mangle]
pub extern "C" fn set_i16_max() -> () {
    let i16_max = JsValue::get_global("i16_max");

    i16_max.set_val("set", 32767_i16);
}

#[no_mangle]
pub extern "C" fn set_u16_min() -> () {
    let u16_min = JsValue::get_global("u16_min");

    u16_min.set_val("set", 0_u16);
}

#[no_mangle]
pub extern "C" fn set_u16_max() -> () {
    let u16_max = JsValue::get_global("u16_max");

    u16_max.set_val("set", 65535_u16);
}

#[no_mangle]
pub extern "C" fn set_i32_min() -> () {
    let i32_min = JsValue::get_global("i32_min");

    i32_min.set_val("set", -2147483648_i32);
}

#[no_mangle]
pub extern "C" fn set_i32_max() -> () {
    let i32_max = JsValue::get_global("i32_max");

    i32_max.set_val("set", 2147483647_i32);
}

#[no_mangle]
pub extern "C" fn set_u32_min() -> () {
    let u32_min = JsValue::get_global("u32_min");

    u32_min.set_val("set", 0_u32);
}

#[no_mangle]
pub extern "C" fn set_u32_max() -> () {
    let u32_max = JsValue::get_global("u32_max");

    u32_max.set_val("set", 4294967295_u32);
}

#[no_mangle]
pub extern "C" fn set_f32_neg() -> () {
    let f32_neg = JsValue::get_global("f32_neg");

    f32_neg.set_val("set", -10.187_f32);
}

#[no_mangle]
pub extern "C" fn set_f32_pos() -> () {
    let f32_pos = JsValue::get_global("f32_pos");

    f32_pos.set_val("set", 155.335_f32);
}
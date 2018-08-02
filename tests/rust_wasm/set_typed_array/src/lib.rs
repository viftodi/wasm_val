// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

extern crate wasm_val;

use wasm_val::{JsValue};

#[no_mangle]
pub extern "C" fn set_typed_array_i8() -> () {
    let a_i8: &[i8] = &[-128, -64, 0, 1, 100, 127];

    let cont = JsValue::get_global("t_i8");

    cont.set_val("set", a_i8);
}

#[no_mangle]
pub extern "C" fn set_typed_array_u8() -> () {
    let a_u8: &[u8] = &[0, 1, 128, 255];

    let cont = JsValue::get_global("t_u8");

    cont.set_val("set", a_u8);
}

#[no_mangle]
pub extern "C" fn set_typed_array_i16() -> () {
    let a_i16: &[i16] = &[-32768, -255, 0, 1, 1024, 32767];

    let cont = JsValue::get_global("t_i16");

    cont.set_val("set", a_i16);
}

#[no_mangle]
pub extern "C" fn set_typed_array_u16() -> () {
    let a_u16: &[u16] = &[0, 256, 1024, 65535];

    let cont = JsValue::get_global("t_u16");

    cont.set_val("set", a_u16);
}

#[no_mangle]
pub extern "C" fn set_typed_array_i32() -> () {
    let a_i32: &[i32] = &[-2_147_483_648, -65535, 0, 1, 65536, 2_147_483_647];

    let cont = JsValue::get_global("t_i32");

    cont.set_val("set", a_i32);
}

#[no_mangle]
pub extern "C" fn set_typed_array_u32() -> () {
    let a_u32: &[u32] = &[0, 1024, 2_147_483_648, 4_294_967_295];

    let cont = JsValue::get_global("t_u32");

    cont.set_val("set", a_u32);
}

#[no_mangle]
pub extern "C" fn set_typed_array_f32() -> () {
    let a_f32: &[f32] = &[-12.3, -10.4, 0., 1., 24.4, 2014.12];

    let cont = JsValue::get_global("t_f32");

    cont.set_val("set", a_f32);
}

#[no_mangle]
pub extern "C" fn set_typed_array_f64() -> () {
    let a_f64: &[f64] = &[-12.34, -10.49, 0., 1., 24.41, 2014.128];

    let cont = JsValue::get_global("t_f64");

    cont.set_val("set", a_f64);
}
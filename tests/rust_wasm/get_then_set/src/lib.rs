// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

extern crate wasm_val;

use wasm_val::{JsValue};

#[no_mangle]
pub extern "C" fn get_and_set_bool_false() -> () {
    let bool_false = JsValue::get_global("bool_false");
    let val = bool_false.get_val("get").unwrap().as_bool().unwrap();

    bool_false.set_val("set", val);
}

#[no_mangle]
pub extern "C" fn get_and_set_bool_true() -> () {
    let bool_true = JsValue::get_global("bool_true");
    let val = bool_true.get_val("get").unwrap().as_bool().unwrap();

    bool_true.set_val("set", val);
}

#[no_mangle]
pub extern "C" fn get_and_set_number_negative() -> () {
    let number_negative = JsValue::get_global("number_negative");
    let val = number_negative.get_val("get").unwrap().as_number().unwrap();

    number_negative.set_val("set", val);
}

#[no_mangle]
pub extern "C" fn get_and_set_number_positive() -> () {
    let number_positive = JsValue::get_global("number_positive");
    let val = number_positive.get_val("get").unwrap().as_number().unwrap();

    number_positive.set_val("set", val);
}

#[no_mangle]
pub extern "C" fn get_and_set_empty_string() -> () {
    let empty_string = JsValue::get_global("empty_string");
    let empty_string_val = empty_string.get_val("get").unwrap();
    let val = empty_string_val.as_str().unwrap();

    empty_string.set_val("set", val);
}

#[no_mangle]
pub extern "C" fn get_and_set_a_string() -> () {
    let a_string = JsValue::get_global("a_string");
    let a_string_val = a_string.get_val("get").unwrap();
    let val = a_string_val.as_str().unwrap();

    a_string.set_val("set", val);
}

#[no_mangle]
pub extern "C" fn set_a_rust_string() -> () {
    let s = String::from("Hello");
    let a_string = JsValue::get_global("a_rust_string");

    a_string.set_val("set", s);
}

#[no_mangle]
pub extern "C" fn get_and_set_an_object() -> () {
    let an_object = JsValue::get_global("an_object");
    let an_object_val = an_object.get_val("get").unwrap();

    an_object.set_val("set", an_object_val);
}

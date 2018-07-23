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
pub extern "C" fn call_new_no_args() -> () {
    let constructor_container = JsValue::get_global("constructor_container");
    let constructor_no_args = constructor_container.get_val("no_args").unwrap();

    constructor_no_args.new();
}

#[no_mangle]
pub extern "C" fn call_new_no_args_this_val() -> () {
    let constructor_container = JsValue::get_global("constructor_container");
    let constructor_no_args_this_val = constructor_container.get_val("no_args_this_val").unwrap();
    let instance = constructor_no_args_this_val.new().unwrap();
    let val = instance.get_val("val").unwrap().as_number().unwrap();

    constructor_container.set_val("val", val);
}

#[no_mangle]
pub extern "C" fn call_new_one_arg() -> () {
    let constructor_container = JsValue::get_global("constructor_container");
    let constructor_one_arg = constructor_container.get_val("one_arg").unwrap();

    constructor_one_arg.new_with_arg("a value");
}

#[no_mangle]
pub extern "C" fn call_new_multiple_args() -> () {
    let constructor_container = JsValue::get_global("constructor_container");
    let constructor_one_arg = constructor_container.get_val("multiple_args").unwrap();

    constructor_one_arg.new_with_args(&[&3.14, &"a value", &true, &-23_i16]);
}
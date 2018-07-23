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
pub extern "C" fn call_fn_no_args() -> () {
    let fn_container = JsValue::get_global("fn_container");
    let fn_no_args = fn_container.get_val("fn_no_args").unwrap();

    fn_no_args.call();
}


#[no_mangle]
pub extern "C" fn call_fn_no_args_return() -> () {
    let fn_container = JsValue::get_global("fn_container");
    let fn_no_args_return = fn_container.get_val("fn_no_args_return").unwrap();

    let rtn_val = fn_no_args_return.call().unwrap().as_number().unwrap();

    fn_container.set_val("fn_no_args_return_val", rtn_val)
}

#[no_mangle]
pub extern "C" fn call_fn_one_arg() -> () {
    let fn_container = JsValue::get_global("fn_container");
    let fn_one_arg = fn_container.get_val("fn_one_arg").unwrap();

    fn_one_arg.call_with_arg("a string arg");
}

#[no_mangle]
pub extern "C" fn call_fn_multiple_args() -> () {
    let fn_container = JsValue::get_global("fn_container");
    let fn_multiple_args = fn_container.get_val("fn_multiple_args").unwrap();

    fn_multiple_args.call_with_args(&[&3.14, &false, &42_u32, &-1_i8, &"some string"]);
}

#[no_mangle]
pub extern "C" fn call_member_fn_no_args() -> () {
    let fn_container = JsValue::get_global("fn_container");
    let fn_member_container = fn_container.get_val("fn_member_container").unwrap();
    fn_member_container.call_method("fn_no_args");
}

#[no_mangle]
pub extern "C" fn call_member_fn_no_args_return() -> () {
    let fn_container = JsValue::get_global("fn_container");
    let fn_member_container = fn_container.get_val("fn_member_container").unwrap();

    let rtn_val = fn_member_container.call_method("fn_no_args_return").unwrap();

    fn_member_container.set_val("fn_no_args_return_val", rtn_val)
}

#[no_mangle]
pub extern "C" fn call_member_fn_one_arg() -> () {
    let fn_container = JsValue::get_global("fn_container");
    let fn_member_container = fn_container.get_val("fn_member_container").unwrap();

    fn_member_container.call_method_with_arg("fn_one_arg", "a string arg");
}

#[no_mangle]
pub extern "C" fn call_member_fn_multiple_args() -> () {
    let fn_container = JsValue::get_global("fn_container");
    let fn_member_container = fn_container.get_val("fn_member_container").unwrap();

    fn_member_container.call_method_with_args("fn_multiple_args", &[&3.14, &false, &42_u32, &-1_i8, &"some string"]);
}
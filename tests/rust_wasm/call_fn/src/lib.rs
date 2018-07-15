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

    fn_container.call("fn_no_args");
}


#[no_mangle]
pub extern "C" fn call_fn_no_args_return_val() -> () {
    let fn_container = JsValue::get_global("fn_container");

    let rtn_val = fn_container.call("fn_no_args_return").unwrap().as_number().unwrap();

    fn_container.set_val("fn_no_args_return_val", rtn_val)
}

#[no_mangle]
pub extern "C" fn call_fn_one_arg_val() -> () {
    let fn_container = JsValue::get_global("fn_container");

    fn_container.call_with_arg("fn_one_arg_val", "a string arg");
}
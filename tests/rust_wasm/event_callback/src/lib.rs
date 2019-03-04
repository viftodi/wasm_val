// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

extern crate wasm_val;

use wasm_val::{JsValue, JsSerializable};

#[no_mangle]
pub extern "C" fn register_callback_no_args() -> () {
    let container = JsValue::get_global("container");

    const CLOSURE: &dyn Fn() -> () = &|| {
        let container = JsValue::get_global("container");

        container.set_val("no_args_callback_rust_called", true);
    };

    container.call_method_with_arg("register_callback_no_args", CLOSURE);
}

#[no_mangle]
pub extern "C" fn register_callback_no_args_ret() -> () {
    let container = JsValue::get_global("container");

    const CLOSURE: &dyn Fn() -> (Box<JsSerializable>) = &|| {
        let container = JsValue::get_global("container");

        container.set_val("no_args_callback_ret_rust_called", true);

        return Box::new(42);
    };

    container.call_method_with_arg("register_callback_no_args_ret", CLOSURE);
}

#[no_mangle]
pub extern "C" fn register_callback_one_arg() -> () {
    let container = JsValue::get_global("container");

    const CLOSURE: &dyn Fn(JsValue) -> () = &|val:JsValue| {
        let container = JsValue::get_global("container");

        container.set_val("one_arg_callback_rust_called", true);
        container.set_val("one_arg_callback_rust_val", val);
    };

    container.call_method_with_arg("register_callback_one_arg", CLOSURE);
}

#[no_mangle]
pub extern "C" fn register_callback_one_arg_ret() -> () {
    let container = JsValue::get_global("container");

    const CLOSURE: &dyn Fn(JsValue) -> (Box<JsSerializable>) = &|val:JsValue| {
        let container = JsValue::get_global("container");

        container.set_val("one_arg_callback_ret_rust_called", true);
        container.set_val("one_arg_callback_ret_rust_val", val);

        return Box::new(42);
    };

    container.call_method_with_arg("register_callback_one_arg_ret", CLOSURE);
}

#[no_mangle]
pub extern "C" fn register_nested_callbacks() -> () {
    let container = JsValue::get_global("container");

    const FIRST_CALBACK: &dyn Fn(JsValue) -> () = &|val:JsValue| {
        val.call_with_arg(SECOND_CALBACK);
    };

    const SECOND_CALBACK: &dyn Fn(JsValue) -> () = &|val:JsValue| {
        let container = JsValue::get_global("container");

        container.set_val("nested_callback_rust_val", val);
    };

    container.call_method_with_arg("register_first_nested_callback", FIRST_CALBACK);
}

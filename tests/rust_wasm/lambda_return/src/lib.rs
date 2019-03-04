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
pub extern "C" fn chain_promises() -> () {
    let container = JsValue::get_global("container");

    const FIRST_THEN: &dyn Fn(JsValue) -> (Box<JsSerializable>) = &|val: JsValue| {
        let container = JsValue::get_global("container");
        let nr = val.as_number().unwrap() as u32;

        container.set_val("first_lambda_ret_arg", nr);

        return Box::new(nr + 1);

    };

    const SECOND_THEN: &dyn Fn(JsValue) -> (Box<JsSerializable>) = &|val: JsValue| {
        let container = JsValue::get_global("container");
        let nr = val.as_number().unwrap() as u32;

        container.set_val("second_lambda_ret_arg", nr);

        return Box::new(nr + 1);

    };

    container.get_val("ret_40_promise").unwrap()
        .call_method_with_arg("then", FIRST_THEN).unwrap()
        .call_method_with_arg("then", SECOND_THEN);

}

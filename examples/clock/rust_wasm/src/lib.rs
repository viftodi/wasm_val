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
pub extern "C" fn set_time() -> () {
    let document = JsValue::get_global("document");
    let date = JsValue::get_global("Date");
    let date_now = date.new().unwrap();

    let hours = date_now.call_method("getHours").unwrap().as_number().unwrap();
    let minutes = date_now.call_method("getMinutes").unwrap().as_number().unwrap();
    let seconds = date_now.call_method("getSeconds").unwrap().as_number().unwrap();

    let s = format!("The current time is: {:02.0}H:{:02.0}m:{:02.0}s", hours, minutes, seconds);

    let div_content = document.call_method_with_arg("getElementById", "rust_content").unwrap();

    div_content.set_val("textContent", s.as_str());
}

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
pub extern "C" fn main() -> () {
    let performance = JsValue::get_global("performance");
    let before = performance.call("now").unwrap().as_number().unwrap();
    let console = JsValue::get_global("console");
    let document = JsValue::get_global("document");
    let body = document.get_val("body").unwrap();
    let new_div = document.call_with_arg("createElement", "div").unwrap();
    let text_node = document.call_with_arg("createTextNode", "Hello from Rust <3").unwrap();
    
    new_div.call_with_arg("appendChild", text_node);
    body.call_with_arg("appendChild", new_div);


    let after = performance.call("now").unwrap().as_number().unwrap();
    let diff = after - before;
    let s1 = format!("Rust finished in about {:.2} ms", diff);

    console.call_with_arg("log", s1.as_str());
}

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
pub extern "C" fn main() -> () {
    let performance = JsValue::get_global("performance");
    let performance_now = performance.get_val("now").unwrap();
    let before = performance_now.call().unwrap().as_number().unwrap();
    let console = JsValue::get_global("console");
    let document = JsValue::get_global("document"); 
    let div_content = document.call_method_with_arg("getElementById", "rust_content").unwrap();

    div_content.set_val("textContent", "Hello world from Rust! <3 <3 <3");

    let after = performance_now.call().unwrap().as_number().unwrap();
    let diff = after - before;
    let s1 = format!("Rust finished in about {:.2} ms", diff);

    console.call_method_with_arg("log", s1.as_str());
}

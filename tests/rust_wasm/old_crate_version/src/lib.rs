// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

extern crate wasm_val;
use wasm_val::JsValue;

#[no_mangle]
pub extern "C" fn main() -> () {
    let _ = JsValue::get_global("_");
}

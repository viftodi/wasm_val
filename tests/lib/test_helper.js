// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import { WasmValModule } from "/node_modules/wasm_val_module/wasm_val_module.js";

export default function getTestModule(wasmFile, context, options) {
    const path = `/rust_wasm/${wasmFile}/target/wasm32-unknown-unknown/release/${wasmFile}.wasm`;
    
    return new WasmValModule(path, context, options).run();
}
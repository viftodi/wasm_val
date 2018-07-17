# wasm_val a rust wasm library that provides a type-safe API that can dynamically call into javascript.

## Introduction
wasm-val is a rust library accompanied by a javascript counterpart helper that provides a type-safe API to access dynamically into javascript.

It has been inspired by the emscripten's C++ [Val](https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/embind.html#using-val-to-transliterate-javascript-to-c) as well as the Graal-VM polyglot [Context](http://www.graalvm.org/sdk/javadoc/org/graalvm/polyglot/Context.html) API.

While I am aware that there are already more mature solutions out there that allow to call into javascript from a rust wasm, such as wasm-bind I believe an alternative way of doing it could always be appreciated.

The end goal of this project is to have a dynamic and type-safe API to access any javascript API provided by the browser.

This is my first Rust project and it's been and I hope will continue to be a great learning experience as I discover more and more of rust.


## License

This project is dual licenced under Apache 2 and the MIT license.

For more details check the LICENCE.md file

## Features

It is currently possible to do the following:
 - Obtain global values from the javascript context
 - Get and Set values from rust on javascript objects
 - Call a function with zero or one arguments


The following types can be passed from javascript to rust/wasm :
 - Null/Undefined
 - Boolean
 - Number
 - String
 - Object

 The following types can be currently passed from rust to javascript and be properly deserialized in javascript:

 - bool
 - rust primitive numeric types (except i64/u64)
 - str

## Get started

The project has two parts: wasm-val the rust library that provides the API and wasm-val-module which is the javascript counterpart that does the proper serialization.

###  On the rust side

Add the wasm_val depencendy to your Cargo.toml

```toml
[dependencies]
wasm_val = "0.2.0"
```

It is also important to also declare your rust project type as cdylib.
For example:

```toml
[lib]
path = "src/lib.rs"
crate-type = ["cdylib"]
```

In your main lib.rs declare the wasm_val crate

Also export an extern "C" main function with the #[no_mangle] atribute so that it can be accessible from javascript.

Bellow is a hello world example.

```rust
extern crate wasm_val;

use wasm_val::{JsValue};

#[no_mangle]
pub extern "C" fn main() -> () {
    let console = JsValue::get_global("console");

    console.call_with_arg("log", "Hello from Rust :)");
}
```

Note: It is recommended to always build your project in release mode due to current limitations of the wasm32-unknown-unknown target. For example:

```bash
cargo build --target=wasm32-unknown-unknown --release
````

### On the javascript side

Assuming you're in the folder where your web-app resides.

Firstly either install the wasm-val-module using npm :

```bash
npm install wasm_val_module@0.2.2

```

Or obtain it manually from this repository.

Then in your index.html or equivalent:

```html
<script type="module">
    import { WasmValModule } from "./node_modules/wasm-val-module/wasm_val_module.js";
    const mod = new WasmValModule('path/to/rust_lib.wasm', window);

    mod.run()
        .then((instance) => {
            instance.exports.main();
        });
</script>
````

The WasmValModule constructor takes the path to the wasm file as well as a context object. 

The context object is what provides the accessible javascript members on the rust side.

And hopefully that's it.

Also check the examples folder for more insights.
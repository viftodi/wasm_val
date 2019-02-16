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

## Preview

It is currently possible to obtain values from javascript and get/set their properties as well as call method on javascript objects.

It is also possible to call constructors and obtain functions for repeated calls.

Below is an example demonstrating various features:

```rust
// You can obtain a value from the global context
let document = JsValue::get_global("document");
let body = document.get_val("body").unwrap(); 
// And get a property of such a value
let title = document.get_val("title").unwrap().as_str().unwrap();
let from_rust = format!("Hello from rust <3 your title is: {}", title);
// You can also call a constructor
let textNode = document.call_method_with_arg("createTextNode", from_rust.as_str()).unwrap();
// Pass a previously obtained javascript value back to javascript
body.call_method_with_arg("appendChild", textNode);

// If you plan to call a function multiple times for efficiently reasons you can obtain a reference to it:
let console = JSValue::get_global("console");
let console_log = console.get_val("log").unwrap();

console_log.call_with_arg("Hello world");
console_log.call_with_args(&[&"hello world", &true, &" ", &3.14]);

// You can also pass a closure on the javascript side, useful for registering callbacks
const CLOSURE: &dyn Fn(JsValue) -> () = &|val: JsValue| {
    let key_code = val.get_val("keyCode").unwrap();

    let console = JsValue::get_global("console");

    console.call_method_with_args("log", &["Keydown pressed :", &key_code]);
};

body.call_method_with_args("addEventListener", &[&"keydown", &CLOSURE]);
```

The following types can be send from rust to javascript:

 - boolean
 - primitive numeric types (except i64/u64)
 - str
 - JsValue (values obtained from javascript)
 - Fn() -> () and Fn(JSValue) -> () that are useful mostly to register event callbacks

## Examples

There are multiple examples provided in the examples folder :
 - hello_world : shows the ability to get and set values, as well as call functions.
 - clock : makes use of the ability to call constructors and shows a basic animation managed by javascript
 - create_element : showcases mainly the ability to call functions with multiple parameters
 - canvas_animate_solar_system : A more complete example that has been adapted from the canvas animation example on mozilla's site
 - register_event_callback : Register callbacks on the rust side to animate the movement of a rectangle in a canvas
 - webgl_animate_squares : On click add a random animate square. Makes use of the ability to pass TypedArrays to javascript

## Get started

The project has two parts: wasm_val the rust library that provides the API and wasm_val_module which is the javascript counterpart that does the proper serialization.

###  On the rust side

If you haven't done it already, add the wasm32-unknown-unknown target via rustup:

```bash
rustup target add wasm32-unknown-unknown
```

Add the wasm_val depencendy to your Cargo.toml

```toml
[dependencies]
wasm_val = "0.3.4"
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

Firstly either install the wasm_val_module using npm :

```bash
npm install wasm_val_module@0.3.4

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

The WasmValModule constructor takes the path to the wasm file as well as a context object as well as an optional options object. 

The context object is what provides the accessible javascript members on the rust side.

The default options are:

```javascript
{
    rust_panic: {
        register_hook: true,
        panic_fn: console.error,
    }
}
```

Consult the documentation of wasm_val_module for additional information.

And hopefully that's it.


## Known issues and limitations

Currently rust closures send to the javascript side (such as event listeners) are never garbage collected. Use them sparingly. 
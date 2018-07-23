## Canvas animation - solar system
This example demonstrates animating the canvas.

It makes use of the ability to pass multiple arguments to functions.

The animation is performed on the javascript side via a call to requestAnimationFrame

The rust example has been adapted from the javascript code provided by Mozilla in the [Canvas API Tutorial - Basic animations](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations#An_animated_solar_system)

## Usage

### First install the wasm-val-module
In the root folder do:

```bash
npm install
```

then in the rust_wasm folder build the wasm file. For example:

```bash
cd rust_wasm
cargo build --target=wasm32-unknown-unknown --release
```

Then in the root folder again serve the files. For example using the npm package serve.

Install serve once globally with:

```bash
npm install -g serve
```

Then run it:

```
serve
```
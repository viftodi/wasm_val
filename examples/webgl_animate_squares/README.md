## WebGL animation
This example demonstrates the ability to to animate squares using WebGl.

It makes use of the ability to send TypedArrays to javascript.
It also registers a click callback on the canvas.

The animation is performed on the javascript side via a call to requestAnimationFrame


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
## Create element
This example demonstrates the creation of an HtmlElement from rust and inserting it in the DOM.

It makes use of the ability to pass references back to javascript.

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
# wasm_val_module - The javascript companion library for the rust wasm_val crate.

# Basic usage
```javascript
const aRustWasmModule = new WasmValModule(pathToWasm, context, options);

aRustWasmModule.run()
    .then( (instance) => instance.some_rust_function());
```
The arguments are:

- pathToWasm: the path to the wasm file. Note: The provided wasm file must import the wasm_val crate.
- context: The execution context: the contents of this object will be accessible from the rust program.
- options: Additional options

The default options are:

```javascript
{
    rust_panic: {
        register_hook: true,
        panic_fn: console.error,
    }
}
```

# Consult the documentation of the wasm_val crate for additional information.

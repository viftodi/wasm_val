pub extern crate wasm_val;

use wasm_val::{JsValue};

#[no_mangle]
pub extern "C" fn main() -> u32 {

    let performance = JsValue::get_global("performance");
    let before = performance.call("now").unwrap().as_number().unwrap();
    let console = JsValue::get_global("console");
    let document = JsValue::get_global("document");    
    let div_content = document.call_with_arg("getElementById", "rust_content").unwrap();

    div_content.set_val("textContent", "Hello world from Rust! <3 <3 <3");

    let after = performance.call("now").unwrap().as_number().unwrap();
    let diff = after - before;
    let s1 = format!("Rust finished in about {:.2} ms", diff);

    console.call_with_arg("log", s1.as_str());

    return 0;
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}

// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

#[macro_use]
extern crate lazy_static;
extern crate wasm_val;

use std::sync::Mutex;
use wasm_val::{JsValue};

struct Pos { x:f64, y: f64}
struct State { left:bool, right:bool, up:bool, down: bool}

lazy_static! {
    static ref CANVAS_CONTEXT: JsValue = {
        let document = JsValue::get_global("document");
        let canvas = document.call_method_with_arg("getElementById", "canvas").unwrap();
        let context = canvas.call_method_with_arg("getContext", "2d").unwrap();

        context.set_val("fillStyle", "red");

        context
    };

    static ref POS_MUTEX: Mutex<Pos> = Mutex::new( Pos {x:400., y:400.});
    static ref STATE_MUTEX: Mutex<State> = Mutex::new(State {left:false, right:false, up:false, down:false });
}

pub fn handle_key_event(key_code: u64, val: bool) -> () {
    let mut state = STATE_MUTEX.lock().unwrap();
            
    match key_code as u64 {
        38 | 87 => state.up = val,
        40 | 83 => state.down = val,
        37 | 65 => state.left = val,
        39 | 68 => state.right = val,
        _ => (),
    }
}

#[no_mangle]
pub extern "C" fn init() -> () {
    let document = JsValue::get_global("document");
    let body = document.get_val("body").unwrap();

    const KEY_DOWN_CLOSURE: &dyn Fn(JsValue) -> () = &|val: JsValue| {
        let key_code = val.get_val("keyCode").unwrap().as_number().unwrap();

        handle_key_event(key_code as u64, true);
    };

    body.call_method_with_args("addEventListener", &[&"keydown", &KEY_DOWN_CLOSURE]);

    const KEY_UP_CLOSURE:&dyn Fn(JsValue) -> () = &|val: JsValue| {
        let key_code = val.get_val("keyCode").unwrap().as_number().unwrap();

        handle_key_event(key_code as u64, false);
    };

    body.call_method_with_args("addEventListener", &[&"keyup", &KEY_UP_CLOSURE]);

}

const SPEED: f64 = 3.5;

#[no_mangle]
pub extern "C" fn draw() -> () {
    CANVAS_CONTEXT.call_method_with_args("clearRect", &[&0, &0, &800, &800]);

    let state = STATE_MUTEX.lock().unwrap();

    let mut pos = POS_MUTEX.lock().unwrap();

    if state.left { pos.x -= SPEED }
    if state.right { pos.x += SPEED }
    if state.up { pos.y -= SPEED }
    if state.down { pos.y += SPEED }

    CANVAS_CONTEXT.call_method_with_args("fillRect", &[&pos.x, &pos.y, &50, &50]);

}

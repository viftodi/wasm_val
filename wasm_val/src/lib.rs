// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

use std::mem;
use std::cell::RefCell;
use std::rc::Rc;
use std::collections::HashMap;
use std::panic::{self, PanicInfo};

mod wasm_ffi;
mod rust_exports;
mod js_ser;
mod ser_constants;
mod js_val_impl;

pub use js_ser::JsSerializable;

#[macro_use]
extern crate num_derive;
extern crate num_traits;
extern crate byteorder;

#[no_mangle]
pub extern "C" fn wasm_val_rust_alloc(capacity: u32) -> *mut u8 {
    rust_exports::rust_alloc(capacity)
}

#[no_mangle]
pub extern "C" fn wasm_val_rust_free(ptr: u32, capacity: u32) {
    rust_exports::rust_free(ptr as *mut u8, capacity as usize);
}

#[no_mangle]
pub extern "C" fn wasm_val_get_api_version() -> u32 {
    rust_exports::get_api_version()
}

#[no_mangle]
pub extern "C" fn wasm_val_register_panic_hook() -> () {
    panic::set_hook(Box::new(|panic_info: &PanicInfo| {
        wasm_ffi::panic_fn(panic_info.to_string());
    }));
}

thread_local! {
    static CALLBACKS_KEY: RefCell<HashMap<u32, Rc<dyn Fn() -> () >>> = RefCell::new(HashMap::new());
    static CALLBACKS_RET_KEY: RefCell<HashMap<u32, Rc<dyn Fn() -> (Box<JsSerializable>) >>> = RefCell::new(HashMap::new());
    static CALLBACKS_ARG_KEY: RefCell<HashMap<u32, Rc<dyn Fn(JsValue) -> () >>> = RefCell::new(HashMap::new());
    static CALLBACKS_ARG_RET_KEY: RefCell<HashMap<u32, Rc<dyn Fn(JsValue) -> (Box<JsSerializable>) >>> = RefCell::new(HashMap::new());
    static LAST_CALLBACK_ID_KEY: RefCell<u32> = RefCell::new(1);
}

#[no_mangle]
pub extern "C" fn wasm_val_call_registered_callback(key: u32) -> () {
    let callback = CALLBACKS_KEY.with(|callbacks_cell| {
        let map = callbacks_cell.borrow();

        map[&key].clone()
    });

    callback()
}

#[no_mangle]
pub extern "C" fn wasm_val_call_registered_callback_ret(key: u32) -> (*mut u8) {
    let callback = CALLBACKS_RET_KEY.with(|callbacks_cell| {
        let map = callbacks_cell.borrow();

        map[&key].clone()
    });

    let ret = callback();
    let mut vec = JsValue::ser_single_val(&(*ret));
    let ptr = vec.as_mut_ptr();
    
    mem::forget(vec);

    ptr
}

#[no_mangle]
pub extern "C" fn wasm_val_call_registered_callback_arg(key: u32, ptr: *mut u8) -> () {
    let vec = unsafe { Vec::from_raw_parts(ptr, wasm_ffi::SINGLE_VAL_VEC_LEN, wasm_ffi::SINGLE_VAL_VEC_LEN) };
    let val = JsValue::get_single_val(vec);
    
    let callback = CALLBACKS_ARG_KEY.with(|callbacks_cell| {
        let map = callbacks_cell.borrow();
        
        map[&key].clone()
    });

    callback(val)
}

#[no_mangle]
pub extern "C" fn wasm_val_call_registered_callback_arg_ret(key: u32, ptr: *mut u8) -> (*mut u8) {
    let vec = unsafe { Vec::from_raw_parts(ptr, wasm_ffi::SINGLE_VAL_VEC_LEN, wasm_ffi::SINGLE_VAL_VEC_LEN) };
    let val = JsValue::get_single_val(vec);
    
    let callback = CALLBACKS_ARG_RET_KEY.with(|callbacks_cell| {
        let map = callbacks_cell.borrow();
        
        map[&key].clone()
    });

    let ret = callback(val);
    let mut vec = JsValue::ser_single_val(&(*ret));
    let ptr = vec.as_mut_ptr();

    mem::forget(vec);

    ptr
}

fn get_next_callback_id() -> u32 {
    LAST_CALLBACK_ID_KEY.with(|last_callback_id_cell| {
        let id = *last_callback_id_cell.borrow();

        last_callback_id_cell.replace(id + 1);

        id
    })
}

fn register_callback(callback:  &'static Fn() -> ()) -> u32  {
    CALLBACKS_KEY.with(|callbacks_cell| {
        let id = get_next_callback_id();
        callbacks_cell.borrow_mut().insert(id, Rc::new(callback));

        id
    })
}

fn register_callback_ret(callback: &'static Fn() -> (Box<JsSerializable>)) -> u32  {
    CALLBACKS_RET_KEY.with(|callbacks_cell| {
        let id = get_next_callback_id();
        callbacks_cell.borrow_mut().insert(id, Rc::new(callback));

        id
    })
}

fn register_callback_arg(callback:  &'static Fn(JsValue) -> ()) -> u32  {
    CALLBACKS_ARG_KEY.with(|callbacks_cell| {
        let id = get_next_callback_id();
        callbacks_cell.borrow_mut().insert(id, Rc::new(callback));

        id
    })
}

fn register_callback_ret_arg(callback:  &'static Fn(JsValue) -> (Box<JsSerializable>)) -> u32  {
    CALLBACKS_ARG_RET_KEY.with(|callbacks_cell| {
        let id = get_next_callback_id();
        callbacks_cell.borrow_mut().insert(id, Rc::new(callback));

        id
    })
}

pub struct JsValue {
    pub js_type: Type,
    val: Val,
}

pub enum Type {
    Empty,
    Boolean,
    Number,
    String,
    Array,
    TypedArray(ArrayType),
    Object,
    Function,
    Error,
}

pub enum ArrayType {
    I8,
    U8,
    I16,
    U16,
    I32,
    U32,
    F32,
    F64,
}

enum Val {
    None,
    Boolean(bool),
    Number(f64),
    String(String),
    Ref(u32),
}

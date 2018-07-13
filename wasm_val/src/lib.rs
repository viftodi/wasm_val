// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

use std::io::Cursor;

mod wasm_ffi;
mod rust_exports;
mod js_ser;
mod ser_constants;

use ser_constants::TypeTag;
pub use js_ser::JsSerializable;

#[macro_use]
extern crate num_derive;
extern crate num_traits;
extern crate byteorder;

use byteorder::{LittleEndian, ReadBytesExt,};
use num_traits::FromPrimitive;

#[no_mangle]
pub extern "C" fn wasm_val_rust_alloc(capacity: u32) -> *mut u8{
    rust_exports::rust_alloc(capacity)
}

pub struct JsValue {
    pub js_type: Type,
    val: Val,
}


impl Drop for JsValue {
    fn drop(&mut self) {
        match self.val {
            Val::Ref(ref_id) => wasm_ffi::drop_var(ref_id),
            _ => (),
        }
    }
}


impl JsValue {

     fn  get_single_val(vec: Vec<u8>) -> JsValue {
        let mut curs = Cursor::new(vec);
        let tag = curs.read_u8().unwrap();
        let type_tag = TypeTag::from_u8(tag).unwrap();

        match type_tag {
            TypeTag::Empty => JsValue{js_type: Type::Empty, val: Val::None},
            TypeTag::BoolFalse => JsValue{js_type: Type::Boolean, val: Val::Boolean(false)},
            TypeTag::BoolTrue => JsValue{js_type: Type::Boolean, val: Val::Boolean(true)},
            TypeTag::F64 => JsValue{js_type: Type::Number, val: Val::Number(curs.read_f64::<LittleEndian>().unwrap())},
            TypeTag::String => {
                let str_len = curs.read_u32::<LittleEndian>().unwrap();
                let str_ptr = curs.read_u32::<LittleEndian>().unwrap() as *mut u8;
                
                let s = unsafe { String::from_raw_parts(str_ptr, str_len as usize, str_len as usize) };

                JsValue{js_type: Type::String, val: Val::String(s)}
            },
            TypeTag::Object => {
                let ref_id = curs.read_u32::<LittleEndian>().unwrap();

                JsValue{js_type: Type::Object, val: Val::Ref(ref_id)}
            }
            _ => panic!()
        }
    }

    pub fn get_global(name: &str) -> JsValue {
        let vec = wasm_ffi::get_val_global(name);

        JsValue::get_single_val(vec)
    }


    pub fn get_val(&self, name: &str) -> Option<JsValue> {
        match self.val {
            Val::Ref(ref_id)  => {
                let vec = wasm_ffi::get_val(ref_id, name);

                Some(JsValue::get_single_val(vec))
            },
            _ => None
        }
    }

    pub fn set_val<S>(&self, name: &str, val: S) -> () where S: JsSerializable {
        match self.val {
            Val::Ref(ref_id) => {
                let mut vec = Vec::with_capacity(wasm_ffi::SINGLE_VAL_VEC_LEN);
                let mut cursor = Cursor::new(vec);

                val.ser(&mut cursor);

                wasm_ffi::set_val(ref_id, name, cursor.into_inner());

            }
            _ => ()
        }
    }

    pub fn call(&self, name: &str) -> Option<JsValue> {
        match self.val {
            Val::Ref(ref_id) => {
                let vec = wasm_ffi::call_0(ref_id, name);

                Some(JsValue::get_single_val(vec))
            },
            _ => None
        }
    }

    pub fn call_with_arg<S>(&self, name: &str, arg: S) -> Option<JsValue> where S: JsSerializable {
        match self.val {
            Val::Ref(ref_id) => {
                let mut vec = Vec::with_capacity(9);
                let mut cursor = Cursor::new(vec);

                arg.ser(&mut cursor);

                let ret_vec = wasm_ffi::call_1(ref_id, name, cursor.into_inner());

                Some(JsValue::get_single_val(ret_vec))
            },
            _ => None
        }
    }

    pub fn as_bool(&self) -> Option<bool> {
        match self.val {
            Val::Boolean(b) => Some(b),
            _ => None
        }
    }

    pub fn as_number(&self) -> Option<f64> {
        match self.val {
            Val::Number(f) => Some(f),
            _ => None
        }
    }

    pub fn as_str(&self) -> Option<&str> {
        match self.val {
            Val::String(ref s) => Some(s.as_str()),
            _ => None
        }
    }
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

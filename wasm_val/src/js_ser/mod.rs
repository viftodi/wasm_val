// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

use std::io::Cursor;
use ser_constants::TypeTag;

use byteorder::{LittleEndian, WriteBytesExt,};

mod js_val;
mod num;

pub trait JsSerializable {
    fn size(&self) -> u32;
    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) -> ();
}

impl JsSerializable for bool {
    fn size(&self) -> u32 { 1 }

    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) {
        match self {
            false => cursor.write_u8(TypeTag::BoolFalse as u8).unwrap(),
            true => cursor.write_u8(TypeTag::BoolTrue as u8).unwrap(),
        }
    }
}

impl<'a> JsSerializable for &'a str {
    fn size(&self) -> u32 { 9 }

    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) -> () {
        cursor.write_u8(TypeTag::String as u8).unwrap();
        cursor.write_u32::<LittleEndian>(self.len() as u32).unwrap();
        cursor.write_u32::<LittleEndian>(self.as_ptr() as u32).unwrap();
    }
}

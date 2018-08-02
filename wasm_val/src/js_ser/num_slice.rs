// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

use std::io::Cursor;

use ser_constants::TypeTag;
use super::JsSerializable;

use byteorder::{LittleEndian, WriteBytesExt,};

fn write_slice<T>(slice: &[T], cursor: &mut Cursor<Vec<u8>>) {
    cursor.write_u32::<LittleEndian>(slice.len() as u32).unwrap();
    cursor.write_u32::<LittleEndian>(slice.as_ptr() as u32).unwrap();
}

impl<'a> JsSerializable for &'a [i8] {
    fn size(&self) -> u32 { 9 }

    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) {
        cursor.write_u8(TypeTag::TypedArrayI8 as u8).unwrap();
        write_slice(self, cursor)
    }
}

impl<'a> JsSerializable for &'a [u8] {
    fn size(&self) -> u32 { 9 }

    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) {
        cursor.write_u8(TypeTag::TypedArrayU8 as u8).unwrap();
        write_slice(self, cursor)
    }
}

impl<'a>  JsSerializable for &'a [i16] {
    fn size(&self) -> u32 { 9 }

    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) {
        cursor.write_u8(TypeTag::TypedArrayI16 as u8).unwrap();
        write_slice(self, cursor)
    }
}

impl<'a>  JsSerializable for &'a [u16] {
    fn size(&self) -> u32 { 9 }

    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) {
        cursor.write_u8(TypeTag::TypedArrayU16 as u8).unwrap();
        write_slice(self, cursor)
    }
}

impl<'a>  JsSerializable for &'a [i32] {
    fn size(&self) -> u32 { 9 }

    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) {
        cursor.write_u8(TypeTag::TypedArrayI32 as u8).unwrap();
        write_slice(self, cursor)
    }
}

impl<'a>  JsSerializable for &'a [u32] {
    fn size(&self) -> u32 { 9 }

    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) {
        cursor.write_u8(TypeTag::TypedArrayU32 as u8).unwrap();
        write_slice(self, cursor)
    }
}
impl<'a>  JsSerializable for &'a [f32] {
    fn size(&self) -> u32 { 9 }

    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) {
        cursor.write_u8(TypeTag::TypedArrayF32 as u8).unwrap();
        write_slice(self, cursor)
    }
}

impl<'a>  JsSerializable for &'a [f64] {
    fn size(&self) -> u32 { 9 }

    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) {
        cursor.write_u8(TypeTag::TypedArrayF64 as u8).unwrap();
        write_slice(self, cursor)
    }
}
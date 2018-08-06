// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

use std::io::Cursor;
use ser_constants::TypeTag;
use {JsValue, Val,};
use super::{JsSerializable};

use byteorder::{LittleEndian, WriteBytesExt,};

impl JsSerializable for JsValue {
    fn size(&self) -> u32 {
        match &self.val {
            Val::None => 1,
            Val::Boolean(b) => b.size(),
            Val::Number(n) => n.size(),
            Val::Ref(r) => r.size(),
            Val::String(s) => s.as_str().size(),
        }
    }

    fn ser(&self, cursor: &mut Cursor<Vec<u8>>) -> () {
        match &self.val {
            Val::None => cursor.write_u8(TypeTag::Empty as u8).unwrap(),
            Val::Boolean(b) => b.ser(cursor),
            Val::Number(n) => n.ser(cursor),
            Val::String(s) => s.as_str().ser(cursor),
            Val::Ref(ref ref_id) => {
                cursor.write_u8(TypeTag::Ref as u8).unwrap();
                cursor.write_u32::<LittleEndian>(*ref_id).unwrap();
            },
        }
    }
}

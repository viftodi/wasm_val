// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

use {JsValue, Val,};

impl JsValue {
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

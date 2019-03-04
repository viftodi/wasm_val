// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

use std::mem;

const API_VERSION: u32 = 8;

pub fn rust_alloc(capacity: u32) -> *mut u8 {
    let mut mem = Vec::with_capacity(capacity as usize);
    let c_ptr = mem.as_mut_ptr();
    mem::forget(mem);

    c_ptr
}

pub fn rust_free(ptr: *mut u8, capacity: usize) {
    let _vec = unsafe { Vec::from_raw_parts(ptr, capacity, capacity) };
}

pub fn get_api_version() -> u32 {
    API_VERSION
}

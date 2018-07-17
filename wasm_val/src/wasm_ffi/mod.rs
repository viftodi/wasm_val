// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

mod js_exports;

pub const SINGLE_VAL_VEC_LEN: usize = 9 as usize; // 1 byte tag and at most another 8 bytes for a number/f64 or 2 pointers

pub fn get_val_global(name: &str) -> Vec<u8> {
    let ptr = unsafe { js_exports::get_val_global(name.len() as u32, name.as_ptr()) as *mut u8 };
    let vec = unsafe { Vec::from_raw_parts(ptr, SINGLE_VAL_VEC_LEN, SINGLE_VAL_VEC_LEN) };

    return vec;
}

pub fn get_val(ref_id: u32, name: &str) -> Vec<u8> {
    let ptr = unsafe { js_exports::get_val(ref_id, name.len() as u32, name.as_ptr()) as *mut u8 };
    let vec = unsafe { Vec::from_raw_parts(ptr, SINGLE_VAL_VEC_LEN, SINGLE_VAL_VEC_LEN) };

    return vec;
}

pub fn set_val(ref_id: u32, name: &str, val: Vec<u8>) -> () {
    let ptr = val.as_ptr() as *const u8;

    unsafe { js_exports::set_val(ref_id, name.len() as u32, name.as_ptr(), ptr) };
}

pub fn call_0(ref_id: u32, name: &str) -> Vec<u8> {
    let ptr = unsafe { js_exports::call_0(ref_id, name.len() as u32, name.as_ptr()) as *mut u8 };
    let vec = unsafe { Vec::from_raw_parts(ptr, SINGLE_VAL_VEC_LEN, SINGLE_VAL_VEC_LEN) };

    return vec;
}

pub fn call_1(ref_id: u32, name: &str, arg: Vec<u8>) -> Vec<u8> {
    let arg_ptr = arg.as_ptr() as *const u8;

    let ptr = unsafe { js_exports::call_1(ref_id, name.len() as u32, name.as_ptr(), arg_ptr) as *mut u8 };
    let vec = unsafe { Vec::from_raw_parts(ptr, SINGLE_VAL_VEC_LEN, SINGLE_VAL_VEC_LEN) };

    return vec;
}

pub fn call_2(ref_id: u32, name: &str, arg1: Vec<u8>, arg2: Vec<u8>) -> Vec<u8> {
    let arg1_ptr = arg1.as_ptr() as * const u8;
    let arg2_ptr = arg2.as_ptr() as * const u8;

    let ptr = unsafe { js_exports::call_2(ref_id, name.len() as u32, name.as_ptr(), arg1_ptr, arg2_ptr) as *mut u8 };
    let vec = unsafe { Vec::from_raw_parts(ptr, SINGLE_VAL_VEC_LEN, SINGLE_VAL_VEC_LEN) };

    return vec;
}

pub fn new_0(ref_id: u32) -> Vec<u8> {
    let ptr = unsafe { js_exports::new_0(ref_id) as *mut u8 };
    let vec = unsafe { Vec::from_raw_parts(ptr, SINGLE_VAL_VEC_LEN, SINGLE_VAL_VEC_LEN) };

    return vec;
}

pub fn new_1(ref_id: u32, arg: Vec<u8>) -> Vec<u8> {
    let arg_ptr = arg.as_ptr() as *const u8;

    let ptr = unsafe { js_exports::new_1(ref_id, arg_ptr) as *mut u8 };
    let vec = unsafe { Vec::from_raw_parts(ptr, SINGLE_VAL_VEC_LEN, SINGLE_VAL_VEC_LEN) };

    return vec;
}

pub fn drop_var(ref_id: u32) -> () {
    unsafe { js_exports::drop_val(ref_id) }
}

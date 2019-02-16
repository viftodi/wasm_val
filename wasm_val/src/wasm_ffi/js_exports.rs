// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

extern "C" {
    pub fn get_val_global(len: u32, name: *const u8) -> u32;
    pub fn get_val(ref_id: u32, name_len: u32, name: *const u8) -> u32;
    pub fn set_val(ref_id: u32, name_len: u32, name: *const u8, value: *const u8) -> u32;
    pub fn call_0(ref_id: u32) -> u32;
    pub fn call_1(ref_id: u32, arg: *const u8) -> u32;
    pub fn call_args(ref_id: u32, args_len: u32, args: *const u8) -> u32;
    pub fn call_method_1(ref_id: u32, name_len: u32, name: *const u8, arg: *const u8) -> u32;
    pub fn call_method_0(ref_id: u32, name_len: u32, name: *const u8) -> u32;
    pub fn call_method_args(ref_id: u32, name_len: u32, name: *const u8, args_len: u32, args: *const u8) -> u32;
    pub fn new_0(ref_id: u32) -> u32;
    pub fn new_1(ref_id: u32, arg: *const u8) -> u32;
    pub fn new_args(ref_id: u32, args_len: u32, args: *const u8) -> u32;
    pub fn drop_val(val: u32);
    pub fn panic_fn(str_len: u32, str: *const u8);
}

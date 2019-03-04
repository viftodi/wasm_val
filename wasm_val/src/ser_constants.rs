// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

#[repr(u8)]
#[derive(FromPrimitive)]
pub enum TypeTag {
    Empty = 0,
    BoolFalse = 1,
    BoolTrue = 2,
    Int8 = 3,
    UInt8 = 4,
    Int16 = 5,
    UInt16 = 6,
    Int32 = 7,
    UInt32 = 8,
    F32 = 9,
    F64 = 10,
    String = 11,
    TypedArrayI8 = 12,
    TypedArrayU8 = 13,
    TypedArrayI16 = 14,
    TypedArrayU16 = 15,
    TypedArrayI32 = 16,
    TypedArrayU32 = 17,
    TypedArrayF32 = 18,
    TypedArrayF64 = 19,
    Object = 20,
    Function = 21,
    Ref = 22,
    Lambda = 23,
    LambdaReturn = 24,
    LambdaArg = 25,
    LambdaArgReturn = 26,
    Error = 27,
    Unknown = 28,
}

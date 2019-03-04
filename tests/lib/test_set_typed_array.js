// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import getTestModule from "/lib/test_helper.js";

const private_context = {
    t_i8: new Int8Array([-128, -64, 0, 1, 100, 127]),
    t_u8: new Uint8Array([0, 1, 128, 255]),
    t_i16: new Int16Array([-32768, -255, 0, 1, 1024, 32767]),
    t_u16: new Uint16Array([0, 256, 1024, 65535]),
    t_i32: new Int32Array([-2147483648, -65535, 0, 1, 65536, 2147483647]),
    t_u32: new Uint32Array([0, 1024, 2147483648, 4294967295]),
    t_f32: new Float32Array([-12.3, -10.4, 0, 1, 24.4, 2014.12]),
    t_f64: new Float64Array([-12.34, -10.49, 0., 1., 24.41, 2014.128]),
}

const context = {
    t_i8: { set: null },
    t_u8: { set: null },
    t_i16: { set: null },
    t_u16: { set: null },
    t_i32: { set: null },
    t_u32: { set: null },
    t_f32: { set: null },
    t_f64: { set: null },
}

/*
function arraysAreEqual(arr1, arr2) {
    chai.expect(arr1.length).to.be.equal(arr2.length);

    for (let i = 0; i < arr1.length; i++) {
        chai.expect(arr1[i]).to.be.equal()
    }
}*/

export default function setupTestSetTypedArray() {

    describe("Set typed arrays from rust", function () {
        let instance;

        before(async () => {
            instance = await getTestModule("set_typed_array", context);
        });

        // Code is very repetitive; 
        // TODO Refactor to a function that takes the property name as arg and does the rest

        it("should properly set a typed array of i8", function () {
            chai.expect(context.t_i8.set).to.equal(null);
            instance.exports.set_typed_array_i8();
            chai.expect(context.t_i8.set).to.be.a('Int8Array');
            chai.expect(context.t_i8.set).to.eql(private_context.t_i8);
        });

        it("should properly set a typed array of u8", function () {
            chai.expect(context.t_u8.set).to.equal(null);
            instance.exports.set_typed_array_u8();
            chai.expect(context.t_u8.set).to.be.a('Uint8Array');
            chai.expect(context.t_u8.set).to.eql(private_context.t_u8);
        });

        it("should properly set a typed array of i16", function () {
            chai.expect(context.t_i16.set).to.equal(null);
            instance.exports.set_typed_array_i16();
            chai.expect(context.t_i16.set).to.be.a('Int16Array');
            chai.expect(context.t_i16.set).to.eql(private_context.t_i16);
        });

        it("should properly set a typed array of u16", function () {
            chai.expect(context.t_u16.set).to.equal(null);
            instance.exports.set_typed_array_u16();
            chai.expect(context.t_u16.set).to.be.a('Uint16Array');
            chai.expect(context.t_u16.set).to.eql(private_context.t_u16);
        });

        it("should properly set a typed array of i32", function () {
            chai.expect(context.t_i32.set).to.equal(null);
            instance.exports.set_typed_array_i32();
            chai.expect(context.t_i32.set).to.be.a('Int32Array');
            chai.expect(context.t_i32.set).to.eql(private_context.t_i32);
        });

        it("should properly set a typed array of u32", function () {
            chai.expect(context.t_u32.set).to.equal(null);
            instance.exports.set_typed_array_u32();
            chai.expect(context.t_u32.set).to.be.a('Uint32Array');
            chai.expect(context.t_u32.set).to.eql(private_context.t_u32);
        });

        it("should properly set a typed array of f32", function () {
            chai.expect(context.t_f32.set).to.equal(null);
            instance.exports.set_typed_array_f32();
            chai.expect(context.t_f32.set).to.be.a('Float32Array');
            chai.expect(context.t_f32.set).to.eql(private_context.t_f32);
        });

        it("should properly set a typed array of f64", function () {
            chai.expect(context.t_f64.set).to.equal(null);
            instance.exports.set_typed_array_f64();
            chai.expect(context.t_f64.set).to.be.a('Float64Array');
            chai.expect(context.t_f64.set).to.eql(private_context.t_f64);
        });
    })
}

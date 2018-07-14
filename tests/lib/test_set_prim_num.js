// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import getTestModule from "/lib/test_helper.js";

const context = {
    i8_min: { expected: -128 },
    i8_max: { expected: 127 },
    u8_min: { expected: 0 },
    u8_max: { expected: 255 },
    i16_min: { expected: -32768 },
    i16_max: { expected: 32767 },
    u16_min: { expected: 0 },
    u16_max: { expected: 65535 },
    i32_min: { expected: -2147483648 },
    i32_max: { expected: 2147483647 },
    u32_min: { expected: 0 },
    u32_max: { expected: 4294967295 },
    f32_neg: { expected: -10.187 },
    f32_pos: { expected: 155.335 },
}

export default function setupTestSetPrimNum() {

    describe("Set different primitive number types from rust and get them as javascript numbers", function () {
        let instance;

        before(async () => {
            instance = await getTestModule("set_prim_num", context);
        });

        // Code is very repetitive; 
        // TODO Refactor to a function that takes the property name as arg and does the rest

        it("should properly set an i8 min val from rust", function () {
            const i8_min = context.i8_min;

            chai.expect(i8_min.set).to.equal(undefined);
            instance.exports.set_i8_min();
            chai.expect(i8_min.set).to.equal(i8_min.expected);
        });

        it("should properly set an i8 max val from rust", function () {
            const i8_max = context.i8_max;

            chai.expect(i8_max.set).to.equal(undefined);
            instance.exports.set_i8_max();
            chai.expect(i8_max.set).to.equal(i8_max.expected);
        });

        it("should properly set an u8 min val from rust", function () {
            const u8_min = context.u8_min;

            chai.expect(u8_min.set).to.equal(undefined);
            instance.exports.set_u8_min();
            chai.expect(u8_min.set).to.equal(u8_min.expected);
        });

        it("should properly set an u8 max val from rust", function () {
            const u8_max = context.u8_max;

            chai.expect(u8_max.set).to.equal(undefined);
            instance.exports.set_u8_max();
            chai.expect(u8_max.set).to.equal(u8_max.expected);
        });

        it("should properly set an i16 min val from rust", function () {
            const i16_min = context.i16_min;

            chai.expect(i16_min.set).to.equal(undefined);
            instance.exports.set_i16_min();
            chai.expect(i16_min.set).to.equal(i16_min.expected);
        });

        it("should properly set an i16 max val from rust", function () {
            const i16_max = context.i16_max;

            chai.expect(i16_max.set).to.equal(undefined);
            instance.exports.set_i16_max();
            chai.expect(i16_max.set).to.equal(i16_max.expected);
        });

        it("should properly set an u16 min val from rust", function () {
            const u16_min = context.u16_min;

            chai.expect(u16_min.set).to.equal(undefined);
            instance.exports.set_u16_min();
            chai.expect(u16_min.set).to.equal(u16_min.expected);
        });

        it("should properly set an u16 max val from rust", function () {
            const u16_max = context.u16_max;

            chai.expect(u16_max.set).to.equal(undefined);
            instance.exports.set_u16_max();
            chai.expect(u16_max.set).to.equal(u16_max.expected);
        });

        it("should properly set an i32 min val from rust", function () {
            const i32_min = context.i32_min;

            chai.expect(i32_min.set).to.equal(undefined);
            instance.exports.set_i32_min();
            chai.expect(i32_min.set).to.equal(i32_min.expected);
        });

        it("should properly set an i32 max val from rust", function () {
            const i32_max = context.i32_max;

            chai.expect(i32_max.set).to.equal(undefined);
            instance.exports.set_i32_max();
            chai.expect(i32_max.set).to.equal(i32_max.expected);
        });

        it("should properly set an u32 min val from rust", function () {
            const u32_min = context.u32_min;

            chai.expect(u32_min.set).to.equal(undefined);
            instance.exports.set_u32_min();
            chai.expect(u32_min.set).to.equal(u32_min.expected);
        });

        it("should properly set an u32 max val from rust", function () {
            const u32_max = context.u32_max;

            chai.expect(u32_max.set).to.equal(undefined);
            instance.exports.set_u32_max();
            chai.expect(u32_max.set).to.equal(u32_max.expected);
        });

        it("should properly set an f32 negative val from rust", function () {
            const f32_neg = context.f32_neg;

            chai.expect(f32_neg.set).to.equal(undefined);
            instance.exports.set_f32_neg();
            chai.expect(f32_neg.set).to.closeTo(f32_neg.expected, 0.0001);
        });

        it("should properly set an f32 positive val from rust", function () {
            const f32_pos = context.f32_pos;

            chai.expect(f32_pos.set).to.equal(undefined);
            instance.exports.set_f32_pos();
            chai.expect(f32_pos.set).to.closeTo(f32_pos.expected, 0.0001);
        });
    });
}

// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import getTestModule from "/lib/test_helper.js";

const context = {
    bool_false: { get: false },
    bool_true: { get: true },
    number_negative: { get: -999.1424475 },
    number_positive: { get: 999.4214852 },
    empty_string: { get: "" },
    a_string: { get: "Here you go Rust!" },
    a_rust_string: {},
    an_object: { get: { "hello": "world" } },
}

export default function setupTestGetThenSet() {

    describe("Get value from rust then set it back in javascript.", function () {
        let instance;

        before(async () => {
            instance = await getTestModule("get_then_set", context);
        });

        // Code is very repetitive; 
        // TODO Refactor to a function that takes the property name as arg and does the rest

        it("should properly get and set a boolean false value", function () {
            const bool_false = context.bool_false;

            chai.expect(bool_false.get).to.equal(false);
            chai.expect(bool_false.set).to.equal(undefined);
            instance.exports.get_and_set_bool_false();
            chai.expect(bool_false.set).to.equal(false);
        });

        it("should properly get and set a boolean true value", function () {
            const bool_true = context.bool_true;

            chai.expect(bool_true.get).to.equal(true);
            chai.expect(bool_true.set).to.equal(undefined);
            instance.exports.get_and_set_bool_true();
            chai.expect(bool_true.set).to.equal(true);
        });

        it("should properly get and set a negative number value", function () {
            const number_negative = context.number_negative;

            chai.expect(number_negative.set).to.equal(undefined);
            instance.exports.get_and_set_number_negative();
            chai.expect(number_negative.set).to.equal(number_negative.get);
        });

        it("should properly get and set a positive number value", function () {
            const number_positive = context.number_positive;

            chai.expect(number_positive.set).to.equal(undefined);
            instance.exports.get_and_set_number_positive();
            chai.expect(number_positive.set).to.equal(number_positive.get);
        });

        it("should properly get and set an empty string value", function () {
            const empty_string = context.empty_string;

            chai.expect(empty_string.set).to.equal(undefined);
            instance.exports.get_and_set_empty_string();
            chai.expect(empty_string.set).to.equal(empty_string.get);
        });

        it("should properly get and set a non empty string value", function () {
            const a_string = context.a_string;

            chai.expect(a_string.set).to.equal(undefined);
            instance.exports.get_and_set_a_string();
            chai.expect(a_string.set).to.equal(a_string.get);
        });

        it("should properly set a non empty rust String value", function () {
            const a_string = context.a_rust_string;

            chai.expect(a_string.set).to.equal(undefined);
            instance.exports.set_a_rust_string();
            chai.expect(a_string.set).to.equal("Hello");
        });

        it("should properly get and set an object value", function () {
            const an_object = context.an_object;

            chai.expect(an_object.set).to.equal(undefined);
            instance.exports.get_and_set_an_object();
            chai.expect(an_object.set).to.equal(an_object.get);
        });
    })
}

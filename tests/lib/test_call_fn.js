// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import getTestModule from "/lib/test_helper.js";

const private_context = {
    fn_no_args_called: false,
    fn_no_args_return_called: false,
    fn_no_args_return_val: 42,
    fn_one_arg_val_called: false,
    fn_one_arg_val: undefined,
    fn_two_args_called: false,
    fn_two_args_val1: undefined,
    fn_two_args_val2: undefined,
}

const context = {
    fn_container: {
        fn_no_args: function () {
            private_context.fn_no_args_called = true;
        },
        fn_no_args_return: function () {
            private_context.fn_no_args_return_called = true;

            return private_context.fn_no_args_return_val;
        },
        fn_one_arg_val: function (arg) {
            private_context.fn_one_arg_val_called = true;
            private_context.fn_one_arg_val = arg;
        },
        fn_two_args_val: function (arg1, arg2) {
            private_context.fn_two_args_called = true;
            private_context.fn_two_args_val1 = arg1;
            private_context.fn_two_args_val2 = arg2;
        }
    },
}

export default function setupTestCallFunction() {

    describe("Can call function members on an object", function () {
        let instance;

        before(async () => {
            instance = await getTestModule("call_fn", context);
        });

        // Code is very repetitive; 
        // TODO Refactor to a function that takes the property name as arg and does the rest

        it("can call a function with no args", function () {
            chai.expect(private_context.fn_no_args_called).to.equal(false);
            instance.exports.call_fn_no_args();
            chai.expect(private_context.fn_no_args_called).to.equal(true);
        });

        it("can receive the correct return val of a function with no args", function () {
            const fn_container = context.fn_container;

            chai.expect(private_context.fn_no_args_return_called).to.equal(false);
            chai.expect(fn_container.fn_no_args_return_val).to.equal(undefined);
            instance.exports.call_fn_no_args_return_val();
            chai.expect(private_context.fn_no_args_return_called).to.equal(true);
            chai.expect(fn_container.fn_no_args_return_val).to.equal(private_context.fn_no_args_return_val);
        });

        it("can call a function with two args", function () {
            chai.expect(private_context.fn_two_args_called).to.equal(false);
            chai.expect(private_context.fn_two_args_val1).to.equal(undefined);
            chai.expect(private_context.fn_two_args_val2).to.equal(undefined);
            instance.exports.call_fn_two_args_val();
            chai.expect(private_context.fn_two_args_called).to.equal(true);
            chai.expect(private_context.fn_two_args_val1).to.equal(3.14);
            chai.expect(private_context.fn_two_args_val2).to.equal(false);
        });
    });
}

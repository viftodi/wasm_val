// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import getTestModule from "/lib/test_helper.js";

const private_context = {
    global_fn_no_args_called: false,
    global_fn_no_args_this: null,
    fn_no_args_called: false,
    fn_no_args_this: null,
    fn_no_args_return_called: false,
    fn_no_args_return_val: 42,
    fn_one_arg_called: false,
    fn_one_arg_val: undefined,
    fn_one_arg_this: null,
    fn_multiple_args_called: false,
    fn_multiple_args_vals: undefined,
    fn_multiple_args_this: null,
    fn_member_container: {
        fn_no_args_called: false,
        fn_no_args_this: null,
        fn_no_args_return_called: false,
        fn_no_args_return_val: "hello rust",
        fn_one_arg_called: false,
        fn_one_arg_val: undefined,
        fn_one_arg_this: null,
        fn_multiple_args_called: false,
        fn_multiple_args_vals: undefined,
        fn_multiple_args_this: null,
    },
}

const context = {
    global_fn_no_args: function () {
        private_context.global_fn_no_args_called = true;
        private_context.global_fn_no_args_this = this;
    },
    fn_container: {
        fn_no_args: function () {
            private_context.fn_no_args_called = true;
            private_context.fn_no_args_this = this;
        },
        fn_no_args_return: function () {
            private_context.fn_no_args_return_called = true;

            return private_context.fn_no_args_return_val;
        },
        fn_one_arg: function (arg) {
            private_context.fn_one_arg_called = true;
            private_context.fn_one_arg_val = arg;
            private_context.fn_one_arg_this = this;
        },
        fn_multiple_args: function () {
            private_context.fn_multiple_args_called = true;
            private_context.fn_multiple_args_vals = arguments;
            private_context.fn_multiple_args_this = this;
        },
        fn_member_container: {
            fn_no_args: function () {
                private_context.fn_member_container.fn_no_args_called = true;
                private_context.fn_member_container.fn_no_args_this = this;
            },
            fn_no_args_return: function () {
                private_context.fn_member_container.fn_no_args_return_called = true;

                return private_context.fn_member_container.fn_no_args_return_val;
            },
            fn_one_arg: function (arg) {
                private_context.fn_member_container.fn_one_arg_called = true;
                private_context.fn_member_container.fn_one_arg_val = arg;
                private_context.fn_member_container.fn_one_arg_this = this;
            },
            fn_multiple_args: function () {
                private_context.fn_member_container.fn_multiple_args_called = true;
                private_context.fn_member_container.fn_multiple_args_vals = arguments;
                private_context.fn_member_container.fn_multiple_args_this = this;
            },
        }
    },
}

export default function setupTestCallFunction() {

    describe("Can call functions", function () {
        let instance;

        before(async () => {
            instance = await getTestModule("call_fn", context);
        });

        // Code is very repetitive; 
        // TODO Refactor to a function that takes the property name as arg and does the rest

        it("can call a global function with no args", function() {
            chai.expect(private_context.global_fn_no_args_called).to.equal(false);
            chai.expect(private_context.global_fn_no_args_this).to.equal(null);
            instance.exports.call_global_fn_no_args();
            chai.expect(private_context.global_fn_no_args_called).to.equal(true);
            chai.expect(private_context.global_fn_no_args_this).to.equal(context);
        });

        it("can call a function with no args", function () {
            chai.expect(private_context.fn_no_args_called).to.equal(false);
            chai.expect(private_context.fn_no_args_this).to.equal(null);
            instance.exports.call_fn_no_args();
            chai.expect(private_context.fn_no_args_called).to.equal(true);
            chai.expect(private_context.fn_no_args_this).to.equal(context.fn_container);
        });

        it("can receive the correct return val of a function with no args", function () {
            const fn_container = context.fn_container;

            chai.expect(private_context.fn_no_args_return_called).to.equal(false);
            chai.expect(fn_container.fn_no_args_return_val).to.equal(undefined);
            instance.exports.call_fn_no_args_return();
            chai.expect(private_context.fn_no_args_return_called).to.equal(true);
            chai.expect(fn_container.fn_no_args_return_val).to.equal(private_context.fn_no_args_return_val);
        });

        it("can call a function with one arg", function () {
            chai.expect(private_context.fn_one_arg_called).to.equal(false);
            chai.expect(private_context.fn_one_arg_val).to.equal(undefined);
            chai.expect(private_context.fn_one_arg_this).to.equal(null);
            instance.exports.call_fn_one_arg();
            chai.expect(private_context.fn_one_arg_called).to.equal(true);
            chai.expect(private_context.fn_one_arg_val).to.equal("a string arg");
            chai.expect(private_context.fn_one_arg_this).to.equal(context.fn_container);
        });

        it("can call a function with multiple args", function () {
            chai.expect(private_context.fn_multiple_args_called).to.equal(false);
            chai.expect(private_context.fn_multiple_args_vals).to.equal(undefined);
            chai.expect(private_context.fn_multiple_args_this).to.equal(null);
            instance.exports.call_fn_multiple_args();
            chai.expect(private_context.fn_multiple_args_called).to.equal(true);
            chai.expect(private_context.fn_multiple_args_this).to.equal(context.fn_container);
            chai.expect(private_context.fn_multiple_args_vals[0]).to.equal(3.14);
            chai.expect(private_context.fn_multiple_args_vals[1]).to.equal(false);
            chai.expect(private_context.fn_multiple_args_vals[2]).to.equal(42);
            chai.expect(private_context.fn_multiple_args_vals[3]).to.equal(-1);
            chai.expect(private_context.fn_multiple_args_vals[4]).to.equal("some string");
        });

        it("can call a function with no args as a member on an object with the correct 'this'", function () {
            chai.expect(private_context.fn_member_container.fn_no_args_called).to.equal(false);
            chai.expect(private_context.fn_member_container.fn_no_args_this).to.equal(null);
            instance.exports.call_member_fn_no_args();
            chai.expect(private_context.fn_member_container.fn_no_args_called).to.equal(true);
            chai.expect(private_context.fn_member_container.fn_no_args_this).to.equal(context.fn_container.fn_member_container);
        });

        it("can receive the correct return val of a member function call", function () {
            const fn_container = context.fn_container;

            chai.expect(private_context.fn_member_container.fn_no_args_return_called).to.equal(false);
            chai.expect(fn_container.fn_member_container.fn_no_args_return_val).to.equal(undefined);
            instance.exports.call_member_fn_no_args_return();
            chai.expect(private_context.fn_member_container.fn_no_args_return_called).to.equal(true);
            chai.expect(fn_container.fn_member_container.fn_no_args_return_val).to.equal(private_context.fn_member_container.fn_no_args_return_val);
        });

        it("can call a member function with one arg", function () {
            chai.expect(private_context.fn_member_container.fn_one_arg_called).to.equal(false);
            chai.expect(private_context.fn_member_container.fn_one_arg_val).to.equal(undefined);
            chai.expect(private_context.fn_member_container.fn_one_arg_this).to.equal(null);
            instance.exports.call_member_fn_one_arg();
            chai.expect(private_context.fn_member_container.fn_one_arg_called).to.equal(true);
            chai.expect(private_context.fn_member_container.fn_one_arg_this).to.equal(context.fn_container.fn_member_container);
            chai.expect(private_context.fn_member_container.fn_one_arg_val).to.equal("a string arg");
        });

        it("can call a member function with multiple args", function () {
            chai.expect(private_context.fn_member_container.fn_multiple_args_called).to.equal(false);
            chai.expect(private_context.fn_member_container.fn_multiple_args_vals).to.equal(undefined);
            chai.expect(private_context.fn_member_container.fn_multiple_args_this).to.equal(null);
            instance.exports.call_member_fn_multiple_args();
            chai.expect(private_context.fn_member_container.fn_multiple_args_called).to.equal(true);
            chai.expect(private_context.fn_member_container.fn_multiple_args_this).to.equal(context.fn_container.fn_member_container);
            chai.expect(private_context.fn_member_container.fn_multiple_args_vals[0]).to.equal(3.14);
            chai.expect(private_context.fn_member_container.fn_multiple_args_vals[1]).to.equal(false);
            chai.expect(private_context.fn_member_container.fn_multiple_args_vals[2]).to.equal(42);
            chai.expect(private_context.fn_member_container.fn_multiple_args_vals[3]).to.equal(-1);
            chai.expect(private_context.fn_member_container.fn_multiple_args_vals[4]).to.equal("some string");
        });
    });
}

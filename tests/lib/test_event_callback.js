// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import getTestModule from "/lib/test_helper.js";

const private_context = {
    no_args_callback_called: false,
    no_args_callback_promise: null,
    one_arg_callback_called: false,
    one_arg_callback_promise: null,
    nested_callback_first_called: false,
    nested_callback_first_promise: null,
    nested_callback_second_called: false,
    nested_callback_second_promise: null,
}

const context = {
    container: {
        register_callback_no_args: function (callback) {
            private_context.no_args_callback_promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    callback();
                    private_context.no_args_callback_called = true;
                    resolve();
                });
            });
        },

        register_callback_one_arg: function (callback) {
            private_context.one_arg_callback_promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    callback("A string argument");
                    private_context.one_arg_callback_called = true;
                    resolve();
                });
            });
        },

        register_first_nested_callback: function(callback) {
            const second_callback_register_fn = (callback2) => {
                private_context.nested_callback_second_promise = new Promise( (resolve, reject) => {
                    setTimeout( () => {
                        callback2("42");
                        private_context.nested_callback_second_called = true;
                        resolve();
                    });
                });
            }


            private_context.nested_callback_first_promise = new Promise( (resolve, reject) => {
                setTimeout( () => {
                    callback(second_callback_register_fn);
                    private_context.nested_callback_first_called = true;
                    resolve();
                });
            });
        }
    }
}

export default function setupTestEventCallback() {

    describe("Registered event callbacks are called", function () {
        let instance;

        before(async () => {
            instance = await getTestModule("event_callback", context);
        });

        it("Registered callback with no args is called", function () {
            chai.expect(private_context.no_args_callback_called).to.equal(false);
            chai.expect(private_context.no_args_callback_promise).to.equal(null);
            chai.expect(context.container.no_args_callback_rust_called).to.equal(undefined);
            instance.exports.register_callback_no_args();
            chai.expect(private_context.no_args_callback_promise).to.not.equal(null);
            return private_context.no_args_callback_promise
                .then(() => {
                    chai.expect(private_context.no_args_callback_called).to.equal(true);
                    chai.expect(context.container.no_args_callback_rust_called).to.equal(true);
                });
        });

        it("Registered callback with one arg is called", function () {
            chai.expect(private_context.one_arg_callback_called).to.equal(false);
            chai.expect(private_context.one_arg_callback_promise).to.equal(null);
            chai.expect(context.container.one_arg_callback_rust_called).to.equal(undefined);
            chai.expect(context.container.one_arg_callback_rust_val).to.equal(undefined);
            instance.exports.register_callback_one_arg();
            chai.expect(private_context.no_args_callback_promise).to.not.equal(null);
            return private_context.one_arg_callback_promise
                .then(() => {
                    chai.expect(private_context.one_arg_callback_called).to.equal(true);
                    chai.expect(context.container.one_arg_callback_rust_called).to.equal(true);
                    chai.expect(context.container.one_arg_callback_rust_val).to.equal("A string argument");
                });
        });

        it("Can register and call nested callbacks", function () {
            chai.expect(private_context.nested_callback_first_called).to.equal(false);
            chai.expect(private_context.nested_callback_first_promise).to.equal(null);
            chai.expect(private_context.nested_callback_second_called).to.equal(false);
            chai.expect(private_context.nested_callback_second_promise).to.equal(null);
            instance.exports.register_nested_callbacks();
            chai.expect(private_context.nested_callback_first_promise).to.not.equal(null);
            return private_context.nested_callback_first_promise
                .then(() => {
                    chai.expect(private_context.nested_callback_first_called).to.equal(true);
                    chai.expect(private_context.nested_callback_second_promise).to.not.equal(null);
                    return private_context.nested_callback_second_promise;
                })
                .then( () => {
                    chai.expect(private_context.nested_callback_second_called).to.equal(true);
                    chai.expect(context.container.nested_callback_rust_val).to.equal("42");
                });
        });

    });
}

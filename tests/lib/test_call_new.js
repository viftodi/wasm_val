// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import getTestModule from "/lib/test_helper.js";

const private_context = {
    constructor_no_args_called: false,
    constructor_one_arg_called: false,
    constructor_this_val_expected: 42,
    constructor_one_arg_val: null,
    constructor_multiple_args_val: null,
}

const context = {
    constructor_container: {
        no_args: function () {
            if (new.target) {
                private_context.constructor_no_args_called = true;
            }
        },
        no_args_this_val: function () {
            if (new.target) {
                this.val = 42;
            }
        },
        one_arg: function (arg) {
            if (new.target) {
                private_context.constructor_one_arg_val = arg;
            }
        },
        multiple_args: function () {
            if (new.target) {
                private_context.constructor_multiple_args_val = arguments;
            }
        }
    },
}

export default function setupTestCallNew() {

    describe("Can call a function as a constructor using the new keyword", function () {
        let instance;

        before(async () => {
            instance = await getTestModule("call_new", context);
        });

        it("calls a constructor with no args", function () {
            chai.expect(private_context.constructor_no_args_called).to.equal(false);
            instance.exports.call_new_no_args();
            chai.expect(private_context.constructor_no_args_called).to.equal(true);
        });

        it("receives a new instance", function () {
            const constructor_container = context.constructor_container;

            chai.expect(constructor_container.val).to.equal(undefined);
            instance.exports.call_new_no_args_this_val();
            chai.expect(constructor_container.val).to.equal(private_context.constructor_this_val_expected);
        });

        it("calls a constructor with one arg ", function () {
            chai.expect(private_context.constructor_one_arg_val).to.equal(null);
            instance.exports.call_new_one_arg();
            chai.expect(private_context.constructor_one_arg_val).to.equal("a value");
        });

        it("calls a constructor with multiple args ", function () {
            chai.expect(private_context.constructor_multiple_args_val).to.equal(null);
            instance.exports.call_new_multiple_args();
            chai.expect(private_context.constructor_multiple_args_val[0]).to.equal(3.14);
            chai.expect(private_context.constructor_multiple_args_val[1]).to.equal("a value");
            chai.expect(private_context.constructor_multiple_args_val[2]).to.equal(true);
            chai.expect(private_context.constructor_multiple_args_val[3]).to.equal(-23);
        });
    });
}

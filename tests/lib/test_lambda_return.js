// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import getTestModule from "/lib/test_helper.js";

const context = {
    container: {
        ret_40_promise: new Promise( (resolve, reject) => resolve(40) ),
    }
}

export default function setupTestLambdaReturn() {

    describe("Can use rust closures that return values", function () {
        let instance;

        before(async () => {
            instance = await getTestModule("lambda_return", context);
        });

        it("Rust receivs correct return values during nested promise calls", function () {
            //chai.expect(context.container.no_args_promise_called).to.equal(undefined);
            chai.expect(context.container.first_lambda_ret_arg).to.equal(undefined);
            chai.expect(context.container.second_lambda_ret_arg).to.equal(undefined);
            instance.exports.chain_promises();
            return new Promise( (resolve, reject) => setTimeout(() => resolve() ) )
                .then(() => {
                    chai.expect(context.container.first_lambda_ret_arg).to.equal(40);
                    chai.expect(context.container.second_lambda_ret_arg).to.equal(41);
                });
        });

    });
}

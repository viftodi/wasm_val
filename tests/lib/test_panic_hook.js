// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import getTestModule from "/lib/test_helper.js";

const private_context = {
    panic_fn_called: false,
    panic_fn_value: null,
}

function panic_fn(str) {
    private_context.panic_fn_called = true;
    private_context.panic_fn_value = str;
}

export default function setupTestPanicHook() {

    describe("Rust panic hook calls back to javascript", function () {
        let instance;

        before(async () => {
            instance = await getTestModule("panic_hook", window, {rust_panic: {panic_fn}});
        });

        it("should call the javascript panic function", function () {
            chai.expect(private_context.panic_fn_called).to.equal(false);
            chai.expect(private_context.panic_fn_value).to.equal(null);
            chai.expect(instance.exports.perform_panic).to.throw();
            chai.expect(private_context.panic_fn_called).to.equal(true);
            chai.expect(private_context.panic_fn_value).to.contain("Panic from rust");
        });
    })
}

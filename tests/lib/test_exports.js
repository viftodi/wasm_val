// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

import getTestModule from "/lib/test_helper.js";

export default function setupTestExports() {

    describe("Can handle missing wasm_val crate and API version mismatches", function () {
        let error_no_export;
        let error_bad_version;

        before(async () => {
            await getTestModule("no_exports", context)
                .catch((err) => {
                    error_no_export = err;
                });

            await getTestModule("old_crate_version", context)
                .catch((err) => {
                    error_bad_version = err;
                });
        });

        it("can detect missing wasm_val crate", function () {
            chai.expect(error_no_export).to.equal("No wasm_val exports found");
        });

        it("can detect API version mismatch between wasm_val and wasm_val_module", function () {
            chai.expect(error_bad_version).to.equal("wasm_val API version mismatch");
        });
    });
}

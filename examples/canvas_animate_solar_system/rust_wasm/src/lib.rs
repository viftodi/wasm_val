// Copyright 2018 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.
#[macro_use]
extern crate lazy_static;
extern crate wasm_val;

use wasm_val::{JsValue};



lazy_static! {
    static ref DATE_CONSTRUCTOR: JsValue = {
        JsValue::get_global("Date")
    };

    static ref IMAGE_CONSTRUCTOR: JsValue = {
        JsValue::get_global("Image")
    };

    static ref SUN_IMAGE: JsValue = {
        let sun = IMAGE_CONSTRUCTOR.new().unwrap();

        sun.set_val("src", "https://mdn.mozillademos.org/files/1456/Canvas_sun.png");

        sun
    };

    static ref MOON_IMAGE: JsValue = {
        let moon = IMAGE_CONSTRUCTOR.new().unwrap();

        moon.set_val("src", "https://mdn.mozillademos.org/files/1443/Canvas_moon.png");

        moon
    };

    static ref EARTH_IMAGE: JsValue = {
        let earth = IMAGE_CONSTRUCTOR.new().unwrap();

        earth.set_val("src", "https://mdn.mozillademos.org/files/1429/Canvas_earth.png");

        earth
    };

    static ref CANVAS_CONTEXT: JsValue = {
        let document = JsValue::get_global("document");
        let canvas = document.call_method_with_arg("getElementById", "canvas").unwrap();
        let context = canvas.call_method_with_arg("getContext", "2d").unwrap();

        context.set_val("globalCompositeOperation", "destination-over");

        context
    };
}

#[no_mangle]
pub extern "C" fn draw() -> () {
    CANVAS_CONTEXT.call_method_with_args("clearRect", &[&0, &0, &300, &300]);

    CANVAS_CONTEXT.set_val("fillStyle", "rgba(0, 0, 0, 0.4)");
    CANVAS_CONTEXT.set_val("strokeStyle", "rgba(0, 153, 255, 0.4)");
    CANVAS_CONTEXT.call_method("save");
    CANVAS_CONTEXT.call_method_with_args("translate", &[&150, &150]);
    
    let time = DATE_CONSTRUCTOR.new().unwrap();
    let seconds = time.call_method("getSeconds").unwrap().as_number().unwrap();
    let milliseconds = time.call_method("getMilliseconds").unwrap().as_number().unwrap();
    let pi = 3.1415_f64;

    // Earth
    CANVAS_CONTEXT.call_method_with_arg("rotate", ((2. * pi) / 60.) * seconds + ((2. * pi) / 60000.) * milliseconds);
    CANVAS_CONTEXT.call_method_with_args("translate", &[&105, &0]);
    CANVAS_CONTEXT.call_method_with_args("fillRect", &[&0, &-12, &50, &24]);
    CANVAS_CONTEXT.call_method_with_args("drawImage", &[&(*EARTH_IMAGE), &-12, &-12]);

    // Moon
    CANVAS_CONTEXT.call_method_with_arg("rotate", ((2. * pi) / 6.) * seconds + ((2. * pi) / 6000.) * milliseconds);
    CANVAS_CONTEXT.call_method_with_args("translate", &[&0, &28.5]);
    CANVAS_CONTEXT.call_method_with_args("drawImage", &[&(*MOON_IMAGE), &-3.5, &-3.5]);

    CANVAS_CONTEXT.call_method("restore");

    // Earth Orbit
    CANVAS_CONTEXT.call_method("beginPath");
    CANVAS_CONTEXT.call_method_with_args("arc", &[&150, &150, &105, &0, &(pi*2.), &false]); //Earth orbit
    CANVAS_CONTEXT.call_method("stroke");

    // Sun
    CANVAS_CONTEXT.call_method_with_args("drawImage", &[&(*SUN_IMAGE), &0, &0, &300, &300]);

}

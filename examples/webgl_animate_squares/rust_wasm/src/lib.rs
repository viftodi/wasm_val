// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

#[macro_use]
extern crate lazy_static;
extern crate wasm_val;

use std::sync::Mutex;
use wasm_val::JsValue;

struct Rect {
    x: f32, y: f32,
    size: f32, min_size: f32, max_size: f32,
    r: f32, g: f32, b: f32,
    grow_speed: f32, growing: bool,
}

const VERTEX_SHADER_SRC: &str = r#"#version 300 es
in vec2 in_position;

uniform vec2 un_resolution;

void main() {
    vec2 clipSpace = (2.0 * in_position/un_resolution - 1.0) * vec2(1, -1);

    gl_Position = vec4(clipSpace, 0, 1);
}
"#;

const FRAGMENT_SHADER_SRC: &str = r#"#version 300 es
precision mediump float;

uniform vec4 un_color;

out vec4 outColor;
 
void main() {
    outColor = un_color;
}
"#;

lazy_static! {
    static ref MATH_RANDOM: JsValue = {
        let math = JsValue::get_global("Math");
        let random = math.get_val("random").unwrap();

        random
    };
    static ref GL_CONTEXT: JsValue = {
        let document = JsValue::get_global("document");
        let canvas = document
            .call_method_with_arg("getElementById", "canvas")
            .unwrap();
        let context = canvas.call_method_with_arg("getContext", "webgl2").unwrap();

        context
    };
    static ref GL_PROGRAM: JsValue = {
        let program = GL_CONTEXT.call_method("createProgram").unwrap();
        let vertex_shader = GL_CONTEXT
            .call_method_with_arg("createShader", GL_CONTEXT.get_val("VERTEX_SHADER").unwrap())
            .unwrap();

        GL_CONTEXT.call_method_with_args("shaderSource", &[&vertex_shader, &VERTEX_SHADER_SRC]);
        GL_CONTEXT.call_method_with_args("compileShader", &[&vertex_shader]);
        GL_CONTEXT.call_method_with_args("attachShader", &[&program, &vertex_shader]);

        let fragment_shader = GL_CONTEXT
            .call_method_with_arg("createShader", GL_CONTEXT.get_val("FRAGMENT_SHADER").unwrap())
            .unwrap();

        GL_CONTEXT.call_method_with_args("shaderSource", &[&fragment_shader, &FRAGMENT_SHADER_SRC]);
        GL_CONTEXT.call_method_with_args("compileShader", &[&fragment_shader]);
        GL_CONTEXT.call_method_with_args("attachShader", &[&program, &fragment_shader]);
        GL_CONTEXT.call_method_with_args("linkProgram", &[&program]);

        program
    };
    static ref COLOR_UNI_LOCATION: JsValue = {
        let color_uni_location = GL_CONTEXT
            .call_method_with_args("getUniformLocation", &[&(*GL_PROGRAM), &"un_color"])
            .unwrap();

        color_uni_location
    };
    static ref RECTS: Mutex<Vec<Rect>> = Mutex::new(Vec::new());
}

fn get_rand() -> f64 {
    MATH_RANDOM.call().unwrap().as_number().unwrap()
}

fn get_rand_bound(lower: f64, upper: f64) -> f64 {
    let rand = get_rand();

    return lower + rand * (upper - lower);
}

fn init_event_handler() -> () {
    let document = JsValue::get_global("document");
    let canvas = document
        .call_method_with_arg("getElementById", "canvas")
        .unwrap();

    const CLICK_CLOSURE: &dyn Fn(JsValue) -> () = &|val: JsValue| {
        let x = val.get_val("offsetX").unwrap().as_number().unwrap() as f32;
        let y = val.get_val("offsetY").unwrap().as_number().unwrap() as f32;
        let mut rects = RECTS.lock().unwrap();
        let min_size = get_rand_bound(20., 50.) as f32;
        let max_size = get_rand_bound(min_size as f64 + 15., 100.) as f32;
        let size = min_size;
        let grow_speed = get_rand_bound(0.1, 1.2) as f32;
        let r = get_rand() as f32;
        let g = get_rand() as f32;
        let b = get_rand() as f32;
        let rect = Rect {
            x: x, y: y,
            min_size: min_size, max_size: max_size, size: size,
            r: r, g: g, b: b,
            growing: true, grow_speed: grow_speed,
        };

        rects.push(rect);
    };

    canvas.call_method_with_args("addEventListener", &[&"click", &CLICK_CLOSURE]);
}

fn init_webgl() {
    let position_attr_location = GL_CONTEXT
        .call_method_with_args("getAttributeLocation", &[&(*GL_PROGRAM), &"in_position"])
        .unwrap();

    let resolution_uni_location = GL_CONTEXT
        .call_method_with_args("getUniformLocation", &[&(*GL_PROGRAM), &"un_resolution"])
        .unwrap();

    let position_buffer = GL_CONTEXT.call_method("createBuffer").unwrap();

    let vao = GL_CONTEXT.call_method("createVertexArray").unwrap();

    GL_CONTEXT.call_method_with_args("bindVertexArray", &[&vao]);
    GL_CONTEXT.call_method_with_args("enableVertexAttribArray", &[&position_attr_location]);

    GL_CONTEXT.call_method_with_args(
        "bindBuffer",
        &[
            &GL_CONTEXT.get_val("ARRAY_BUFFER").unwrap(),
            &position_buffer,
        ],
    );

    let size = 2;
    let data_type = GL_CONTEXT.get_val("FLOAT").unwrap();
    let normalize = false;

    GL_CONTEXT.call_method_with_args(
        "vertexAttribPointer",
        &[
            &position_attr_location,
            &size, &data_type, &normalize,
            &0, &0,
        ],
    );
    GL_CONTEXT.call_method_with_args("viewport", &[&0, &0, &800, &800]);
    GL_CONTEXT.call_method_with_args("useProgram", &[&(*GL_PROGRAM)]);
    GL_CONTEXT.call_method_with_arg("bindVertexArray", vao);
    GL_CONTEXT.call_method_with_args("uniform2f", &[&resolution_uni_location, &800, &800]);
}

#[no_mangle]
pub extern "C" fn init() -> () {
    init_event_handler();
    init_webgl();
}

fn prepare_rect(rect: &Rect) -> () {
    let half_size = rect.size / 2_f32;
    let x1: f32 = rect.x - half_size;
    let x2: f32 = rect.x + half_size;
    let y1: f32 = rect.y - half_size;
    let y2: f32 = rect.y + half_size;

    GL_CONTEXT.call_method_with_args(
        "uniform4f",
        &[&(*COLOR_UNI_LOCATION), &rect.r, &rect.g, &rect.b, &1],
    );

    let buffer_data: &[f32] = &[x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];
    GL_CONTEXT.call_method_with_args(
        "bufferData",
        &[
            &GL_CONTEXT.get_val("ARRAY_BUFFER").unwrap(),
            &buffer_data,
            &GL_CONTEXT.get_val("STATIC_DRAW").unwrap(),
        ],
    );
}

fn update_rect(rect: &mut Rect) -> () {
    if rect.growing {
        rect.size = rect.size + rect.grow_speed;
        if rect.size >= rect.max_size {
            rect.growing = false;
        }
    } else {
        rect.size = rect.size - rect.grow_speed;
        if rect.size <= rect.min_size {
            rect.growing = true;
        }
    }
}

#[no_mangle]
pub extern "C" fn draw() -> () {
    let mut rects = RECTS.lock().unwrap();

    for rect in rects.iter_mut() {
        prepare_rect(rect);
        update_rect(rect);

        GL_CONTEXT.call_method_with_args(
            "drawArrays",
            &[&GL_CONTEXT.get_val("TRIANGLES").unwrap(), &0, &6],
        );
    }
}

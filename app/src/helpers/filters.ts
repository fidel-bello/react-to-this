// From tscoding emoteJAM

interface Param {
  init: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface Filter {
  transparent: string | null;
  duration: string;
  params?: {
    [name: string]: Param;
  };
  vertex: string;
  fragment: string;
}

export const filters: { [name: string]: Filter } = {
  Hop: {
    transparent: 0x00ff00 + "",
    duration: "interval * 2",
    params: {
      interval: {
        init: 0.85,
        min: 0.01,
        max: 2.0,
        step: 0.01,
      },
      ground: {
        init: 0.5,
        min: -1.0,
        max: 1.0,
        step: 0.01,
      },
      scale: {
        init: 0.4,
        min: 0.0,
        max: 1.0,
        step: 0.01,
      },
      jump_height: {
        init: 4.0,
        min: 1.0,
        max: 10.0,
        step: 0.01,
      },
      hops: {
        init: 2.0,
        min: 1.0,
        max: 5.0,
        step: 1.0,
      },
    },
    vertex: `#version 100
precision mediump float;

attribute vec2 meshPosition;
uniform float time;
uniform vec2 emoteSize;

uniform float interval;
uniform float ground;
uniform float scale;
uniform float jump_height;
uniform float hops;

varying vec2 uv;

float sliding_from_left_to_right(float time_interval) {
    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);
}

float flipping_directions(float time_interval) {
    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);
}

void main() {
    float x_time_interval = interval;
    float y_time_interval = x_time_interval / (2.0 * hops);
    vec2 offset = vec2(
        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),
        ((sliding_from_left_to_right(y_time_interval) * flipping_directions(y_time_interval) + 1.0) / jump_height) - ground);

    gl_Position = vec4(
        meshPosition * scale + offset,
        0.0,
        1.0);

    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;

    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);
}
`,
    fragment: `#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`,
  },
  Hopper: {
    transparent: 0x00ff00 + "",
    duration: "0.85",
    vertex: `#version 100
precision mediump float;

attribute vec2 meshPosition;
uniform float time;

varying vec2 uv;

float sliding_from_left_to_right(float time_interval) {
    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);
}

float flipping_directions(float time_interval) {
    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);
}

void main() {
    float scale = 0.40;
    float hops = 2.0;
    float x_time_interval = 0.85 / 2.0;
    float y_time_interval = x_time_interval / (2.0 * hops);
    float height = 0.5;
    vec2 offset = vec2(
        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),
        ((sliding_from_left_to_right(y_time_interval) * flipping_directions(y_time_interval) + 1.0) / 4.0) - height);

    gl_Position = vec4(
        meshPosition * scale + offset,
        0.0,
        1.0);

    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;

    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);
}
`,
    fragment: `#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y));
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`,
  },
  Overheat: {
    transparent: 0x00ff00 + "",
    duration: "0.85 / 8.0 * 2.0",
    vertex: `#version 100
precision mediump float;

attribute vec2 meshPosition;
uniform float time;

varying vec2 uv;

float sliding_from_left_to_right(float time_interval) {
    return (mod(time, time_interval) - time_interval * 0.5) / (time_interval * 0.5);
}

float flipping_directions(float time_interval) {
    return 1.0 - 2.0 * mod(floor(time / time_interval), 2.0);
}

void main() {
    float scale = 0.40;
    float hops = 2.0;
    float x_time_interval = 0.85 / 8.0;
    float y_time_interval = x_time_interval / (2.0 * hops);
    float height = 0.5;
    vec2 offset = vec2(
        sliding_from_left_to_right(x_time_interval) * flipping_directions(x_time_interval) * (1.0 - scale),
        ((sliding_from_left_to_right(y_time_interval) * flipping_directions(y_time_interval) + 1.0) / 4.0) - height);

    gl_Position = vec4(
        meshPosition * scale + offset,
        0.0,
        1.0);

    uv = (meshPosition + vec2(1.0, 1.0)) / 2.0;

    uv.x = (flipping_directions(x_time_interval) + 1.0) / 2.0 - uv.x * flipping_directions(x_time_interval);
}
`,
    fragment: `#version 100

precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform sampler2D emote;

varying vec2 uv;

void main() {
    gl_FragColor = texture2D(emote, vec2(uv.x, 1.0 - uv.y)) * vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor.w = floor(gl_FragColor.w + 0.5);
}
`,
  },
};

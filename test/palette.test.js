// Palette library tests

import { RGB, rgb_to_hex, hex_to_rgb } from "../src/palette.js";

describe("RGB to HEX conversion", () => {
  let rgb, hex;

  it("Converts black", () => {
    rgb = new RGB(0, 0, 0);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("000000");
  });

  it("Converts red", () => {
    rgb = new RGB(255, 0, 0);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("FF0000");
  });

  it("Converts grey", () => {
    rgb = new RGB(127, 127, 127);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("7F7F7F");
  });

  it("Handles invalid red type", () => {
    rgb = new RGB("hello", 255, 255);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("00FFFF");
  });

  it("Handles invalid green type", () => {
    rgb = new RGB(255, "hello", 255);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("FF00FF");
  });

  it("Handles invalid blue type", () => {
    rgb = new RGB(255, 255, "hello");
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("FFFF00");
  });

  it("Handles invalid red < 0", () => {
    rgb = new RGB(-1, 255, 255);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("00FFFF");
  });

  it("Handles invalid red > 255", () => {
    rgb = new RGB(256, 255, 255);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("FFFFFF");
  });

  it("Handles invalid green < 0", () => {
    rgb = new RGB(255, -1, 255);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("FF00FF");
  });

  it("Handles invalid green > 255", () => {
    rgb = new RGB(255, 256, 255);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("FFFFFF");
  });

  it("Handles invalid blue < 0", () => {
    rgb = new RGB(255, 255, -1);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("FFFF00");
  });

  it("Handles invalid blue > 255", () => {
    rgb = new RGB(255, 255, 256);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("FFFFFF");
  });
});

describe("HEX to RGB conversion", () => {
  let hex, rgb;

  it("Converts black", () => {
    hex = "000000";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(0);
    expect(rgb.G).toBe(0);
    expect(rgb.B).toBe(0);
  });

  it("Converts red", () => {
    hex = "FF0000";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(255);
    expect(rgb.G).toBe(0);
    expect(rgb.B).toBe(0);
  });

  it("Converts grey", () => {
    hex = "7F7F7F";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(127);
    expect(rgb.G).toBe(127);
    expect(rgb.B).toBe(127);
  });

  it("Converts shorthand hex", () => {
    hex = "012";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(0);
    expect(rgb.G).toBe(17);
    expect(rgb.B).toBe(34);
  });

  it("Converts lowercase hex", () => {
    hex = "7f7f7f";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(127);
    expect(rgb.G).toBe(127);
    expect(rgb.B).toBe(127);
  });

  it("Converts valid hex with extraneous text", () => {
    hex = "hello#7F,7F,7F.world";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(127);
    expect(rgb.G).toBe(127);
    expect(rgb.B).toBe(127);
  });

  it("Handles invalid hex string", () => {
    hex = "not_a_hex";
    rgb = hex_to_rgb(hex);
    expect(rgb).toBeNaN();
  });

  it("Handles invalid hex type", () => {
    hex = 0;
    rgb = hex_to_rgb(hex);
    expect(rgb).toBeNaN();
  });
});

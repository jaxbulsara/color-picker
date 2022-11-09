// Palette library tests

import {
  RGB,
  HSV,
  HCL,
  rgb_to_hex,
  hex_to_rgb,
  rgb_to_hsv,
  hsv_to_rgb,
  calculateLuminanceFromRGB,
  calculateLuminanceFromHSV,
  calculateValueCutoff,
} from "../src/palette.js";

describe("Color types", () => {
  describe("RGB", () => {
    it("Creates a new object", () => {
      const rgb = new RGB(0, 1, 2);
      expect(rgb.R).toBe(0);
      expect(rgb.G).toBe(1);
      expect(rgb.B).toBe(2);
    });

    it("Enforces minimum values", () => {
      const rgb = new RGB(-1, -1, -1);
      expect(rgb.R).toBe(0);
      expect(rgb.G).toBe(0);
      expect(rgb.B).toBe(0);
    });

    it("Enforces maximum values", () => {
      const rgb = new RGB(1000, 1000, 1000);
      expect(rgb.R).toBe(255);
      expect(rgb.G).toBe(255);
      expect(rgb.B).toBe(255);
    });

    it("Handles invalid argument types", () => {
      const rgb = new RGB("a", "b", "c");
      expect(rgb.R).toBe(0);
      expect(rgb.G).toBe(0);
      expect(rgb.B).toBe(0);
    });

    it("Transforms into an array", () => {
      const rgb = new RGB(0, 1, 2);
      expect(rgb.toArray()).toEqual(expect.arrayContaining([0, 1, 2]));
    });
  });

  describe("HSV", () => {
    it("Creates a new object", () => {
      const hsv = new HSV(0, 0.5, 1);
      expect(hsv.H).toBe(0);
      expect(hsv.S).toBe(0.5);
      expect(hsv.V).toBe(1);
    });

    it("Enforces minimum values", () => {
      const hsv = new HSV(-1, -1, -1);
      expect(hsv.H).toBe(359);
      expect(hsv.S).toBe(0);
      expect(hsv.V).toBe(0);
    });

    it("Enforces maximum values", () => {
      const hsv = new HSV(1000, 1000, 1000);
      expect(hsv.H).toBe(280);
      expect(hsv.S).toBe(1);
      expect(hsv.V).toBe(1);
    });

    it("Handles invalid argument types", () => {
      const hsv = new HSV("a", "b", "c");
      expect(hsv.H).toBe(0);
      expect(hsv.S).toBe(0);
      expect(hsv.V).toBe(0);
    });

    it("Transforms into an array", () => {
      const hsv = new HSV(0, 1, 1);
      expect(hsv.toArray()).toEqual(expect.arrayContaining([0, 1, 1]));
    });
  });

  describe("HCL", () => {
    it("Creates a new object", () => {
      const hcl = new HCL(0, 0.5, 1);
      expect(hcl.H).toBe(0);
      expect(hcl.C).toBe(0.5);
      expect(hcl.L).toBe(1);
    });

    it("Enforces minimum values", () => {
      const hcl = new HCL(-1, -1, -1);
      expect(hcl.H).toBe(359);
      expect(hcl.C).toBe(0);
      expect(hcl.L).toBe(0);
    });

    it("Enforces maximum values", () => {
      const hcl = new HCL(1000, 1000, 1000);
      expect(hcl.H).toBe(280);
      expect(hcl.C).toBe(1);
      expect(hcl.L).toBe(1);
    });

    it("Handles invalid argument types", () => {
      const hcl = new HCL("a", "b", "c");
      expect(hcl.H).toBe(0);
      expect(hcl.C).toBe(0);
      expect(hcl.L).toBe(0);
    });

    it("Transforms into an array", () => {
      const hcl = new HCL(0, 1, 1);
      expect(hcl.toArray()).toEqual(expect.arrayContaining([0, 1, 1]));
    });
  });
});

function expectColorsToBeEqual(col1, col2) {
  expect(col1.toArray()).toEqual(expect.arrayContaining(col2.toArray()));
}

describe("RGB to HEX conversion", () => {
  let rgb, hex, rgb_rev;

  const cases = [
    ["black", 0, 0, 0, "000000"],
    ["red", 255, 0, 0, "FF0000"],
    ["grey", 127, 127, 127, "7F7F7F"],
    ["white", 255, 255, 255, "FFFFFF"],
  ];

  test.each(cases)("Converts %s", (color, R, G, B, expected) => {
    rgb = new RGB(R, G, B);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe(expected);

    rgb_rev = hex_to_rgb(hex);
    expectColorsToBeEqual(rgb, rgb_rev);
  });
});

describe("HEX to RGB conversion", () => {
  let hex, rgb, hex_rev;

  const cases = [
    ["black", "000000", 0, 0, 0, "000000"],
    ["red", "FF0000", 255, 0, 0, "FF0000"],
    ["grey", "7F7F7F", 127, 127, 127, "7F7F7F"],
    ["shorthand hex", "012", 0, 17, 34, "001122"],
    ["lowercase hex", "7f7f7f", 127, 127, 127, "7F7F7F"],
    [
      "hex with other characters",
      "hello#7F,7F 7F.world",
      127,
      127,
      127,
      "7F7F7F",
    ],
    [
      "shorthand hex with other characters",
      "hello#a1f.world",
      170,
      17,
      255,
      "AA11FF",
    ],
  ];

  test.each(cases)("Converts %s", (name, hex, R, G, B, reverse) => {
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(R);
    expect(rgb.G).toBe(G);
    expect(rgb.B).toBe(B);

    hex_rev = rgb_to_hex(rgb);
    expect(hex_rev).toBe(reverse);
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

describe("RGB to HSV conversion", () => {
  let rgb, hsv, rgb_rev;

  const cases = [
    ["black", 0, 0, 0, 0, 0, 0],
    ["grey", 127, 127, 127, 0, 0, 0.498039],
    ["white", 255, 255, 255, 0, 0, 1],
    ["red", 255, 127, 127, 0, 0.501961, 1],
    ["green", 127, 255, 127, 120, 0.501961, 1],
    ["blue", 127, 127, 255, 240, 0.501961, 1],
  ];

  test.each(cases)("Converts %s", (color, R, G, B, H, S, V) => {
    rgb = new RGB(R, G, B);
    hsv = rgb_to_hsv(rgb);
    expect(hsv.H).toBeCloseTo(H);
    expect(hsv.S).toBeCloseTo(S);
    expect(hsv.V).toBeCloseTo(V);

    rgb_rev = hsv_to_rgb(hsv);
    expectColorsToBeEqual(rgb, rgb_rev);
  });
});

describe("HSV to RGB conversion", () => {
  let rgb, hsv, hsv_rev;

  const cases = [
    ["black", 0, 0, 0, 0, 0, 0],
    ["grey", 0, 0, 0.498039, 127, 127, 127],
    ["white", 0, 0, 1, 255, 255, 255],
    ["red", 0, 0.9, 1, 255, 25.5, 25.5],
    ["yellow", 60, 0.9, 1, 255, 255, 25.5],
    ["green", 120, 0.9, 1, 25.5, 255, 25.5],
    ["cyan", 180, 0.9, 1, 25.5, 255, 255],
    ["blue", 240, 0.9, 1, 25.5, 25.5, 255],
    ["magenta", 300, 0.9, 1, 255, 25.5, 255],
    ["red 360", 360, 0.9, 1, 255, 25.5, 25.5],
  ];

  test.each(cases)("Converts %s", (color, H, S, V, R, G, B) => {
    hsv = new HSV(H, S, V);
    rgb = hsv_to_rgb(hsv);
    expect(rgb.R).toBeCloseTo(R);
    expect(rgb.G).toBeCloseTo(G);
    expect(rgb.B).toBeCloseTo(B);

    hsv_rev = rgb_to_hsv(rgb);
    expectColorsToBeEqual(hsv, hsv_rev);
  });
});

describe("HCL helpers", () => {
  describe("Luminance calculation", () => {
    let rgb, hsv, lum;

    const rgb_cases = [
      ["black", 0, 0, 0, 0],
      ["grey", 127, 127, 127, 0.498039],
      ["white", 255, 255, 255, 1],
      ["red", 255, 0, 0, 0.546809],
      ["green", 0, 255, 0, 0.766159],
      ["blue", 0, 0, 255, 0.337639],
    ];

    const hsv_cases = [
      ["black", 0, 0, 0, 0],
      ["grey", 0, 0, 0.498039, 0.498039],
      ["white", 0, 0, 1, 1],
      ["red", 0, 0.9, 1, 0.553182],
      ["yellow", 60, 0.9, 1, 0.941881],
      ["green", 120, 0.9, 1, 0.76885],
      ["cyan", 180, 0.9, 1, 0.839041],
      ["blue", 240, 0.9, 1, 0.350514],
      ["magenta", 300, 0.9, 1, 0.647202],
      ["red 360", 360, 0.9, 1, 0.553182],
    ];

    test.each(rgb_cases)("Calculates RGB %s", (color, R, G, B, L) => {
      rgb = new RGB(R, G, B);
      lum = calculateLuminanceFromRGB(rgb);
      expect(lum).toBeCloseTo(L);
    });

    test.each(hsv_cases)("Calculates HSV %s", (color, H, S, V, L) => {
      hsv = new HSV(H, S, V);
      lum = calculateLuminanceFromHSV(hsv);
      expect(lum).toBeCloseTo(L);
    });
  });

  describe("Value cutoff calculation", () => {
    let V_0;

    const cases = [
      ["red", 0, 0.546809],
      ["yellow", 60, 0.941276],
      ["green", 120, 0.766159],
      ["cyan", 180, 0.837259],
      ["blue", 240, 0.337639],
      ["magenta", 300, 0.642651],
    ];

    test.each(cases)("Calculates %s", (color, H, expected) => {
      V_0 = calculateValueCutoff(H);
      expect(V_0).toBeCloseTo(expected);
    });
  });
});

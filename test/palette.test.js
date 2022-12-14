// Palette library tests

import {
  RGB,
  HSV,
  HCL,
  RGBtoHEX,
  HEXtoRGB,
  RGBtoHSV,
  HSVtoRGB,
  HSVtoHCL,
  HCLtoHSV,
  calculateLuminanceFromRGB,
  calculateLuminanceFromHSV,
  calculateLuminanceCutoff,
  calculateChromaBoundary,
  calculateChroma,
  calculateValue,
  calculateSaturation,
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
    hex = RGBtoHEX(rgb);
    expect(hex).toBe(expected);

    rgb_rev = HEXtoRGB(hex);
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
    rgb = HEXtoRGB(hex);
    expect(rgb.R).toBe(R);
    expect(rgb.G).toBe(G);
    expect(rgb.B).toBe(B);

    hex_rev = RGBtoHEX(rgb);
    expect(hex_rev).toBe(reverse);
  });

  it("Handles invalid hex string", () => {
    hex = "not_a_hex";
    rgb = HEXtoRGB(hex);
    expect(rgb).toBeNaN();
  });

  it("Handles invalid hex type", () => {
    hex = 0;
    rgb = HEXtoRGB(hex);
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
    hsv = RGBtoHSV(rgb);
    expect(hsv.H).toBeCloseTo(H);
    expect(hsv.S).toBeCloseTo(S);
    expect(hsv.V).toBeCloseTo(V);

    rgb_rev = HSVtoRGB(hsv);
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
    rgb = HSVtoRGB(hsv);
    expect(rgb.R).toBeCloseTo(R);
    expect(rgb.G).toBeCloseTo(G);
    expect(rgb.B).toBeCloseTo(B);

    hsv_rev = RGBtoHSV(rgb);
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

  describe("Luminance cutoff calculation", () => {
    let L_0;

    const cases = [
      ["red", 0, 0.546809],
      ["yellow", 60, 0.941276],
      ["green", 120, 0.766159],
      ["cyan", 180, 0.837259],
      ["blue", 240, 0.337639],
      ["magenta", 300, 0.642651],
    ];

    test.each(cases)("Calculates %s", (color, H, expected) => {
      L_0 = calculateLuminanceCutoff(H);
      expect(L_0).toBeCloseTo(expected);
    });
  });

  describe("Chroma boundary calculation", () => {
    let C, L;

    const cutoffCases = [
      ["red", 0, 1],
      ["yellow", 60, 1],
      ["green", 120, 1],
      ["cyan", 180, 1],
      ["blue", 240, 1],
      ["magenta", 300, 1],
    ];

    const midpointCases = [
      ["red", 0, 0.346737],
      ["yellow", 60, 0.298272],
      ["green", 120, 0.316701],
      ["cyan", 180, 0.308732],
      ["blue", 240, 0.386643],
      ["magenta", 300, 0.332458],
    ];

    const upperCases = [
      ["red", 0, 0],
      ["yellow", 60, 0],
      ["green", 120, 0],
      ["cyan", 180, 0],
      ["blue", 240, 0],
      ["magenta", 300, 0],
    ];

    test.each(cutoffCases)("Calculates %s at cutoff", (color, H, expected) => {
      L = calculateLuminanceCutoff(H);
      C = calculateChromaBoundary(H, L);
      expect(C).toBeCloseTo(expected);
    });

    test.each(midpointCases)("Calculates %s midway", (color, H, expected) => {
      L = 1 - (1 - calculateLuminanceCutoff(H)) / 2;
      C = calculateChromaBoundary(H, L);
      expect(C).toBeCloseTo(expected);
    });

    test.each(upperCases)(
      "Calculates %s at upper bound",
      (color, H, expected) => {
        L = 1;
        C = calculateChromaBoundary(H, L);
        expect(C).toBeCloseTo(expected);
      }
    );
  });

  describe("Chroma calculation", () => {
    let L, C;

    const cutoffCases = [
      ["red", 0, 0, 0],
      ["red", 0.5, 0, 0.5],
      ["red", 1, 0, 1],
    ];

    const midpointCases = [
      ["red", 0, 0, 0],
      ["red", 0.1733685, 0, 0.5],
      ["red", 0.346737, 0, 1],
    ];

    const upperCases = [
      ["red", 0, 0],
      ["yellow", 60, 0],
      ["green", 120, 0],
      ["cyan", 180, 0],
      ["blue", 240, 0],
      ["magenta", 300, 0],
    ];

    it("Calculates red below cutoff", () => {
      C = calculateChroma(0, 0.5, 0.1);
      expect(C).toBe(0.5);
    });

    test.each(cutoffCases)(
      "Calculates %s, S=%f at cutoff",
      (color, S, H, expected) => {
        L = calculateLuminanceCutoff(H);
        C = calculateChroma(H, S, L);
        expect(C).toBeCloseTo(expected);
      }
    );

    test.each(midpointCases)(
      "Calculates %s, S=%f at midpoint",
      (color, S, H, expected) => {
        L = 1 - (1 - calculateLuminanceCutoff(H)) / 2;
        C = calculateChroma(H, S, L);
        expect(C).toBeCloseTo(expected);
      }
    );

    test.each(upperCases)(
      "Calculates %s at upper bound",
      (color, H, expected) => {
        const S = 0;
        L = 1;
        C = calculateChroma(H, S, L);
        expect(C).toBeCloseTo(expected);
      }
    );
  });

  describe("Value calculation", () => {
    let val;

    const cases = [
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

    test.each(cases)("Calculates %s", (color, H, S, V, L) => {
      val = calculateValue(H, S, L);
      expect(val).toBeCloseTo(V);
    });
  });

  describe("Saturation calculation", () => {
    let hcl, L, S;

    const cutoffCases = [
      ["red", 0, 0, 0],
      ["red", 0.5, 0, 0.5],
      ["red", 1, 0, 1],
    ];

    const midpointCases = [
      ["red", 0, 0, 0],
      ["red", 0.5, 0, 0.1733685],
      ["red", 1, 0, 0.346737],
    ];

    const upperCases = [
      ["red", 0, 0, 0],
      ["red", 0.5, 0, 0],
      ["red", 1, 0, 0],
    ];

    it("Calculates red below cutoff", () => {
      hcl = new HCL(0, 0.5, 0.1);
      S = calculateSaturation(hcl);
      expect(S).toBe(0.5);
    });

    test.each(cutoffCases)(
      "Calculates %s, C=%f at cutoff",
      (color, C, H, expected) => {
        L = calculateLuminanceCutoff(H);
        hcl = new HCL(H, C, L);
        S = calculateSaturation(hcl);
        expect(S).toBeCloseTo(expected);
      }
    );

    test.each(midpointCases)(
      "Calculates %s, C=%f at midpoint",
      (color, C, H, expected) => {
        L = 1 - (1 - calculateLuminanceCutoff(H)) / 2;
        hcl = new HCL(H, C, L);
        S = calculateSaturation(hcl);
        expect(S).toBeCloseTo(expected);
      }
    );

    test.each(upperCases)(
      "Calculates %s, C=%f at upper bound",
      (color, C, H, expected) => {
        L = 1;
        hcl = new HCL(H, C, L);
        S = calculateSaturation(hcl);
        expect(S).toBeCloseTo(expected);
      }
    );
  });
});

describe("HSV to HCL conversion", () => {
  let hsv, hcl, hsv_rev;

  const cases = [
    ["black", 0, 0, 0, 0, 0, 0],
    ["grey", 0, 0, 0.5, 0, 0, 0.5],
    ["white", 0, 0, 1, 0, 0, 1],
    ["dark red", 0, 0.9, 0.5, 0, 0.9, 0.276591],
    ["light red", 0, 0.5, 0.9, 0, 0.767469, 0.619792],
    ["dark yellow", 60, 0.9, 0.5, 60, 0.9, 0.470941],
    ["light yellow", 60, 0.5, 0.99, 60, 0.714905, 0.946732],
    ["dark green", 120, 0.9, 0.5, 120, 0.9, 0.384425],
    ["light green", 120, 0.5, 0.95, 120, 0.709257, 0.789272],
    ["dark cyan", 180, 0.9, 0.5, 180, 0.9, 0.419521],
    ["light cyan", 180, 0.5, 0.99, 180, 0.901529, 0.871959],
    ["dark blue", 240, 0.9, 0.5, 240, 0.9, 0.175257],
    ["light blue", 240, 0.5, 0.9, 240, 0.864996, 0.521301],
    ["dark magenta", 300, 0.9, 0.5, 300, 0.9, 0.323601],
    ["light magenta", 300, 0.5, 0.9, 300, 0.677815, 0.673348],
  ];

  test.each(cases)("Converts %s", (color, H, S, V, H2, C, L) => {
    hsv = new HSV(H, S, V);
    hcl = HSVtoHCL(hsv);
    expect(hcl.H).toBe(H2);
    expect(hcl.C).toBeCloseTo(C);
    expect(hcl.L).toBeCloseTo(L);

    hsv_rev = HCLtoHSV(hcl);
    expect(hsv_rev.H).toBe(H);
    expect(hsv_rev.S).toBeCloseTo(S);
    expect(hsv_rev.V).toBeCloseTo(V);
  });
});

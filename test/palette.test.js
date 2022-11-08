// Palette library tests

import {
  RGB,
  HSV,
  HCL,
  rgb_to_hex,
  hex_to_rgb,
  rgb_to_hsv,
  hsv_to_rgb,
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

  it("Converts black", () => {
    rgb = new RGB(0, 0, 0);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("000000");

    rgb_rev = hex_to_rgb(hex);
    expectColorsToBeEqual(rgb, rgb_rev);
  });

  it("Converts red", () => {
    rgb = new RGB(255, 0, 0);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("FF0000");

    rgb_rev = hex_to_rgb(hex);
    expectColorsToBeEqual(rgb, rgb_rev);
  });

  it("Converts grey", () => {
    rgb = new RGB(127, 127, 127);
    hex = rgb_to_hex(rgb);
    expect(hex).toBe("7F7F7F");

    rgb_rev = hex_to_rgb(hex);
    expectColorsToBeEqual(rgb, rgb_rev);
  });
});

describe("HEX to RGB conversion", () => {
  let hex, rgb, hex_rev;

  it("Converts black", () => {
    hex = "000000";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(0);
    expect(rgb.G).toBe(0);
    expect(rgb.B).toBe(0);

    hex_rev = rgb_to_hex(rgb);
    expect(hex_rev).toBe(hex);
  });

  it("Converts red", () => {
    hex = "FF0000";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(255);
    expect(rgb.G).toBe(0);
    expect(rgb.B).toBe(0);

    hex_rev = rgb_to_hex(rgb);
    expect(hex_rev).toBe(hex);
  });

  it("Converts grey", () => {
    hex = "7F7F7F";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(127);
    expect(rgb.G).toBe(127);
    expect(rgb.B).toBe(127);

    hex_rev = rgb_to_hex(rgb);
    expect(hex_rev).toBe(hex);
  });

  it("Converts shorthand hex", () => {
    hex = "012";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(0);
    expect(rgb.G).toBe(17);
    expect(rgb.B).toBe(34);

    hex_rev = rgb_to_hex(rgb);
    expect(hex_rev).toBe("001122");
  });

  it("Converts lowercase hex", () => {
    hex = "7f7f7f";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(127);
    expect(rgb.G).toBe(127);
    expect(rgb.B).toBe(127);

    hex_rev = rgb_to_hex(rgb);
    expect(hex_rev).toBe("7F7F7F");
  });

  it("Converts valid hex with extraneous text", () => {
    hex = "hello#7F,7F,7F.world";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(127);
    expect(rgb.G).toBe(127);
    expect(rgb.B).toBe(127);

    hex_rev = rgb_to_hex(rgb);
    expect(hex_rev).toBe("7F7F7F");
  });

  it("Converts valid shorthand hex with extraneous text", () => {
    hex = "hello#a1f.world";
    rgb = hex_to_rgb(hex);
    expect(rgb.R).toBe(170);
    expect(rgb.G).toBe(17);
    expect(rgb.B).toBe(255);

    hex_rev = rgb_to_hex(rgb);
    expect(hex_rev).toBe("AA11FF");
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

  it("Converts black", () => {
    rgb = new RGB(0, 0, 0);
    hsv = rgb_to_hsv(rgb);
    expect(hsv.H).toBe(0);
    expect(hsv.S).toBe(0);
    expect(hsv.V).toBe(0);

    rgb_rev = hsv_to_rgb(hsv);
    expectColorsToBeEqual(rgb, rgb_rev);
  });

  it("Converts grey", () => {
    rgb = new RGB(127, 127, 127);
    hsv = rgb_to_hsv(rgb);
    expect(hsv.H).toBe(0);
    expect(hsv.S).toBe(0);
    expect(hsv.V).toBeCloseTo(0.498039);

    rgb_rev = hsv_to_rgb(hsv);
    expectColorsToBeEqual(rgb, rgb_rev);
  });

  it("Converts white", () => {
    rgb = new RGB(255, 255, 255);
    hsv = rgb_to_hsv(rgb);
    expect(hsv.H).toBe(0);
    expect(hsv.S).toBe(0);
    expect(hsv.V).toBe(1);

    rgb_rev = hsv_to_rgb(hsv);
    expectColorsToBeEqual(rgb, rgb_rev);
  });

  it("Converts red", () => {
    rgb = new RGB(255, 127, 127);
    hsv = rgb_to_hsv(rgb);
    expect(hsv.H).toBe(0);
    expect(hsv.S).toBeCloseTo(0.501961);
    expect(hsv.V).toBe(1);

    rgb_rev = hsv_to_rgb(hsv);
    expectColorsToBeEqual(rgb, rgb_rev);
  });

  it("Converts green", () => {
    rgb = new RGB(127, 255, 127);
    hsv = rgb_to_hsv(rgb);
    expect(hsv.H).toBe(120);
    expect(hsv.S).toBeCloseTo(0.501961);
    expect(hsv.V).toBe(1);

    rgb_rev = hsv_to_rgb(hsv);
    expectColorsToBeEqual(rgb, rgb_rev);
  });

  it("Converts blue", () => {
    rgb = new RGB(127, 127, 255);
    hsv = rgb_to_hsv(rgb);
    expect(hsv.H).toBe(240);
    expect(hsv.S).toBeCloseTo(0.501961);
    expect(hsv.V).toBe(1);

    rgb_rev = hsv_to_rgb(hsv);
    expectColorsToBeEqual(rgb, rgb_rev);
  });
});

describe("HSV to RGB conversion", () => {
  let rgb, hsv, hsv_rev;

  it("Converts black", () => {
    hsv = new HSV(0, 0, 0);
    rgb = hsv_to_rgb(hsv);
    expect(rgb.R).toBe(0);
    expect(rgb.G).toBe(0);
    expect(rgb.B).toBe(0);

    hsv_rev = rgb_to_hsv(rgb);
    expectColorsToBeEqual(hsv, hsv_rev);
  });

  it("Converts grey", () => {
    hsv = new HSV(0, 0, 0.498039);
    rgb = hsv_to_rgb(hsv);
    expect(rgb.R).toBeCloseTo(127);
    expect(rgb.G).toBeCloseTo(127);
    expect(rgb.B).toBeCloseTo(127);

    hsv_rev = rgb_to_hsv(rgb);
    expectColorsToBeEqual(hsv, hsv_rev);
  });

  it("Converts white", () => {
    hsv = new HSV(0, 0, 1);
    rgb = hsv_to_rgb(hsv);
    expect(rgb.R).toBe(255);
    expect(rgb.G).toBe(255);
    expect(rgb.B).toBe(255);

    hsv_rev = rgb_to_hsv(rgb);
    expectColorsToBeEqual(hsv, hsv_rev);
  });

  it("Converts red", () => {
    hsv = new HSV(0, 0.9, 1);
    rgb = hsv_to_rgb(hsv);
    expect(rgb.R).toBe(255);
    expect(rgb.G).toBeCloseTo(25.5);
    expect(rgb.B).toBeCloseTo(25.5);

    hsv_rev = rgb_to_hsv(rgb);
    expectColorsToBeEqual(hsv, hsv_rev);
  });

  it("Converts yellow", () => {
    hsv = new HSV(60, 0.9, 1);
    rgb = hsv_to_rgb(hsv);
    expect(rgb.R).toBe(255);
    expect(rgb.G).toBe(255);
    expect(rgb.B).toBeCloseTo(25.5);

    hsv_rev = rgb_to_hsv(rgb);
    expectColorsToBeEqual(hsv, hsv_rev);
  });

  it("Converts green", () => {
    hsv = new HSV(120, 0.9, 1);
    rgb = hsv_to_rgb(hsv);
    expect(rgb.R).toBeCloseTo(25.5);
    expect(rgb.G).toBe(255);
    expect(rgb.B).toBeCloseTo(25.5);

    hsv_rev = rgb_to_hsv(rgb);
    expectColorsToBeEqual(hsv, hsv_rev);
  });

  it("Converts cyan", () => {
    hsv = new HSV(180, 0.9, 1);
    rgb = hsv_to_rgb(hsv);
    expect(rgb.R).toBeCloseTo(25.5);
    expect(rgb.G).toBe(255);
    expect(rgb.B).toBe(255);

    hsv_rev = rgb_to_hsv(rgb);
    expectColorsToBeEqual(hsv, hsv_rev);
  });

  it("Converts blue", () => {
    hsv = new HSV(240, 0.9, 1);
    rgb = hsv_to_rgb(hsv);
    expect(rgb.R).toBeCloseTo(25.5);
    expect(rgb.G).toBeCloseTo(25.5);
    expect(rgb.B).toBe(255);

    hsv_rev = rgb_to_hsv(rgb);
    expectColorsToBeEqual(hsv, hsv_rev);
  });

  it("Converts magenta", () => {
    hsv = new HSV(300, 0.9, 1);
    rgb = hsv_to_rgb(hsv);
    expect(rgb.R).toBe(255);
    expect(rgb.G).toBeCloseTo(25.5);
    expect(rgb.B).toBe(255);

    hsv_rev = rgb_to_hsv(rgb);
    expectColorsToBeEqual(hsv, hsv_rev);
  });

  it("Converts red 360", () => {
    hsv = new HSV(360, 0.9, 1);
    rgb = hsv_to_rgb(hsv);
    expect(rgb.R).toBe(255);
    expect(rgb.G).toBeCloseTo(25.5);
    expect(rgb.B).toBeCloseTo(25.5);

    hsv_rev = rgb_to_hsv(rgb);
    expectColorsToBeEqual(hsv, hsv_rev);
  });
});

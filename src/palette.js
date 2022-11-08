// Palette library functions

// Types

export function RGB(red, grn, blu) {
  this.R = normalizeNumber(red, 0, 255);
  this.G = normalizeNumber(grn, 0, 255);
  this.B = normalizeNumber(blu, 0, 255);
  this.toArray = () => [this.R, this.G, this.B];
}

export function HSV(hue, sat, val) {
  this.H = normalizeDegrees(hue);
  this.S = normalizeNumber(sat, 0, 1);
  this.V = normalizeNumber(val, 0, 1);
  this.toArray = () => [this.H, this.S, this.V];
}

export function HCL(hue, cro, lum) {
  this.H = normalizeDegrees(hue);
  this.C = normalizeNumber(cro, 0, 1);
  this.L = normalizeNumber(lum, 0, 1);
  this.toArray = () => [this.H, this.C, this.L];
}

// Defaults

const DEFAULT_RGB = NaN;

// Functions

export function rgb_to_hex(rgb) {
  return rgb
    .toArray()
    .reduce((previous, current) => previous.concat(toHexString(current)), "");
}

export function hex_to_rgb(hex) {
  if (!(typeof hex == "string" || hex instanceof String)) return DEFAULT_RGB;

  let chunks = hex.match(/[A-Fa-f0-9]{2}/g);

  if (!chunks) return DEFAULT_RGB;

  if (chunks.length < 3) {
    const short = hex.match(/[A-Fa-f0-9]{3}/);

    if (!short || short.length < 1) return DEFAULT_RGB;

    const shortChunks = short[0].match(/./g);
    chunks = shortChunks.map((h) => h.repeat(2));
  }

  const rgb = chunks.map((c) => parseInt(c, 16));

  return new RGB(...rgb);
}

export function rgb_to_hsv(rgb) {
  let H, S, V;

  // Calculate constants
  const r_prime = rgb.R / 255;
  const g_prime = rgb.G / 255;
  const b_prime = rgb.B / 255;

  const C_max = Math.max(r_prime, g_prime, b_prime);
  const C_min = Math.min(r_prime, g_prime, b_prime);
  const delta = C_max - C_min;

  // Calculate H
  if (delta == 0) H = 0;
  else
    switch (C_max) {
      case r_prime:
        H = 60 * (((g_prime - b_prime) / delta) % 6);
        break;
      case g_prime:
        H = 60 * ((b_prime - r_prime) / delta + 2);
        break;
      case b_prime:
        H = 60 * ((r_prime - g_prime) / delta + 4);
        break;
    }

  // Calculate S
  if (C_max == 0) S = 0;
  else S = delta / C_max;

  // Calculate V
  V = C_max;

  return new HSV(H, S, V);
}

export function hsv_to_rgb(hsv) {
  // Calculate constants
  const C = hsv.V * hsv.S;
  const H_prime = 1 - Math.abs(((hsv.H / 60) % 2) - 1);
  const X = C * H_prime;
  const m = hsv.V - C;
  const H_select = Math.trunc((hsv.H / 60) % 6);

  // Calculate RGB
  let rgb = new Array(3);

  switch (H_select) {
    case 0:
      rgb = [C, X, 0];
      break;
    case 1:
      rgb = [X, C, 0];
      break;
    case 2:
      rgb = [0, C, X];
      break;
    case 3:
      rgb = [0, X, C];
      break;
    case 4:
      rgb = [X, 0, C];
      break;
    case 5:
      rgb = [C, 0, X];
      break;
  }

  rgb = rgb.map((n) => 255 * (n + m));

  return new RGB(...rgb);
}

// Helpers

function normalizeNumber(value, min, max, default_ = 0) {
  const num = new Number(value);
  if (isNaN(num)) return default_;
  return minmax(num, min, max);
}

function normalizeDegrees(value, default_ = 0) {
  const num = new Number(value);
  if (isNaN(num)) return default_;
  return mapDegrees(value);
}

function minmax(number, min, max) {
  return Math.min(max, Math.max(min, number));
}

function mapDegrees(degrees) {
  return degrees - 360 * Math.floor(degrees / 360);
}

function toHexString(int) {
  return int.toString(16).toUpperCase().padStart(2, "0");
}

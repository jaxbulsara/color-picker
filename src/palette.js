// Palette library functions

// Types

export function RGB(R, G, B) {
  this.R = normalize(R, 0, 255, 0);
  this.G = normalize(G, 0, 255, 0);
  this.B = normalize(B, 0, 255, 0);
  this.toArray = () => [this.R, this.G, this.B];
}

export function HSV(H, S, V) {
  this.H = normalize(H, 0, 360, 0);
  this.S = normalize(S, 0, 1, 0);
  this.V = normalize(V, 0, 1, 0);
  this.toArray = () => [this.H, this.S, this.V];
}

export function HCL(H, C, L) {
  this.H = normalize(H, 0, 360, 0);
  this.C = normalize(C, 0, 1, 0);
  this.L = normalize(L, 0, 1, 0);
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

// Helpers

function normalize(value, min, max, default_) {
  const num = new Number(value);
  if (isNaN(num)) return default_;
  return Math.min(max, Math.max(min, num));
}

function toHexString(int) {
  return int.toString(16).toUpperCase().padStart(2, "0");
}

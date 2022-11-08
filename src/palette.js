// Palette library functions

// Types

export function RGB(R, G, B) {
  this.R = normalize(R, 0, 255, 0);
  this.G = normalize(G, 0, 255, 0);
  this.B = normalize(B, 0, 255, 0);
}

export function HSV(H, S, V) {
  this.H = normalize(H, 0, 360, 0);
  this.S = normalize(S, 0, 1, 0);
  this.V = normalize(V, 0, 1, 0);
}

export function HCL(H, C, L) {
  this.H = normalize(H, 0, 360, 0);
  this.C = normalize(C, 0, 1, 0);
  this.L = normalize(L, 0, 1, 0);
}

// Defaults

const DEFAULT_RGB = NaN;

// Functions

export function rgb_to_hex(rgb) {
  const rHex = toHexString(rgb.R);
  const gHex = toHexString(rgb.G);
  const bHex = toHexString(rgb.B);

  return rHex + gHex + bHex;
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

// Helpers

function normalize(value, min, max, default_) {
  const num = new Number(value);
  if (isNaN(num)) return default_;
  return Math.min(max, Math.max(min, num));
}

function toHexString(int) {
  return int.toString(16).toUpperCase().padStart(2, "0");
}

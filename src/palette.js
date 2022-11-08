// Palette library functions

// Types

export function RGB(R, G, B) {
  this.R = R;
  this.G = G;
  this.B = B;
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
    chunks[0] = shortChunks[0].repeat(2);
    chunks[1] = shortChunks[1].repeat(2);
    chunks[2] = shortChunks[2].repeat(2);
  }

  const R = parseInt(chunks[0], 16);
  const G = parseInt(chunks[1], 16);
  const B = parseInt(chunks[2], 16);

  return new RGB(R, G, B);
}

// Helpers

function toHexString(int) {
  let hex;

  if (!Number.isInteger(int)) {
    hex = "00";
  } else if (int < 0) {
    hex = "00";
  } else if (int > 255) {
    hex = "FF";
  } else {
    hex = int.toString(16).toUpperCase().padStart(2, "0");
  }

  return hex;
}

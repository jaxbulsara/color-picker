// Canvas transformation functions

import { RGB, HCL, colorFromRGB, colorFromHCL } from "./palette.js";

export function fillColor(canvas, color) {
  const context = getContext(canvas);
  const [width, height] = getDimensions(canvas);
  let imageData = context.createImageData(width, height);

  const [R, G, B] = color.rgb.toArray();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      setPixelColor(imageData, width, x, y, R, G, B);
    }
  }

  context.putImageData(imageData, 0, 0);
}

export function fillSquareColor(canvas, color) {
  const C = color.hcl.C;
  let hcl = new HCL(0, C, 1);

  const context = getContext(canvas);
  const [width, height] = getDimensions(canvas);
  const h_step = calculateStep(width, 360);
  const l_step = calculateStep(height, 1);

  let imageData = context.createImageData(width, height);
  let rgb;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      hcl = new HCL(x * h_step, C, 1 - y * l_step);
      color = colorFromHCL(hcl);
      rgb = color.rgb;

      setPixelColor(imageData, width, x, y, rgb.R, rgb.G, rgb.B);
    }
  }

  context.putImageData(imageData, 0, 0);
}

export function fillSliderColor(canvas, color) {
  const [H, L] = [color.hcl.H, color.hcl.L];
  const context = getContext(canvas);
  const [width, height] = getDimensions(canvas);
  const step = calculateStep(width, 1);

  let imageData = context.createImageData(width, height);

  let hcl, rgb;

  for (let x = 0; x < width; x++) {
    hcl = new HCL(H, x * step, L);
    color = colorFromHCL(hcl);
    rgb = color.rgb;

    for (let y = 0; y < height; y++) {
      setPixelColor(imageData, width, x, y, rgb.R, rgb.G, rgb.B);
    }
  }

  context.putImageData(imageData, 0, 0);
}

export function getSquareColor(event, squareCanvas, x, y) {
  const context = getContext(squareCanvas);

  const pixel = context.getImageData(x, y, 1, 1);
  const [R, G, B] = pixel.data;
  return colorFromRGB(new RGB(R, G, B));
}

function getContext(canvas) {
  return canvas.getContext("2d");
}

function getDimensions(canvas) {
  return [canvas.width, canvas.height];
}

function getPixelIndex(width, x, y) {
  return 4 * (y * width + x);
}

function setPixelColor(imageData, width, x, y, R, G, B) {
  const pixelindex = getPixelIndex(width, x, y);

  imageData.data[pixelindex] = R;
  imageData.data[pixelindex + 1] = G;
  imageData.data[pixelindex + 2] = B;
  imageData.data[pixelindex + 3] = 255;
}

function calculateStep(dimension, range) {
  return range / dimension;
}

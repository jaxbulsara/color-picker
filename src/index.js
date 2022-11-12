import { HCL, colorFromHCL } from "./palette.js";
import {
  fillColor,
  fillSquareColor,
  fillSliderColor,
  getSliderColor,
} from "./canvas.js";

import State from "./state.js";

// State

const state = new State();

// Elements

const square = document.getElementById("color-square");
const slider = document.getElementById("color-slider");
const selected = document.getElementById("color-selected");
const preview = document.getElementById("color-preview");

const rgb_r_value = document.getElementById("rgb-r-value");
const rgb_g_value = document.getElementById("rgb-g-value");
const rgb_b_value = document.getElementById("rgb-b-value");
const hsv_h_value = document.getElementById("hsv-h-value");
const hsv_s_value = document.getElementById("hsv-s-value");
const hsv_v_value = document.getElementById("hsv-v-value");
const hcl_h_value = document.getElementById("hcl-h-value");
const hcl_c_value = document.getElementById("hcl-c-value");
const hcl_l_value = document.getElementById("hcl-l-value");
const hex_value = document.getElementById("hex-value");

const rgb_value = [rgb_r_value, rgb_g_value, rgb_b_value];
const hsv_value = [hsv_h_value, hsv_s_value, hsv_v_value];
const hcl_value = [hcl_h_value, hcl_c_value, hcl_l_value];

const square_x_cursor = document.getElementById("color-square-x-cursor");
const square_y_cursor = document.getElementById("color-square-y-cursor");
const slider_cursor = document.getElementById("color-slider-cursor");

// On page load

window.onload = function () {
  function setDimensionsToParent(element) {
    element.width = element.parentNode.clientWidth;
    element.height = element.parentNode.clientHeight;
  }

  for (const canvas of [square, slider, selected, preview]) {
    setDimensionsToParent(canvas);
  }

  const color = state.color.updateFromHCL(new HCL(0, 1, 0));

  fillColor(selected, color);
  fillColor(preview, color);
  fillSquareColor(square, color);
  fillSliderColor(slider, color);

  moveSquareCursors(0, 255);
};

// Event listeners

// document.addEventListener("click", (event) => {
//   //// Square click
//   if (inSquare(event)) updateSelectedColorFromSquare(event);
// });

document.addEventListener("mousedown", (event) => {
  //// Square mouse down
  if (inSquare(event)) {
    state.mouseDown.setSquare();
    updateSelectedColorFromSquare(event);
  }
});

document.addEventListener("mouseup", () => {
  state.mouseDown.reset();
});

document.addEventListener("mousemove", (event) => {
  //// Square mouse move
  if (state.mouseDown.square) {
    updateSelectedColorFromSquare(event);
  } else if (inSquare(event)) {
    state.preview.turnOn();
    updatePreviewColorFromSquare(event);
  } else if (state.preview.on) {
    state.preview.turnOff();
    resetPreviewColor();
  }
});

//// Slider mouse move
slider.addEventListener("mousemove", (event) =>
  updatePreviewColorFromSlider(event)
);

//// Square mouse out
slider.addEventListener("mouseout", () => resetPreviewColor());

// Event listener functions

//// Preview color
function updatePreviewColorFromSquare(event) {
  const [x, y] = getSquareCoordinates(event);
  fillColor(preview, getSquareColor(x, y));
}

function updatePreviewColorFromSlider(event) {
  const x = getSliderCoordinates(event);
  fillColor(preview, getSliderColor(event, slider, x));
}

function resetPreviewColor() {
  fillColor(preview, state.getColor());
}

//// Selected color
function updateSelectedColorFromSquare(event) {
  const [x, y] = getSquareCoordinates(event);
  const squareColor = getSquareColor(x, y);

  const color = state.color.updateFromHCL(squareColor.hcl);

  moveSquareCursors(x, y);
  fillColor(selected, color);
  fillColor(preview, color);
  fillSliderColor(slider, color);
  updateValues(color);
}

function updateColorView() {}

// Event listener helpers

function inSquare(event) {
  const bounding = square.getBoundingClientRect();
  const within_x =
    bounding.left <= event.clientX && event.clientX <= bounding.right;
  const within_y =
    bounding.top <= event.clientY && event.clientY <= bounding.bottom;

  return within_x && within_y;
}

function getSquareCoordinates(event) {
  const bounding = square.getBoundingClientRect();
  const [width, height] = getDimensions(square);
  const x = minmax(event.clientX - bounding.left, 0, width - 1);
  const y = minmax(event.clientY - bounding.top, 0, height - 1);
  return [x, y];
}

function getSquareColor(x, y) {
  const [width, height] = getDimensions(square);

  const H = 360 * (x / width);
  const C = state.getColor().hcl.C;
  const L = 1 - y / (height - 1);

  const hcl = new HCL(H, C, L);
  return colorFromHCL(hcl);
}

function getSliderCoordinates(event) {
  const bounding = slider.getBoundingClientRect();
  const x = event.clientX - bounding.left;
  return minmax(x, 0, slider.width - 1);
}

function moveSquareCursors(x, y) {
  square_x_cursor.style["left"] = `${x}px`;
  square_y_cursor.style["top"] = `${y}px`;
}

function updateValues() {
  const color = state.getColor();
  const hex = "#" + color.hex;
  const [R, G, B] = color.rgb.toArray().map((n) => round(n).toString());
  const hsvH = round(color.hsv.H.toPrecision(3), 2).toString();
  const S = round(toPercent(color.hsv.S.toPrecision(3)), 2).toString();
  const V = round(toPercent(color.hsv.V.toPrecision(3)), 2).toString();
  const hclH = round(color.hcl.H.toPrecision(3), 2).toString();
  const C = round(toPercent(color.hcl.C.toPrecision(3)), 2).toString();
  const L = round(toPercent(color.hcl.L.toPrecision(3)), 2).toString();

  hex_value.textContent = hex;
  rgb_r_value.textContent = R;
  rgb_g_value.textContent = G;
  rgb_b_value.textContent = B;
  hsv_h_value.textContent = hsvH;
  hsv_s_value.textContent = S;
  hsv_v_value.textContent = V;
  hcl_h_value.textContent = hclH;
  hcl_c_value.textContent = C;
  hcl_l_value.textContent = L;
}

// Utility functions

function round(num, places = 0) {
  const modifier = 10 ** places;
  return Math.round(num * modifier) / modifier;
}

function toPercent(decimal) {
  return decimal * 100;
}

function toDecimal(percent) {
  return percent / 100;
}

function minmax(number, min, max) {
  return Math.min(max, Math.max(min, number));
}

function getDimensions(element) {
  return [element.width, element.height];
}

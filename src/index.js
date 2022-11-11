import { HCL, colorFromHCL } from "./palette.js";
import {
  fillColor,
  fillSquareColor,
  fillSliderColor,
  getSquareColor,
} from "./canvas.js";

// State

let color;

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

// Helpers

function setDimensionsToParent(element) {
  element.width = element.parentNode.clientWidth;
  element.height = element.parentNode.clientHeight;
}

function getSquareCoordinates(event) {
  const bounding = square.getBoundingClientRect();
  const x = event.clientX - bounding.left;
  const y = event.clientY - bounding.top;
  return [x, y];
}

function updateSelectedColor(newColor) {
  color = newColor;

  fillColor(selected, color);
  fillColor(preview, color);
}

function updateSquareCursors(x, y) {
  square_x_cursor.style.left = x;
  square_y_cursor.style.top = y;
}

// On page load

window.onload = function () {
  console.debug("Loading color picker");

  console.debug("Setting canvas sizes");
  for (const canvas of [square, slider, selected, preview]) {
    setDimensionsToParent(canvas);
  }

  const initialColor = colorFromHCL(new HCL(0, 1, 0));
  updateSelectedColor(initialColor);

  fillSquareColor(square, color);
  fillSliderColor(slider, color);
};

// Event listeners

square.addEventListener("mousemove", (event) => {
  const [x, y] = getSquareCoordinates(event);
  fillColor(preview, getSquareColor(event, square, x, y));
});

square.addEventListener("click", (event) => {
  const [x, y] = getSquareCoordinates(event);
  updateSelectedColor(getSquareColor(event, square, x, y));
  updateSquareCursors(x, y);
});

square.addEventListener("mouseout", () => {
  fillColor(preview, color);
});

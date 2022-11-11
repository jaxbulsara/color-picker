import { HCL, colorFromHCL } from "./palette.js";
import {
  fillColor,
  fillSquareColor,
  fillSliderColor,
  setPreviewColor,
} from "./canvas.js";

// State

let color;

// Elements

const square = document.getElementById("color-square");
const slider = document.getElementById("color-slider");
const selected = document.getElementById("color-selected");
const preview = document.getElementById("color-preview");

// Helpers

function setDimensionsToParent(element) {
  element.width = element.parentNode.clientWidth;
  element.height = element.parentNode.clientHeight;
}

// On page load

window.onload = function () {
  console.debug("Loading color picker");

  console.debug("Setting canvas sizes");
  for (const canvas of [square, slider, selected, preview]) {
    setDimensionsToParent(canvas);
  }

  color = colorFromHCL(new HCL(0, 1, 0));
  const [R, G, B] = color.rgb.toArray();
  const [H, C, L] = color.hcl.toArray();

  for (const canvas of [selected, preview]) {
    fillColor(canvas, R, G, B);
  }

  fillSquareColor(square, C);
  fillSliderColor(slider, H, L);
};

// Event listeners

square.addEventListener("mousemove", (event) =>
  setPreviewColor(event, square, preview)
);

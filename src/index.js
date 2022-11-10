import { HCL, colorFromHCL } from "./palette.js";
import {
  fillColor,
  fillSquareColor,
  fillSliderColor,
  previewColor,
} from "./canvas.js";

const square = document.getElementById("color-square");
const slider = document.getElementById("color-slider");
const selected = document.getElementById("color-selected");
const preview = document.getElementById("color-preview");

function setDimensionsToParent(element) {
  element.width = element.parentNode.clientWidth;
  element.height = element.parentNode.clientHeight;
}

window.onload = function () {
  const color = colorFromHCL(new HCL(0, 1, 0));

  for (const canvas of [square, slider, selected, preview]) {
    setDimensionsToParent(canvas);
  }

  for (const canvas of [selected, preview]) {
    fillColor(canvas, color.rgb.R, color.rgb.G, color.rgb.B);
  }

  fillSquareColor(square, color.hcl.C);
  fillSliderColor(slider, color.hcl.H, color.hcl.L);
};

// const hoveredColor = document.getElementById("hoveredColor");
// const selectedColor = document.getElementById("selectedColor");

// function pick(event, destination) {
//   const bounding = canvas.getBoundingClientRect();
//   const x = event.clientX - bounding.left;
//   const y = event.clientY - bounding.top;

//   const pixel = context.getImageData(x, y, 1, 1);
//   const data = pixel.data;
//   const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`;

//   destination.style.background = rgba;
//   destination.textContent = rgba;

//   return rgba;
// }

// function mouseOut(event, hovered, selected) {
//   hovered.style.background = selected.style.background;
//   hovered.textContent = selected.textContent;
// }

square.addEventListener("mousemove", (event) =>
  previewColor(event, square, preview)
);
// canvas.addEventListener("click", (event) => pick(event, selectedColor));
// canvas.addEventListener("mouseout", (event) =>
//   mouseOut(event, hoveredColor, selectedColor)
// );

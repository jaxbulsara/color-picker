// State handlers

import {
  colorFromHex,
  colorFromRGB,
  colorFromHSV,
  colorFromHCL,
} from "./palette.js";

const INIT_COLOR = "000000";

export default function State() {
  this.color = new ColorState();
  this.preview = new PreviewState();
  this.mouseDown = new MouseDownState();

  this.getColor = () => this.color.color;
}

function ColorState() {
  this.color = colorFromHex(INIT_COLOR);

  this.updateFromHex = (hex) => {
    this.color = colorFromHex(hex);
    return this.color;
  };
  this.updateFromRGB = (rgb) => {
    this.color = colorFromRGB(rgb);
    return this.color;
  };
  this.updateFromHSV = (hsv) => {
    this.color = colorFromHSV(hsv);
    return this.color;
  };
  this.updateFromHCL = (hcl) => {
    this.color = colorFromHCL(hcl);
    return this.color;
  };
}

function PreviewState() {
  this.on = false;

  this.turnOn = () => (this.on = true);
  this.turnOff = () => (this.on = false);
}

function MouseDownState() {
  this.square = false;
  this.slider = false;

  this.setSquare = () => {
    this.reset();
    this.square = true;
  };
  this.setSlider = () => {
    this.reset();
    this.slider = true;
  };

  this.reset = () => {
    this.square = false;
    this.slider = false;
  };
}

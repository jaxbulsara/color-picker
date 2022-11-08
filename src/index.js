var canvas = document.getElementById("picker");
var context = canvas.getContext("2d");

window.onload = function () {
  var width = canvas.width;
  var height = canvas.height;

  var imagedata = context.createImageData(width, height);

  // Create the image
  function createImage(offset) {
    // Loop over all of the pixels
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        // Get the pixel index
        var pixelindex = (y * width + x) * 4;

        // Generate a xor pattern with some random noise
        var red = (x + offset) % 256 ^ (y + offset) % 256;
        var green = (2 * x + offset) % 256 ^ (2 * y + offset) % 256;
        var blue = 50 + Math.floor(Math.random() * 100);

        // Rotate the colors
        blue = (blue + offset) % 256;

        // Set the pixel data
        imagedata.data[pixelindex] = red; // Red
        imagedata.data[pixelindex + 1] = green; // Green
        imagedata.data[pixelindex + 2] = blue; // Blue
        imagedata.data[pixelindex + 3] = 255; // Alpha
      }
    }
  }

  // Create the image
  createImage(Math.floor(0));

  // Draw the image data to the canvas
  context.putImageData(imagedata, 0, 0);
};

const hoveredColor = document.getElementById("hoveredColor");
const selectedColor = document.getElementById("selectedColor");

function pick(event, destination) {
  const bounding = canvas.getBoundingClientRect();
  const x = event.clientX - bounding.left;
  const y = event.clientY - bounding.top;

  const pixel = context.getImageData(x, y, 1, 1);
  const data = pixel.data;
  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`;

  destination.style.background = rgba;
  destination.textContent = rgba;

  return rgba;
}

function mouseOut(event, hovered, selected) {
  hovered.style.background = selected.style.background;
  hovered.textContent = selected.textContent;
}

canvas.addEventListener("mousemove", (event) => pick(event, hoveredColor));
canvas.addEventListener("click", (event) => pick(event, selectedColor));
canvas.addEventListener("mouseout", (event) =>
  mouseOut(event, hoveredColor, selectedColor)
);

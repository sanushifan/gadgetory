// const zoom_container = document.getElementById("zoom-container")
// const zoom_image = document.getElementById("zoom-image")

// Create zoom lens
const lens = document.createElement("div");
lens.classList.add("zoom-lens");
document.getElementById("zoom-container").appendChild(lens);

// Add mousemove event listener
document.getElementById("zoom-container").addEventListener("mousemove", function (e) {
  zoom(e);
});

// Add mouseleave event to reset the zoom effect
document.getElementById("zoom-container").addEventListener("mouseleave", function () {
  resetZoom();
});

lens.addEventListener("mousedown", function () {
  document.addEventListener("mousemove", zoom);
  document.addEventListener("mouseup", function () {
    document.removeEventListener("mousemove", zoom);
  });
});

function zoom(e) {
  // Show the zoom lens
  lens.style.display = "block";

  // Get the position of the mouse relative to the container
  const rect = document.getElementById("zoom-container").getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  // Set lens position
  lens.style.left = `${x - lens.offsetWidth / 2}px`;
  lens.style.top = `${y - lens.offsetHeight / 2}px`;

  // Zoom effect: scale the image based on mouse position
  const scale = 2;
  document.getElementById("zoom-image").style.transform = `scale(${scale})`;
  document.getElementById("zoom-image").style.transformOrigin = `${(x / rect.width) * 100}% ${
    (y / rect.height) * 100
  }%`;
}

function resetZoom() {
  // Reset the zoom effect and lens
  document.getElementById("zoom-image").style.transform = "scale(1)";
  lens.style.display = "none"; // Hide the zoom lens
}

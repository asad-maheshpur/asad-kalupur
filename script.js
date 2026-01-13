const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("upload");
const downloadBtn = document.getElementById("download");

const frame = new Image();
frame.src = "frame.png";

let img = new Image();
let imgX = 0, imgY = 0;
let imgScale = 1;

let isDragging = false;
let startX = 0, startY = 0;

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
    img.onload = () => {
      imgScale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
      );
      imgX = (canvas.width - img.width * imgScale) / 2;
      imgY = (canvas.height - img.height * imgScale) / 2;
      draw();
    };
  };
  reader.readAsDataURL(file);
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    imgX,
    imgY,
    img.width * imgScale,
    img.height * imgScale
  );
  ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
}

/* ===== Mouse Events (PC) ===== */
canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.offsetX - imgX;
  startY = e.offsetY - imgY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  imgX = e.offsetX - startX;
  imgY = e.offsetY - startY;
  draw();
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);

/* ===== Touch Events (Mobile) ===== */
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isDragging = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  startX = touch.clientX - rect.left - imgX;
  startY = touch.clientY - rect.top - imgY;
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!isDragging) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  imgX = touch.clientX - rect.left - startX;
  imgY = touch.clientY - rect.top - startY;
  draw();
});

canvas.addEventListener("touchend", () => isDragging = false);

/* ===== Download ===== */
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "profile-frame.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

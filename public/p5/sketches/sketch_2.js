function setup() {
  slidX = createSlider(0, 500, 100);
  slidX.position(10, 10);
  slidY = createSlider(0, 500, 100);
  slidY.position(10, 40);
  slidZ = createSlider(0, 500, 100);
  slidZ.position(10, 70);
  createCanvas(windowWidth, windowHeight, WEBGL);
  graphics = createGraphics(200,200);
  graphics.background(255);
  colorMode(RGB, 255)
//  camera = createCamera();
  createEasyCam();
  document.oncontextmenu = function() { return false; }


//  slider.style('width', '80px');

}

function draw() {
  background(255);
  rotX = 0;
  rotY = 0;
  rotZ = 0;
  valX = slidX.value();
  valY = slidY.value();
  valZ = slidZ.value();
  /* if (mouseIsPressed) {
      rotX = pmouseX + rotX;
      rotY = pmouseY = rotY;
  //    rotateX((rotX * 3.14) / 180);
  //    rotateY((rotY * 3.14) / 180);
}*/
  fill(valX, valY, valZ);
  // square(200, 200, 200);
  rotateX(0.5 + (rotX * 3.14) / 180);
  rotateY(0.5 + (rotY * 3.14) / 180);
  rotateZ(1.3);
  describe('black 50-by-50 rect turns white with mouse doubleClick/press.');
  box(valX, valY, valZ);
  

  let value = 0;

function doubleClicked() {
  if (value === 0) {
    box(valX, valY, valZ);
  } else {
    sphere(valX, valY, valZ)
  }
}









}

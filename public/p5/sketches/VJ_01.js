let noiseVal;
let noiseScale = 0.1;
let noiseSpeed = 0.02;
let strokeW = 5;
let splinePoints = 10;
let splineDetail = 4;
let noiseX = 0;
let noiseY = 10000;
let noiseZ = 20000;
let mic;
let rot = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(strokeW);
  colorMode(HSB, 100);
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
    background(0, 0, 0, 1);

  noiseX += noiseSpeed;
  noiseY += noiseSpeed;
  noiseZ += noiseSpeed;
  translate(width/2, height/2)
  rotate(radians(rot))
  surfer()
  push()
  rotate(PI)
  surfer()
  pop()

  rot += 1
}

function surfer() {
  let vol = mic.getLevel();
  push()
  translate(30, 30)
  beginShape();
    // curveVertex(0, 0);
    curveVertex(30, 30);
  for (let i = 0; i <= splinePoints; i++) {
    let x = map(i, 0, splinePoints, 0, vol * 50 * width/4);
    let y = map(i, 0, splinePoints, 0, vol * 50 * height/4);
    let h = noise(noiseY + x * noiseScale, noiseX + y * noiseScale, noiseZ) * 150;
    stroke(h, 100, 100);
    // let xoff = vol * 1000
    // let yoff = vol * 1000
    let xoff = map(noise(noiseX + x * noiseScale, noiseY + y * noiseScale * vol, noiseZ), 0, 1, -50, 50);
    let yoff = map(noise(noiseX + y * noiseScale, noiseY + x * noiseScale * vol, noiseZ), 0, 1, -50, 50);

    let v = createVector(x + xoff, y + yoff);
    curveVertex(v.x, v.y);
  }
    // curveVertex(mo, v.y);
  endShape();
  pop()

}

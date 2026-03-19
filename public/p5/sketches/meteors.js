function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke()
  colorMode(HSB, 100)

}

let myHue = 0;
let spid1 = 0;
let spid2 = 0;
let wigg = 5;

let radius = 300;

function draw() {
  background(0, 10);
  myHue += random(0.75);
  if (myHue > 100) myHue = 0;
  fill(myHue, 50, 100)
  // funckyFish()
  noM = map(mouseX, 0, width, 1, 10) //no of meteors
  angM = 0

  for(i=0;i<noM;i++) {
    angM = angM + 360/noM
    funckyMeteor(angM)

  }

  spid1 += 3
  spid2 += 0.02
}

function funckyFish() {
  push()
  bezier(windowWidth/3, mouseY + noise(spid2/2) * radius + mouseY, mouseX, noise(spid2/2) * radius, mouseY, noise(spid2) * radius + mouseY, mouseX + noise(spid2) * radius, mouseY);
  pop()
}


function funckyMeteor(start) {
  push()
  noFill()
  strokeWeight(20)
  stroke(100-myHue, 50, 100)
  // rotate(radians(start))
  arc(windowWidth/2, windowHeight/2, noise(spid2) * radius, noise(spid2) * radius, radians(50 + spid1 + start), radians(60 + spid1 + start))
  pop()

}

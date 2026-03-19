function setup() {
  xwidth = windowHeight;
  ywidth = windowHeight;
  createCanvas(windowWidth, ywidth);
}

function draw() {
  background(204, 20, 50);
  noStroke();
  eye(height/3, height/3, height*1/2);
  // print(dis)
  //circle(xwidth/(6/5), ywidth/(6/5), 100);
}

function eye(xpos, ypos, rad) {
  // let xpos = height/3;
  // let ypos = height/3;
  // rad = height*1/2;
  let x = 0;
  let y = 0;
  let squish = 0;
  ang = atan2(mouseY-ypos,mouseX-xpos);
  dis = dist(x + xpos, y + ypos, mouseX, mouseY)
  pupD =  rad/2;
  pupd = map(dis, pupD, 0, pupD*1/3, pupD, true);
  eyeD = pupD/2;
  eyed = map(dis, pupD, 0, eyeD*1/3, eyeD, true);
  translate(xpos, ypos);
  //make the eyeball
  push();
    fill(255, 255, 255);
    circle(0, 0, rad);
  pop();
  push();
    rotate(ang - PI/2);
    translate(x, map(dis, 0, pupD - eyed, 0 , pupD - eyed*2/5 - pupD/6, true ))
    fill(50, 180, 130);
    ellipse(0, 0, pupD, pupd);
    fill(0);
    ellipse(0, 0, eyeD, eyed);
  pop();
}

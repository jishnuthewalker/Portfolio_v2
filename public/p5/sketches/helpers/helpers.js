function pointOnCircle(posX, posY, radius, angle) {
  const x = posX + radius * cos(angle);
  const y = posY + radius * sin(angle);
  // console.log(angle)
  return createVector(x, y)
}


function hexagon(posX, posY, radius) {
  const rotAngle = 360/6;

  push();
  noFill();
  beginShape();
  for (let i = 0; i < 6; i++) {
    const thisVert = pointOnCircle(posX, posY, radius, i * rotAngle);
    vertex(thisVert.x, thisVert.y);
    // console.log(i);
  }
  endShape(CLOSE);
  pop();
}

function randomSelectTwo() {
  const rando = random(1) > 0.5 ? true : false;
  // console.log(rando);
  return(rando);

}


function getRandomFromPalette() {
   const rando2 = floor(random(0, PALETTE.length));
   // console.log(rando2);
   return PALETTE[rando2];
}



function testLines() {

  let numShapes = randomSelectTwo() ? SIDES : SIDES*2 ;

  background(255);
  fill('teal');
  noFill();
  push();
   stroke(PALETTE[1]);
   translate(width/2, height/2);
   ellipse(0, 0, CRYSTAL_SIZE, CRYSTAL_SIZE);

   stroke(getRandomFromPalette());
   const angle = 360 / numShapes;
   for (i = 0; i < numShapes; i++) {
     line(0, 0, CRYSTAL_SIZE/2, 0);
     rotate(angle);
   }
  pop();
}

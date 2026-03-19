//
const CRYSTAL_SIZE = 300;
const SIDES = 6;
let PALETTE = [];
let touchTest = 1;
let layers = [];


function setup() {

  var button = createButton("change");
  button.mousePressed(resetSketch)
  createCanvas(windowWidth, windowHeight, SVG);
  noLoop();
  angleMode(DEGREES);
  rectMode(CENTER);
  textSize(32);
  text('TAP/refresh TO CHANGE', 10, 30);

  PALETTE = [
    color(255, 200, 200),
    color(4, 0, 125),
    'teal'
  ]
  }

function draw() {
  background(255);
  noFill();
  // testLines();

  // const layer = new Circles();
  // layer.render();
  //
  // const layer2 = new SimpleLines();
  // layer2.render();
  // // console.log(layer
  //
  // const layer3 = new OutlineShape();
  // layer3.render();


  let picker = random(1);
  if (picker < 0.7) {
    layers.push(new OutlineShape());
  }

  picker = random(1);
  if (picker < 0.5) {
    layers.push(new Circles());
  }

  picker = random(1);
  if (picker < 0.5) {
    layers.push(new SimpleLines());
  }

  picker = random(1);
  if (picker < 0.5) {
    layers.push(new NestedShapes());
  }



  // let layers = [];
  layers.forEach((layer) => {
    layer.render()
  });

  console.log(layers);

  layers = [];
  layers.length = 0;

}






function resetSketch() {
  // background(255)

  clear()
}

function mouseClicked() {
  background(255)
  draw()
  touchTest = 0;
}

function touchStarted() {
  if (touchTest === 1) {
  background(255)
  draw()
  }
  else {
    return("no touch")
  }
}

let checkbox;

var textHor, textHorSlider;
var textHeight, textHeightSlider;

function preload() {
  myFont = loadFont("assets/Roboto-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  strokeWeight(2);
  smooth();
  // input = createInput('tetxt here');
//  background(0);
  textHorSlider = createSlider(0,100,20); textHorSlider.position(15,367); textHorSlider.style('width','100px');
  textHeightSlider = createSlider(0,100,40); textHeightSlider.position(15,397); textHeightSlider.style('width','100px');
  createEasyCam();
}

function draw() {
textHor = textHorSlider.value();
textHeight = textHeightSlider.value();
background(150);
stroke(255);
noFill();
// square(30, 200, 300)

// push();
beginShape();
// vertex(0, textHeight+strY);
vertex(0, textHeight);
// vertex(textHor/2+strX/2, 0);
vertex(textHor/2, 0);
// vertex(textHor+strX, textHeight+strY);
vertex(textHor, textHeight);
endShape();

   // ang = atan((textHor/2+strX/2)/(textHeight+strY));
   ang = atan((textHor/2)/(textHeight));
   // angX = tan(ang)*(textHeight/3);
   angX = tan(ang)*(textHeight/3);

  // line(angX, 2*textHeight/3+strY, textHor+strX-angX, 2*textHeight/3+strY);
  line(angX, 2*textHeight/3, textHor-angX, 2*textHeight/3);
// pop();


// translate(100,100,100);
textFont(myFont);
fill(255);
textSize(30);
text("what is dreaming?", 100, 100);

}

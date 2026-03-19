class Layer {
  constructor() {
    this.sides = SIDES;
    this.strokeColor = getRandomFromPalette();
    this.numShapes = randomSelectTwo() ? (SIDES) : (SIDES/2);
    this.angle = 360 / this.numShapes;
    this.weight = randomSelectTwo() ? 1 : 3;
    this.stepsOut = 8;
    this.stepSize = (CRYSTAL_SIZE / 2) / this.stepsOut;
  }
}


class Circles extends Layer {
  constructor() {
    super();
    // console.log(this.weight)
    this.size1 =((CRYSTAL_SIZE / 2) + 0.93);
    this.size2 =((CRYSTAL_SIZE / 4) + 0.93);
    this.negate = randomSelectTwo() ? 1 : -1;
    this.select = randomSelectTwo();
    this.shapeSize = this.select ? this.size1 : this.size2;
    this.position = ((CRYSTAL_SIZE / 2) - (this.shapeSize / 2)) * this.negate;

  }

  render() {
    push();
      stroke(this.strokeColor);
      strokeWeight(1);
      translate(width/2, height/2);
      for (let i = 0; i < this.numShapes; i++) {
        ellipse(this.position, 0, this.shapeSize, this.shapeSize)
        rotate(this.angle);
      }
    pop();
  }
}


class SimpleLines extends Layer {
  constructor() {
    super();
    this.steps = randomSelectTwo() ? this.stepsOut : int(this.stepsOut*1.25);
    this.start = random(0, this.steps);
    this.stop = random(this.start, this.steps + 1);

  }

  render() {
    push();
      this.select = randomSelectTwo();
      this.numLines = (this.select ? this.numShapes : this.numShapes * 2);

      stroke(this.strokeColor);
      strokeWeight(this.weight);
      translate(width/2, height/2);

      for (let i = 0; i < this.numLines; i++) {
        line(this.start * this.steps, 0, this.stop * this.steps, 0);
        rotate(this.select ? this.angle : this.angle / 2);
        console.log(this.angle, this.numLines);
      }
    pop();
  }
}

class OutlineShape extends Layer {
  constructor() {
    super();
    this.size1 = randomSelectTwo() ? CRYSTAL_SIZE : (CRYSTAL_SIZE/2);
    this.size2 = randomSelectTwo() ? (CRYSTAL_SIZE/3) : (CRYSTAL_SIZE/4);
    this.select = randomSelectTwo();
    this.shapeSize = this.select ? this.size1 : this.size2;
    this.hexTrue = randomSelectTwo();
  }

  render() {
    push();
      stroke(this.strokeColor);
      strokeWeight(this.weight);
      translate(width/2, height/2);
      if (this.hexTrue) {
        hexagon(0, 0, this.shapeSize / 2);
      }
      else {
        ellipse(0, 0, this.shapeSize, this.shapeSize)
      }
    pop();
  }

}

class NestedShapes extends Layer {
  constructor() {
    super();
    this.nestNum = int(random(this.stepsOut));
    this.nestSize = this.nestNum * this.stepSize;
    this.hexTrue = randomSelectTwo();
  }

  render() {
    push();
      stroke(this.strokeColor);
      strokeWeight(this.weight);
      translate(width/2, height/2);
      for (let i = 0; i < this.nestNum; i++) {
      if (this.hexTrue) {
        hexagon(0, 0, this.nestSize);
        this.nestSize = this.nestSize - this.stepSize;
        console.log("hex");
      }
      else {
        this.diam = this.nestSize * 2
        ellipse(0, 0, this.diam, this.diam)
        this.nestSize = this.nestSize - this.stepSize;
        console.log("circle");
      }
    }
    pop();
  }
}

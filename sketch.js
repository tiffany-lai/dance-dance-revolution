// Tiffany Lai (thlai) & Helen Wu (hdw)
// 15-104, Section A
// Project 12 - Final

var font; // variable for font
var music; // variable for music
var fft; // variable for p5.FFT library
var amp; // variable for p5.Amplitude library
var scrollingArrows = []; // array to store
var opacity = 255; // opacity of start screen
var scoreCount = 0; // score count!
var playMode = 0;

function preload() {
  font = loadFont('slkscr.ttf'); // load font 'silk screen'
  music = loadSound('music.mp3'); // load music
}

function setup() {
  createCanvas(480, 480);
  fft = new p5.FFT(0.9, 256); // load p5.FFT library
  amp = new p5.Amplitude(); // load p5.Amplitude
}

function draw() {
  background(22, 35, 42);
  circleBeat(); // background sound visualization
  displayTriangles(); // display top triangles
  moveTriangles(); // top triangles go down when pressing specific keys
  generateArrows();

  for (var i = 0; i < scrollingArrows.length; i++) {
    scrollingArrows[i].move(); // move scrolling arrows
    scrollingArrows[i].render(); // render scrolling arrows
    if (scrollingArrows[i].y < -500) { // if they go off the screen, remove from array
      scrollingArrows.shift();
    }
  }
  scoreCounter(); // score counter
  endScreen();
  startScreen();
}

// ========== START SCREEN ========== //
function startScreen() {
    fill(255, 56, 115, opacity);
    rect(0,0,width,height);
    textSize(12);
    if (frameCount%2 == 0){
      fill(255,opacity);
      textAlign(CENTER);
      textSize(12);
      text("CLICK TO PLAY", width/2, height/2);
    }
}

// ========== CLICK TO PLAY ========== //
function mouseClicked() {
  displayTriangles(); // display main triangles
  opacity = 0;
  moveTriangles();
  if (playMode == 0) {
    music.play();
    playMode = 'sustain';
  }
}

// ========== BACKGROUND SOUND VISUALIZATION ========== //
function circleBeat() {
  var spectrum = fft.analyze(); // analyze music spectrum
  // drawing the circle
  push();
  translate(width/2, height/2);
    for (var i = 0; i <  spectrum.length; i++) {
      var angle = map(i, 0, spectrum.length, 0, 360); // map spectrum to degrees
      var spec = spectrum[i];
      var r = 2 * map(spec, 0, 256, 20, 100);
      var x = r * cos(angle);
      var y = r * sin(angle);

      fill(200, i*3, i*5); // fill with gradient
      noStroke();
      ellipse(x, y, 3, 3); // tiny center circles
    }
  pop();
}

//==========CREATE TOP TRIANGLES ==========//
// make triangles object
function makeTriangles (l, d, u, r) {
  var triangles = {
    left: l,
    down: d,
    up: u,
    right: r,
    display: displayTriangles,
    move: moveTriangles
  }
  return triangles;
}

// display triangles
function displayTriangles() {
  fill(255);
  noStroke();
  // draw four anchor triangles
  triangle(115, this.l+66, 154, this.l+88, 154, this.l+44); // left
  triangle(185, this.d+53, 207, this.d+92, 229, this.d+53); // down
  triangle(272, this.u+40, 250, this.u+79, 295, this.u+79); // up
  triangle(325, this.r+44, 325, this.r+89, 364, this.r+66); // right

  // draw 3D part of anchor triangles
  fill(116, 136, 133);
  quad(115, this.l+66, 154, this.l+88, 154, 93, 115, 71); // left
  quad(250, this.u+79, 295, this.u+79, 295, 85, 250, 85); // up
  fill(230, 160, 133);
  quad(185, this.d+53, 185, 62, 207, 102, 207, this.d+92); // down (left)
  quad(207, this.d+92, 207, 102, 229, 62, 229, this.d+53); // down (right)
  quad(325, this.r+89, 325, 94, 364, 71, 364, this.r+66); // right
}

// move triangles down when you press specific arrow key
function moveTriangles(){
  if (keyIsDown(LEFT_ARROW)) {
    this.l = 3;
  } else if (keyIsDown(DOWN_ARROW)) {
    this.d = 5;
  } else if (keyIsDown(UP_ARROW)) {
    this.u = 4;
  } else if (keyIsDown(RIGHT_ARROW)) {
    this.r = 3;
  } else {
    this.l = 0;
    this.d = 0;
    this.u = 0;
    this.r = 0;
  }
}

// make arrow object
function makeArrows(aX, aY, spd, rot) {
  var arrows = {
    x: aX,
    y: aY,
    speed: spd,
    rotateArrow: rot,
    move: moveArrows,
    render: displayArrows,
    generate: generateArrows
  }
  return arrows;
}

// display arrows
function displayArrows() {
  push();
  stroke(0, 200, 200);
  strokeWeight(5);
  noFill();
  translate(this.x, this.y);
  rotate(this.rotateArrow);
  triangle(115, 66, 154, 88, 154, 44);
  pop();
}

// move arrows scrolling up
function moveArrows() {
	this.y -= this.speed;
}

// generate arrows
function generateArrows() {
  var vol = amp.getLevel(); // get amplitude level
  // if amp level is within certain threshold, generate arrow randomly
  if ((vol > 0.33 && vol < 0.34) || (vol > 0.18 && vol < 0.2) || (vol > 0.03 && vol < 0.032)) {
    var randomizer = int(random(0,4)); // random picker for left down up right arrows
    if(randomizer == 0){
      var newArrow = new makeArrows(0, 420, 4, 0); // make new LEFT arrow object
      scrollingArrows.push(newArrow);
    }

    if (randomizer == 1) {
      var newArrow = new makeArrows(140, 840, 4, 3/2*PI); // make new UP arrow object
      scrollingArrows.push(newArrow);
    }

    if (randomizer == 2) {
      var newArrow = new makeArrows(340, 420, 4, 1/2*PI); // make new DOWN arrow object
      scrollingArrows.push(newArrow);
    }

    if (randomizer == 3) {
      var newArrow = new makeArrows(480, 840, 4, PI); // make new RIGHT arrow object
      scrollingArrows.push(newArrow);
    }
  }
}

//========== END SCREEN ==========//
function endScreen() {
  if (music.isPlaying() ) {
    var endOpacity = 0;
  } else {fill(255, 56, 115, endOpacity);
    var endOpacity = 255;
    rect(0, 0, width, height);
    textSize(12);
      if (frameCount%2 == 0){
        fill(255,endOpacity);
        textFont(font);
        textAlign(CENTER);
        textSize(12);
        text("GAME OVER", width/2, height/2);
        text("SCORE: " + scoreCount, width/2, height/2+20);
    }
  }
}

// ========== SCORE COUNTER ========== //
function scoreCounter() {
  // draw borders on screen
  noStroke();
  fill(110, 120, 120);
  rect(0, 0, width, 7);
  rect(0, 0, 7, height);
  rect(0, height-7, width, 7);
  rect(width-7, 0, 7, height);
  fill(116, 136, 133);
  quad(182, height, 187, height-25, 292, height-25, 297, height);

  fill(255);
  text("SCORE: " + scoreCount, width/2, 472); // record scores
  var whichArrow; // which arrow to remove from array
  var needSplice = false;
  for (var i = 0; i < scrollingArrows.length; i++) {
    if (keyIsDown(LEFT_ARROW)) { // LEFT ARROW KEY PRESSED
      if (scrollingArrows[i].y > -10 && scrollingArrows[i].y < 30 && (scrollingArrows[i].x ==0)) {
        scoreCount = scoreCount + 10;
        whichArrow = i;
        needSplice = true;
      }
    }
    if (keyIsDown(DOWN_ARROW)){ // DOWN ARROW KEY PRESSED
      if (scrollingArrows[i].y > 180 && scrollingArrows[i].y < 220 && (scrollingArrows[i].x == 140)) {
        scoreCount = scoreCount + 10;
        whichArrow = i;
        needSplice = true;
      }
    }
    if (keyIsDown(UP_ARROW)){ // UP ARROW KEY PRESSED
      if (scrollingArrows[i].y > -90 && scrollingArrows[i].y < -50 && (scrollingArrows[i].x == 340)) {
        scoreCount = scoreCount + 10;
        whichArrow = i;
        needSplice = true;
      }
    }
    if (keyIsDown(RIGHT_ARROW)){ // RIGHT ARROW KEY PRESSED
      if (scrollingArrows[i].y > 110 && scrollingArrows[i].y < 150 && (scrollingArrows[i].x == 480)) {
        scoreCount = scoreCount + 10;
        whichArrow = i;
        needSplice = true;
      }
    }
  }
  if (needSplice) {
    scrollingArrows.splice(whichArrow, 1);
  }
}

let brushCol; //varaible for the brush color
let brushSize = 25; //default brush size
let isColPal = false; //variable for the color palette
let brushOp = 25; //sets brush opacity 
let handpose; //Variable used for the ml Handpose model.
let video; //variable used to store video feed. 
let predictions = []; //The array for hand point        predictions.


function setup() {
  
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360,100,100,100);
  brushCol = color(0,0,0,50);
  brushCol.setAlpha(brushOp);
  background(0,0,100,100);
  
  video = createCapture(VIDEO); //capture video feed
  video.size(windowWidth, windowHeight); //make video feed the size   of the current canvas.
  print("loading") //prints so we know that the   handpose model is loading
  handpose = ml5.handpose(video, modelReady); //Calls modelReady() when it is loaded. 
  video.hide(); //hides the video element and just shows the canvas.

}

function draw() {
  

 if(mouseIsPressed && !isColPal){ //if iscolpal is false (default) mouse draws
fill(brushCol);
circle(mouseX, mouseY, brushSize); //this is where I would insert the finger tracking instead of mouse x and y
 }
 else if(isColPal){ // id iscolpal is true it turns into a color picker instead
    push();
    stroke(0,100,100,100);
    
    let h = map(mouseX,0,width,0,360);
    let b = map(mouseY,0,height,0,200);
    brushCol = color(h,100,b,50);
    
    fill(brushCol);
    //square(width*.75, height*.75, width*.25);
    pop();
  } else if(!isColPal){ //once iscolpall returns to false the square sets to the color chosen 
    push();
    noStroke();
    fill(brushCol);
   // square(width*.75, height*.75, width*.25);
    pop();
  }
  
  //image(video, 0, 0, width, height); //renders the video footage
  drawObject(); // we call this function to draw using the keypoints.
  
}

function modelReady() {
  console.log("Model ready!"); 
    // when handpose is ready, do the detection
    handpose.on("predict", function(results) {
    predictions = results;
  }); //once the handpose is ready it begins detecting
  handpose.predict(video); //callas handpose.predict on the image and predicts landmarks and fingers. 
}

function drawObject() {
  if (predictions.length > 0) {
    let prediction = predictions[0];
    let x = prediction.annotations.indexFinger[3][0];
    let y = prediction.annotations.indexFinger[3][1];
    let x1 = prediction.annotations.ringFinger[3][0];
    let y1 = prediction.annotations.ringFinger[3][1];
    let x2 = prediction.annotations.middleFinger[3][0];
    let y2 = prediction.annotations.middleFinger[3][1];
    let x3 = prediction.annotations.pinky[3][0];
    let y3 = prediction.annotations.pinky[3][1];
    let x4 = prediction.annotations.thumb[3][0];
    let y4 = prediction.annotations.thumb[3][1];
    print(prediction, x, y);
    noStroke(); 
    circle(round(x4), round(y4), brushSize);
    fill('hotpink');
    circle(round(x3), round(y3), brushSize);
    fill('blue');
    circle(round(x2), round(y2), brushSize);
    fill('lightblue');
    circle(round(x), round(y), brushSize);
    fill('purple');
    circle(round(x1), round(y1), brushSize);
    fill('pink');

     // draws a circle at the tip of the index finger (Access the tip of the finger in the last element of the finger.points list (element with index 3) and draw the ellipse using its x-y coordinates and round them to the nearest integer)
  }
}

function keyPressed(){
  if(key == 'x'){
    background(0,0,100,100);
  }
  else if(key =='e'){
    brushCol = color(random);
  } 
  else if(key == 'w'){
    brushSize = brushSize + 5;
  }
  else if(key == 's'){
    brushSize = brushSize - 5;
  }
  else if(key == 'a'){
    brushCol = color(0,0,100,100);
  }
} 
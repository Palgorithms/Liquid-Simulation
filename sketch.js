
let isShort = false;
let half = false;

let canvasHeight = document.body.clientHeight;
let canvasWidth = isShort ? half ? canvasHeight*9/8 : canvasHeight*9/16 : document.body.clientWidth;
let MouseDown = false;

///////////// Settings /////////////
let GravityRotation = false;
let DropSize = 50;
let gravityAmount = 1;
let gravityDir = 90 * Math.PI/180;
let iterations = 5;
////////////////////////////////////

function setup() {
  createCanvas(canvasWidth,canvasHeight);
  rectMode(CENTER);
}

function draw() {
  background(0);
  fill(255);
  stroke(255,0,0)
  if(MouseDown){
    new Drop(mouseX+Math.random()-.5,mouseY+Math.random()-.5);
  }
  Drop.RenderDrops()
  if(GravityRotation){
    gravityDir += 1 * Math.PI/180;
  }
  else{
    gravityDir = 90 * Math.PI/180;
  }
}

class Drop{
  static Drops = [];
  static ID = 0;

  vx = 0;
  vy = 0;
  constructor(x,y){
    this.id = Drop.ID++;
    this.x = x;
    this.y = y;
    Drop.Drops.push(this)
  }

  static RenderDrops(){

    // 1. UPDATE
    Drop.Drops.forEach((drop)=>{
      drop.vx += cos(gravityDir) * gravityAmount;
      drop.vy += sin(gravityDir) * gravityAmount;

      drop.vx *= 0.99;
      drop.vy *= 0.99;

      drop.x += drop.vx;
      drop.y += drop.vy;

      drop.comeBackToScreen();
    });

    // 2. SOLVE COLLISIONS (GLOBAL)
    for(let k = 0; k < iterations; k++){
      for(let i = 0; i < Drop.Drops.length; i++){
        for(let j = i + 1; j < Drop.Drops.length; j++){

          let a = Drop.Drops[i];
          let b = Drop.Drops[j];

          let dx = b.x - a.x;
          let dy = b.y - a.y;

          let dist = sqrt(dx*dx + dy*dy)+5;
          if(dist === 0 || dist > DropSize) continue;

          let overlap = DropSize - dist;

          let nx = dx / dist;
          let ny = dy / dist;

          let force = overlap * 0.2; // FIXED

          let moveX = nx * force;
          let moveY = ny * force;

          a.x -= moveX;
          a.y -= moveY;

          b.x += moveX;
          b.y += moveY;

          // viscosity
          let avgVX = (a.vx + b.vx)/2;
          let avgVY = (a.vy + b.vy)/2;

          a.vx = lerp(a.vx, avgVX, 0.1);
          a.vy = lerp(a.vy, avgVY, 0.1);

          b.vx = lerp(b.vx, avgVX, 0.1);
          b.vy = lerp(b.vy, avgVY, 0.1);
        }
      }
    }

    // 3. RENDER
    Drop.Drops.forEach((drop)=>{
      noStroke();
      fill("cyan");
      circle(drop.x, drop.y, DropSize);
    });
  }
  

  comeBackToScreen(){
    if(this.y + DropSize/2 > canvasHeight){
      this.y = canvasHeight - DropSize/2;
      this.vy *= .3;
    }
    if(this.y - DropSize/2 < 0){
      this.y = DropSize/2;
      this.vy *= .3;
    }
    if(this.x + DropSize/2 > canvasWidth){
      this.x = canvasWidth - DropSize/2;
      this.vx *= .3;
    }
    if(this.x - DropSize/2 < 0){
      this.x = DropSize/2;
      this.vx *= .3;
    }
  }
}

function mousePressed(e){
  if(e.button == 0){
    MouseDown = true;
  }
}

function mouseReleased(e){
  if(e.button == 0){
    MouseDown = false;
  }
}

function keyPressed(e){
  if(key === 'g'){
    GravityRotation = !GravityRotation;
  }
}

function GetAngle(p1,p2){
  return atan2(p2.y - p1.y, p2.x - p1.x);
}

function GetDistance(p1,p2){
  return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2))
}

function drawArrow(x1,y1,x2,y2){
  stroke(255)
  line(x1,y1,x2,y2)
  circle(x1,y1,5)
  let angle = Math.atan2(y2 - y1, x2 - x1);
  fill(255)
  line(x2,y2,x2+cos(angle+Math.PI/4*3)*10,y2+sin(angle+Math.PI/4*3)*10)
  line(x2,y2,x2+cos(angle-Math.PI/4*3)*10,y2+sin(angle-Math.PI/4*3)*10)
}

function drawLine(x1,y1,x2,y2){
  stroke(255)
  line(x1,y1,x2,y2)
  fill(255)
  circle(x1,y1,5)
  circle(x2,y2,5)
}

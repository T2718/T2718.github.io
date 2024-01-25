let scene = 0;
let n = 100;
const fr = 30;
let circle_x = 0;
let circle_y = 0;
let v = 10;
let theta = Math.PI / 4;
let paddle_x = 0;
let paddle_y = 0;
let paddle_width = 100;
let paddle_height = 20;
let paddle_v = 13;
let touch_x = null;
let touch_y = null;
let rand = 0;
let First_tf;
let return_dict = {};
let rad = 10;
let hit_n = 0;

/*function requestFullscreen(elem) {
  // 全画面表示をリクエストするメソッドを取得
  const method = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;
  if (method) {
    method.call(elem); // 全画面表示をリクエスト
  }
}

function openFullscreen() {
  const elem = document.documentElement;
  requestFullscreen(elem);
}

openFullscreen();*/

setTimeout(()=>{
  width = window.innerWidth;
  height = window.innerHeight;
  
  //createCanvas(width,height);
  scene = 1;
  First_tf = true;
  circle_x = width/2|0;
  circle_y = height-100;
  paddle_x = width/2|0;
  paddle_y = height-50;
},100);





function range(n_k){
  return Array.from(Array(n_k),(v,k)=>k);
}

function make(w_n,h_n,size_h_k,x_gap_k,y_gap_k,side_gap,high_gap){
  // W側の個数:w_n
  // H側の個数:h_n
  // W側のサイズ:size_w_k
  // H側のサイズ:size_h_k
  // 上側の隙間:high_gap
  // 上下の隙間:y_gap_k
  size_x_k = (width-2*side_gap+x_gap_k)/w_n-x_gap_k
  x_k_list = []
  x_k0_list = range(w_n).map(k => side_gap+k*(size_x_k+x_gap_k));
    
  for (let k = 0; k < h_n; k++){
    x_k_list = x_k_list.concat(x_k0_list)
  }
  
  y_k_list = []
  for (let k = 0; k < h_n; k++){
    for (let k0 = 0; k0 < w_n; k0++){
      y_k_list.push(high_gap+k*(size_h_k+y_gap_k));
    }
  }
  return {x_list:x_k_list,y_list:y_k_list,size_x:size_x_k,size_y:size_h_k}
  //return [x_k_list,y_k_list,size_x_k,size_h_k]
}

function move(){
  fill(0,0,255);
  rect(paddle_x-paddle_width/2,paddle_y-paddle_height/2,paddle_width,paddle_height);
  fill(0,0,0);
  circle(circle_x,circle_y,rad);
  circle_x += v*Math.cos(theta);
  circle_y -= v*Math.sin(theta);
  rand = Math.random()*Math.PI/8-Math.PI/16;
  if (circle_x > width){
    theta = Math.PI-theta;
    circle_x = width;
  }
  if (circle_x < 0){
    theta = Math.PI-theta;
    circle_x = 0;
  }
  if (circle_y < 0){
    theta *= -1;
    circle_y = 0;
  }
  if (circle_y > height){
    theta *= -1;
    circle_y = height;
  }



  // paddleに当たった時
  
  rand = Math.random()*Math.PI/32-Math.PI/64;
  if (circle_x > paddle_x-paddle_width/2 && circle_x < paddle_x+paddle_width/2 && circle_y > paddle_y-paddle_height/2 && circle_y < paddle_y+paddle_height/2){
    const atan_c = Math.atan(100/(paddle_x-circle_x));
    if(atan_c > 0){
      theta = atan_c;
    } else {
      theta = Math.PI+atan_c;
    }
    theta += rand;
    //theta += (paddle_x-circle_x)/paddle_width*2*Math.PI/16;
    if (Math.sin(theta) < 0) theta *= -1;
    circle_y = paddle_y-paddle_height/2-1;
  }


  //角度が急な時
  
  if (Math.abs(Math.sin(theta)) < Math.sin(Math.PI/16)) {
    console.log(Math.sin(theta));
    rand = Math.random()*Math.PI/16+Math.PI/8;
    theta = (Math.sign(Math.cos(theta))-1)*Math.PI/(-2)+rand*Math.sign(Math.cos(theta));
  }
  if (Math.abs(Math.cos(theta)) < Math.cos(7*Math.PI/16)){
    rand = Math.random()*Math.PI/8-Math.PI/16;
    
    theta = Math.PI/2+Math.sign(Math.cos(theta))*(Math.PI/4+rand);
    
  }
}

function scene1(){
  //size_y = 10;
  
  if (First_tf){
    return_dict = make(30,15,10,3,5,20,10);
    First_tf = false;
  }
  if (touch_x != null && touch_y != null) {
    if (touch_x > width/2){
      paddle_x += paddle_v;
    } else {
      paddle_x -= paddle_v;
    }
  }
  for (let k in return_dict.x_list){


    // 当たった時
    
    if (circle_x-rad < return_dict.x_list[k]+return_dict.size_x && circle_x+rad > return_dict.x_list[k] && circle_y-rad < return_dict.y_list[k]+return_dict.size_y && circle_y+rad > return_dict.y_list[k]){

      hit_n += 1;
      v += 0.01;
      paddle_v += 0.01;
      /*if (hit_n % 10 == 0){
        rad += 1;
      }*/
      
      return_dict.x_list.splice(k,1);
      return_dict.y_list.splice(k,1);

      // 横から当たった時
      rand = Math.random()*Math.PI/18-Math.PI/9;
      if (Math.min(Math.abs(return_dict.x_list[k]-circle_x),Math.abs(return_dict.x_list[k]+return_dict.size_x-circle_x)) < Math.min(Math.abs(return_dict.y_list[k]-circle_y),Math.abs(return_dict.y_list[k]+return_dict.size_y-circle_y))){
        theta = Math.PI-theta+rand;
      } else {
        theta *= -1;
        theta += rand;
      }
    }
  }
  fill(0,255,0);
  noStroke();
  textSize(200);
  textAlign(CENTER, CENTER);
  text(String(return_dict.x_list.length),width/2,height/2);
 
  return return_dict;
}

//alert(range(10));
function setup() {
  setTimeout(()=>{
    createCanvas(width,height);
    frameRate(fr);
  },100);
}

function draw() {
  background(200);

  fill(255,0,0);

  //x_list = range(width/10|0).map(k => 10*k);
  //y_list = range(height/10|0);
  //size_x = 10;

  if (scene == 1) xy_list = scene1();

  //console.log(xy_list);

  if (scene != 0){
    x_list = xy_list.x_list;
    y_list = xy_list.y_list;
    size_x = xy_list.size_x;
    size_y = xy_list.size_y;

    /*x_list = xy_list["x_list"];
    y_list = xy_list["y_list"];
    size_x = xy_list["size_x"];
    size_y = xy_list["size_y"];*/

    fill(255,0,0);
    for (const num_k in range(x_list.length)){
      rect(x_list[num_k],y_list[num_k],size_x,size_y);
      //console.log(x_list[num_k]);
    }
  }

  if (scene > 0) move();
}

function touchStarted() {
  touch_x = touches[0].x;
  touch_y = touches[0].y;
}

function touchEnded(touches) {
  touch_x = null;
  touch_y = null;
}



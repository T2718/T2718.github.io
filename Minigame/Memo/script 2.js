
const width = window.innerWidth;
const height = window.innerHeight;
let appear = false;
let x = 100;
let y = 100;
let r = 3;
let color = [255,0,0,r];
let line_list = [[[]]];
window.onbeforeunload = function(e) {
  e.returnValue = "ページを離れようとしています。よろしいですか？";
  window.sessionStorage.setItem('Memo/line_list',line_list);
}
const session_Storage = window.sessionStorage.getItem('Memo/line_list');
alert(session_Storage);
if(sesson_Storage != null) line_list = window.sessionStorage.getItem('Memo/line_list');
let start_line_xy = [0,0];
let start_xy = [];
let delete_n = 0;

//let touches = [{x:0,y:0}];


function change_color(x_f,y_f){
  x_f0 = Math.max(Math.min(x_f,150),51)-50
  
  if ( 50 < start_xy[0] && start_xy[0] < 150){
    if (80 < start_xy[1] && start_xy[1] < 120){
      color[0] = 255*x_f0/100;
    } else if (150 < start_xy[1] && start_xy[1] < 190) {
      color[1] = 255*x_f0/100;
    } else if (220 < start_xy[1] && start_xy[1] < 260){
      color[2] = 255*x_f0/100;
    } else if (290 < start_xy[1] && start_xy[1] < 330){
      color[3] = 25*x_f0/100;
    } else if (360 < start_xy[1] && start_xy[1] <380) {
      delete_n += 1;
      if (delete_n % 3 == 0){
        alert('何回も呼ぶなよ！');
        alert('こっちだってやることがあるんだ!');
        alert('........');
        alert('...ごめん、怒りすぎた');
        alert('次からは気をつけるよ');
      } else {
    
        var result_delete = confirm('一度消すと元には戻りません。\nこのまま続けますか？');
        if(result_delete) {
          line_list = [[[]]];
        } else {
          alert('消さないんかい!');
          var result_delete1 = confirm('消した方がいいんじゃない？');
          if(result_delete1){
            alert('ムリ〜〜〜〜www');

          } else {
            alert('........');
            alert('........');
            alert('.....OK');
          }
        }
      }
    }
  }
}

function setup(){
  createCanvas(width,height);
}

function draw(){
  background(255);
  noStroke();
  fill(0);
  rect(0,0,200,height);
  fill(color);
  if (appear) circle(x,y,r);
  for (let k = 1; k < line_list.length; k++){
    if (line_list[k].length >= 3){
      for (let k1 = 1; k1 < line_list[k].length-1; k1++){
        strokeWeight(line_list[k][0][3]);
        //console.log(line_list[k][0])
        stroke(line_list[k][0][0],line_list[k][0][1],line_list[k][0][2]);
        //console.log(line_list[k][k1+1]);
        line(line_list[k][k1][0],line_list[k][k1][1],line_list[k][k1+1][0],line_list[k][k1+1][1]);
      }
    }
  }
  strokeWeight(color[3]);
  stroke(255,0,0);
  fill(color[0],0,0);
  rect(50,80,100,40);
  stroke(0,255,0);
  fill(0,color[1],0);
  rect(50,150,100,40);
  stroke(0,0,255);
  fill(0,0,color[2]);
  rect(50,220,100,40);
  stroke(255,255,255);
  fill(255,255,255);
  rect(50,290,100,40);
  noStroke();
  fill(255,255,0);
  rect(50,360,100,20);

}

function touchStarted(){
  start_xy = [touches[0].x,touches[0].y].concat();
  if (touches[0].x < 200){
    change_color(touches[0].x,touches[0].y);
  } else {
    line_list.push([color.concat(),[touches[0].x,touches[0].y]]);
  }
}
function touchMoved(){
  x = touches[0].x;
  if (200 < start_xy[0] && x < 200) x = 200;
  y = touches[0].y;
  
  if (start_xy[0] > 200){
    line_list[line_list.length-1].push([x,y]);
    appear = true;
  } else {
    change_color(x,y);
  }
}
function touchEnded(){
  if (line_list[line_list.length-1].length == 2) line_list.pop();
  appear = false;
}

var cvx;

function initCanvas(){
  var c = document.createElement("canvas");

  document.body.appendChild(document.createElement("br"));

  document.body.appendChild(c);
  cvx = c;
  cvx.style.border='1px solid #fff'

  cvx.classList.add("float_R");

  cvx.height = 100;
  cvx.width  = 250;
  }


function draw(xlist){

//const canvas = document.getElementById("myCanvas");
  const ctx = cvx.getContext("2d");
  ctx.beginPath();
  ctx.strokeStyle = "red";
  var n = xlist.length;
  ctx.moveTo(0, xlist[1]);

  var offset = Math.max(1, n-50);

  for (var i=1;i<n; i++){
  
    ctx.lineTo(i*5, xlist[i+offset]);
    }

  ctx.stroke();
  }


function clearCanv(){

  const ctx = cvx.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0,0,500,250);

  }


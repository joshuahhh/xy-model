// xy
// by joshuah@mit.edu

$(function () {

var ready = false;
var lastdrawtime = 0;
var fps = 0;
var fpsdiv = document.getElementById("fps");

var ni = 120, nj = 80;

var cellsize = 6;

var grid = document.getElementById("grid");
var context = grid.getContext('2d');
grid.width = cellsize*ni;
grid.height = cellsize*nj;

var phases = new Array();
for (var i  = 0; i < ni; i++) {
  phases[i] = new Array();
}

function resetRandom() {
  for (var i  = 0; i < ni; i++) {
    for (var j = 0; j < nj; j++) {
      phases[i][j] = Math.random() * 2 * Math.PI
    }
  }
}
resetRandom();

var wrap = 'none';
$("input[name='wrap']").change(function() {
  wrap = $("input[name='wrap']:checked").val();
});

var T = 0;
$("#temp").slider({min: 0, max: 25,
  slide: function(event, ui) {
    T = (ui.value != undefined? ui.value : ui.slider("value"))/10
    $("#fbtemp").html(T);
    return true;}
  }).slider("option", "slide")(0, $("#temp"));

var B = 0;
$("#extb").slider({min: -20, max: 20,
  slide: function(event, ui) {
    B = (ui.value != undefined? ui.value : ui.slider("value"))/20;
    $("#fbextb").html(B);
    return true;}
  }).slider("option", "slide")(0, $("#extb"));

var J = 0;
$("#intstr").slider({min: -40, max: 40, value: 10,
  slide: function(event, ui) {
    J = (ui.value != undefined? ui.value : ui.slider("value"))/100;
    $("#fbintstr").html(J);
    return true;}
  }).slider("option", "slide")(0, $("#intstr"));


$("#reset_random").button()
  .click(resetRandom);
$("#reset_vortex").button()
  .click(function () {
     for (var i  = 0; i < ni; i++) {
       for (var j = 0; j < nj; j++) {
	 phases[i][j] = Math.atan2(j-nj/2, i-ni/2);
       }
     }
   });
$("#reset_vortexbuddies").button()
  .click(function () {
     for (var i  = 0; i < ni; i++) {
       for (var j = 0; j < nj; j++) {
	 phases[i][j] = Math.atan2(j-nj/2, i-2*ni/5) - Math.atan2(j-nj/2, i-3*ni/5) + 6.28;
       }
     }
   });

function rad2deg(angrad) {
  var angdeg = (angrad / (2*Math.PI) * 360) % 360;
  if (angdeg < 0) angdeg += 360;
  return Math.floor(angdeg);
}

function mod(a, b) {
  var notMod = a % b;
  if (notMod < 0) notMod += b;
  return notMod;
}

function torind(arr, i, j) {
  return arr[mod(i, arr.length)][mod(j, arr[0].length)];
}

function proind(arr, i, j) {
  var ni = i, nj = j;
  if (!(0<=ni && ni<arr.length)) {
    ni = mod(ni, arr.length);
    nj = arr[0].length - 1 - nj;
  }
  if (!(0<=nj && nj<arr[0].length)) {
    nj = mod(nj, arr[0].length);
    ni = arr.length - 1 - ni;
  }
  return arr[ni][nj];
}

var t = 100;
function draw() {
  setTimeout(draw, 1);
  t++;
  var curdrawtime = (new Date()).getTime();
  if (lastdrawtime > 0) {
    var deltadrawtime = curdrawtime - lastdrawtime;
    var fpsestimate = 1000/deltadrawtime;
    fps = (fps == 0 ? fpsestimate : (3*fps + fpsestimate)/4);
    fpsdiv.innerHTML = "" + Math.floor(fps);
  }
  lastdrawtime = curdrawtime;

  var drawi = new Array();
  var drawj = new Array();
  for (var c = 0; c < 360; c++) {
    drawi[c] = new Array();
    drawj[c] = new Array();
  }

  var newphases = new Array();
  for (var i = 0; i < ni; i++) {
    newphases[i] = new Array();
    for (var j = 0; j < nj; j++) {
      var f = 0;

      switch (wrap) {
      case 'none':
        f += (i > 0 ? Math.sin(phases[i][j]-phases[i-1][j]) : 0);
	f += (i < ni-1 ? Math.sin(phases[i][j]-phases[i+1][j]) : 0);
	f += (j > 0 ? Math.sin(phases[i][j]-phases[i][j-1]) : 0);
	f += (j < nj-1 ? Math.sin(phases[i][j]-phases[i][j+1]) : 0);
	break;
      case 'tor':
	f += Math.sin(phases[i][j]-torind(phases, i-1, j));
	f += Math.sin(phases[i][j]-torind(phases, i+1, j));
	f += Math.sin(phases[i][j]-torind(phases, i, j-1));
	f += Math.sin(phases[i][j]-torind(phases, i, j+1));
	break;
      case 'pro':
	f += Math.sin(phases[i][j]-proind(phases, i-1, j));
	f += Math.sin(phases[i][j]-proind(phases, i+1, j));
	f += Math.sin(phases[i][j]-proind(phases, i, j-1));
	f += Math.sin(phases[i][j]-proind(phases, i, j+1));
	break;
      default:
	console.log("bad value for 'wrap': " + wrap);
      }
      f *= J;
      f += T*(2*Math.random()-1);
      f += B*Math.sin(phases[i][j]);
      newphases[i][j] = phases[i][j] - f;

      var c = rad2deg(newphases[i][j]);
      drawi[c].push(i);
      drawj[c].push(j);
    }
  }
  var tempphases = phases;
  phases = newphases;
  newphases = tempphases;

  for (var c = 0; c < 360; c++) {
    for (var n = 0; n < drawi[c].length; n++) {
      if (n == 0) context.fillStyle = "hsl(" + c + ", 100%, 50%)";
      context.fillRect(drawi[c][n]*cellsize, drawj[c][n]*cellsize,
		       cellsize, cellsize);
    }
  }
}

draw();

});


var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
//ctx.lineWidth = 2;
ctx.lineJoin = ctx.lineCap = 'round';
// square sample size
var rate;
// lines steps
var steps;

function drawGrid(bw, bh){
    for (var x = 0; x <= bw; x += rate) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, bh);
    }
    for (var y = 0; y <= bh; y += rate) {
        ctx.moveTo(0, y);
        ctx.lineTo(bw, y);
    }
    ctx.lineWidth = 0.2;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.stroke();
}
function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for(var src in sources) {
        numImages++;
    }
    for(var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
}
function getRand(n){
    return Math.random()*n;
}
function fuzz(n, jitter=5){
    n -= jitter;
    return n+getRand(jitter);
}
function drawLines(x, y, density){
    if(density>0){
        var xSpace = rate/density;
        var xDelta = getRand(xSpace);
        var yDelta = getRand(rate);
        var way = yDelta<(rate/2)?'down':'up';
        
        ctx.beginPath();
        ctx.moveTo(x+xDelta, y+yDelta);
        ctx.strokeStyle = 'rgba(0, 0, 0, '+(density/steps+getRand(0.5))+')';
        
        while(xDelta<rate){
            xDelta += getRand(xSpace);
            yDelta = getRand(rate*0.25);
            yDelta += way=='down'?(rate*0.75):0;
            way = (way=='down')?'up':'down';
            ctx.lineTo(fuzz(x+xDelta), fuzz(y+yDelta));
        }
        ctx.stroke();//On trace seulement les lignes.
        ctx.closePath();
    }
}
function drawCanvas(images) {
    var fullWidth = images.main.width;
    var fullHeight = images.main.height;
    // auto set width & height
    canvas.width = fullWidth;
    canvas.height = fullHeight;
    
    ctx.drawImage(images.main, 0, 0);
    var imageData = ctx.getImageData(0, 0, fullWidth, fullHeight);
    
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(document.getElementById('grid').checked)drawGrid(fullWidth, fullHeight);
    ctx.lineWidth = 1;
    
    var data = imageData.data;
    // FIXED numbers of data / pixel
    var dpx = 4;    
    for (var y = 0; y < fullHeight; y+=rate) {
        for (var x = 0; x < fullWidth; x+=rate) {
            // get pixel values
            var basePx = (y*fullWidth+x)*dpx;
            // get pixel avg
            var avg = (data[basePx] + data[basePx +1] + data[basePx +2]) / 3;
            var i = steps-Math.ceil(steps*avg/255);
            //ctx.drawImage(images['sprite'+i], x, y);
            drawLines(x, y, i);
        }
    }
};


function init(){
    rate = parseInt(document.getElementById('rate').value);
    steps = parseInt(document.getElementById('steps').value);
    var sources = {main:document.getElementById('main-pix').src};
    loadImages(sources, drawCanvas);
}
document.getElementById('btn').addEventListener("click", init);
init();



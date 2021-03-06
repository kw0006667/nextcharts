/**
 * HSV to RGB color conversion
 *
 * H runs from 0 to 360 degrees
 * S and V run from 0 to 100
 *
 * http://snipplr.com/view/14590
 */
function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;
	 
	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));
	 
	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;
	 
	if(s == 0) {
		// Achromatic (grey)
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
	 
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));
	 
	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		 
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		 
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		 
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		 
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		 
		default: // case 5:
			r = v;
			g = p;
			b = q;
	}
	 
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hsvToHex(h, s, v) {
	var rgb = hsvToRgb(h, s, v);
	return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function distinctHexColors(count) {
    var colors = [];
    for(var hue = 0; hue < 360; hue += 360 / count) {
        colors.push(hsvToHex(hue, 100, 100));
    }
    return colors;
}

function colorLuminance(color, lum) {
	var hex = colorToHex(color);
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;
	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function colorToHex(c) {
	var m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(c);
	return m ? '#' + (1 << 24 | m[1] << 16 | m[2] << 8 | m[3]).toString(16).substr(1) : c;
}

// This function starts by creating a dummy <canvas> element which is never 
// attached to the page, so no one will ever see it. 
// As soon as we create the dummy <canvas> element, we test for the presence 
// of a getContext() method. This method will only exist if browser supports the canvas API.
// Finally, we use the double-negative trick to force the result to a Boolean value (true or false). 
function isCanvasEnabled() {
	return !!document.createElement('canvas').getContext;
}


function niceNum(range, round) {
    var exponent; /** exponent of range */
    var fraction; /** fractional part of range */
    var niceFraction; /** nice, rounded fraction */

    exponent = Math.floor(getBaseLog(10, range));
    fraction = range / Math.pow(10, exponent);

    if (round) {
      if (fraction < 1.5)
        niceFraction = 1;
      else if (fraction < 3)
        niceFraction = 2;
      else if (fraction < 7)
        niceFraction = 5;
      else
        niceFraction = 10;
    } else {
      if (fraction <= 1)
        niceFraction = 1;
      else if (fraction <= 2)
        niceFraction = 2;
      else if (fraction <= 5)
        niceFraction = 5;
      else
        niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
}

//returns the logarithm of y with base x
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

function calculateYStep(min, max, tickCount) {     
	if (min == max) {		
		max = min + 1;
	}
    var range = niceNum(max - min, false);      
    var tickSpacing = niceNum(range / (tickCount - 1), true);            
    var minValY = Math.floor(min / tickSpacing) * tickSpacing;
    var maxValY = Math.ceil(max / tickSpacing) * tickSpacing;    
    if ((minValY == min) && (minValY != 0)) {
    	minValY = minValY - tickSpacing;
    }
    return { minValY: minValY, maxValY: maxValY, yStep:(maxValY - minValY)/tickCount};    
}

function getMousePos(canvas, evt) {    
	// use jquery to be browser independent when computing scrollLeft and scrollTop
	var root = $(window);	
    // return relative mouse position
	var parent = $(canvas).parent();
	var mouseX, mouseY;
	if (parent.is('body')) {
	    mouseX = evt.clientX - canvas.offsetLeft  + root.scrollLeft();
	    mouseY = evt.clientY - canvas.offsetTop + root.scrollTop(); 
	} else {
		mouseX = evt.clientX - parent.offset().left  + root.scrollLeft();
		mouseY = evt.clientY - parent.offset().top  + root.scrollTop();
	}
   
    return {
       x: mouseX,
       y: mouseY
    };
}  

function posTop() {
    return typeof window.pageYOffset != 'undefined' ? window.pageYOffset: document.documentElement.scrollTop? document.documentElement.scrollTop: document.body.scrollTop? document.body.scrollTop:0;
}


function posLeft() {
    return typeof window.pageYOffset != 'undefined' ? window.pageYOffset: document.documentElement.scrollTop? document.documentElement.scrollTop: document.body.scrollTop? document.body.scrollTop:0;
}


// mousePos and tooltip are defined outside function implementation
var handleMouseEvent = {
		
  execute:function (canvas, tipCanvas, evt) {
		
	var tipCtx = tipCanvas.getContext('2d');			
	
    tipCanvas.style.left = (canvas.offsetLeft + this.mousePos.x) + "px";	  
    tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height);    
    var textWidth = tipCtx.measureText(this.tooltip).width;
      
    var x = tipCanvas.width/2 - textWidth/2; 
    // gap between mouse cursor and tooltip
    var hgap = 40;
    var lines = this.tooltip.split("<br>");
    if (lines.length == 1) {   
    	// a single line of text (do not need to modify tipCanvas height)
        tipCanvas.width = textWidth + 20;
        x = tipCanvas.width/2 - textWidth/2;         
        tipCtx.fillText(this.tooltip, x, 15);
    } else {
    	// more lines inside tooltip we should compute canvas width and height
    	var rowsH = (lines.length-1)*12;
    	tipCanvas.height = 25 + rowsH;
    	hgap += rowsH;
    	var lineMaxWidth = 0;
    	for(var i=0; i < lines.length; i++) {    		
    		var lineWidth = tipCtx.measureText(lines[i]).width;
    		if (lineWidth > lineMaxWidth) {
    			lineMaxWidth = lineWidth;
    		}
    	}    		
    	if (tipCanvas.width <= lineMaxWidth) {
            tipCanvas.width = lineMaxWidth + 20;
        }    
    	x = tipCanvas.width/2 - lineMaxWidth/2;    
    	for(var i=0; i < lines.length; i++) {
    		tipCtx.fillText(lines[i], x, 15 + i*12);    		
    	}
    }
    // if tipCanvas surpasses canvas space then make it not to 
    var endTipCanvas = tipCanvas.offsetLeft + tipCanvas.width;
    var endCanvas = canvas.offsetLeft + canvas.width;    
    if (endTipCanvas > endCanvas) {
    	tipCanvas.style.left = tipCanvas.offsetLeft - (endTipCanvas-endCanvas) + "px";
    }
    
    tipCanvas.style.top = (canvas.offsetTop + this.mousePos.y - hgap) + "px";
    if (this.tooltip == "") {
       tipCanvas.style.left = "-2000px";
    }
	
  }
};

function drawEllipseByCenter(ctx, cx, cy, w, h) {
	drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

function drawUpperEllipseByCenter(ctx, cx, cy, w, h) {
	drawUpperEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

function drawEllipse(ctx, x, y, w, h) {
	var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle
	
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
}

function drawUpperEllipse(ctx, x, y, w, h) {
	var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
}

function findControlPoint(s1, s2, s3) {
    var // Unit vector, length of line s1,s3
        ux1 = s3.x - s1.x,
        uy1 = s3.y - s1.y,
        ul1 = Math.sqrt(ux1*ux1 + uy1*uy1),
        u1 = { x: ux1/ul1, y: uy1/ul1 },
 
        // Unit vector, length of line s1,s2
        ux2 = s2.x - s1.x,
        uy2 = s2.y - s1.y,
        ul2 = Math.sqrt(ux2*ux2 + uy2*uy2),
        u2 = { x: ux2/ul2, y: uy2/ul2 },
 
        // Dot product
        k = u1.x*u2.x + u1.y*u2.y,
 
        // Project s2 onto s1,s3
        il1 = { x: s1.x+u1.x*k*ul2, y: s1.y+u1.y*k*ul2 },
 
        // Unit vector, length of s2,il1
        dx1 = s2.x - il1.x,
        dy1 = s2.y - il1.y,
        dl1 = Math.sqrt(dx1*dx1 + dy1*dy1),
        d1 = { x: dx1/dl1, y: dy1/dl1 },
 
        // Midpoint
        mp = { x: (s1.x+s3.x)/2, y: (s1.y+s3.y)/2 },
 
        // Control point on s2,il1
        cpm = { x: s2.x+d1.x*dl1, y: s2.y+d1.y*dl1 },
 
        // Translate based on distance from midpoint
        tx = il1.x - mp.x,
        ty = il1.y - mp.y,
        cp = { x: cpm.x+tx, y: cpm.y+ty };
 
    return cp;
}

// draw a curve through three points
function drawCurve(ctx, p1, p2, p3) {   
   var cp = findControlPoint(p1, p2, p3);    
   ctx.moveTo(p1.x, p1.y);
   ctx.quadraticCurveTo(cp.x,cp.y,p3.x,p3.y);   
}

function formatNumber(num, decimals, decimalSeparator, thousandSeparator) {
	 var nStr = num.toFixed(decimals);
	 nStr = nStr.replace('.', decimalSeparator);
	 return addThousandSeparator(nStr, decimalSeparator, thousandSeparator);
}

function addThousandSeparator(nStr, decimalSeparator, thousandSeparator) {
	nStr += '';
	x = nStr.split(decimalSeparator);
	x1 = x[0];
	x2 = x.length > 1 ? decimalSeparator + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + thousandSeparator + '$2');
	}
	return x1 + x2;
}

function getParameterValueFromURL(url, name ){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
	var regexS = "[\\?&]"+name+"=([^&#]*)";  
	var regex = new RegExp( regexS );  
	var results = regex.exec( url ); 
	if( results == null ) return "";  
	else return results[1];
}

function isPercent(value) {
	if (value === undefined) {
		return false;
	}
	var index = value.indexOf("%");
	if (index == value.length-1) {
		return true;
	}
	return false;
}

function find(array, v) {
	for (i=0;i<array.length;i++){
		if (array[i]==v) return i;
	}
	return false;
}




/*
 * Json must contain as mandatory only "data" attribute 
 * 
 * type -> bar, stackedbar, hbar, hstackedbar
 *     For bar and stackedbar we can have combo line series specified by lineData, lineColor and lineLegend
 * style -> normal, glass, cylinder, dome, parallelepiped
 * labelOrientation -> horizontal, vertical, diagonal, halfdiagonal
 * message -> can have two markups #val for value and #total for total value (stackedbar)
 *         -> can contain <br> to split text on more lines
 * title.alignment -> center, left, right
 * onClick -> is a javascript function like 'function doClick(value){ ...}'  *            
 * 
 * 
 * { "type": "bar",
 *   "style": "glass",
 *   "background" : "white",
 * 	 "data": [[ 16, 66, 24, 30, 80, 52 ], [ 48, 50, 29, 60, 70, 58 ], [ 30, 40, 28, 52, 74, 50 ]], 
 *   "lineData": [[31.33, 52, 27, 47.33, 74.66, 53.33]],
 *   "labels": ["JAN","FEB","MAR","APR","MAY", "JUN"],
 *   "labelOrientation": "horizontal",  
 *   "color": ["#004CB3","#A04CB3", "#7aa37a"], 
 *   "lineColor": [red],
 *   "legend": ["2011 First year of work" , "2012 Second year of work", "2013 Third year of work"],
 *   "lineLegend": [Average],
 *   "alpha" : 0.8, 
 *   "colorXaxis": "blue",
 *   "colorYaxis": "blue",
 *   "showGridX": true, 
 *   "showGridY": false, 
 *   "colorGridX": "rgb(248, 248, 216)", 
 *   "colorGridY": "rgb(248, 248, 216)", 
 *   "message" : "Value \: #val", 
 *   "showTicks" : true,
 *   "tickCount" : 5, 
 *   "title" : {
 *   	"text": "Analiza financiara", 
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "#000000",
 *      "alignment":"left"
 *   }, 
 *   "xData" : {
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "yData" : {
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "xLegend" : {
 *      "text": "Month", 
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "yLegend" : {
 *      "text": "Sales",
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "tooltipPattern" : {
 *   	"decimals": 2,
 *   	"decimalSeparator" : ".",
 *      "thousandSeparator" : ","
 *   },
 *   "onClick" : "function doClick(value){ console.log("Call from function: " + value); }"
 * }
 * 
 */

var barChart = function(myjson, idCan, idTipCan, canWidth, canHeight) {

var obj;
var data;
var labels; 
var labelOrientation;
var globalAlpha;
var showGridX;
var showGridY;
var background;
var message;
var tickCount;
var showTicks;
var chartType;
var chartStyle;
var seriesColor;
var xData, yData;
var series;
var yStep;
var maxK = new Array(); 
var minK = new Array();
var maxSum = new Array();
var dotsK = new Array();
var max;
var min;
//space between 2 ticks
var tickStep;

var minValY;
var maxValY;
// bottom vertical space (to fit X labels and X legend)
var step = 0;
var gap = 40;
// left horizontal space (to fit bigger Y labels and Y legend)
var hStep = 60;
var titleSpace = 0;
var legendSpace = 0;
var xLegendSpace = 0;
var yLegendSpace = 0;
var xaxisY = 0;
var cornerRadius = 6;
var realWidth;
var realHeight;
var canvas;  
var c; 
var tipCanvas;
var H = cornerRadius;
// space between X axis and first tick
var tickInit;
var resizeWidth = false;
var resizeHeight = false;

function drawBar(myjson, idCan, idTipCan, canWidth, canHeight) {	
					
	canvas = document.getElementById(idCan);
	tipCanvas = document.getElementById(idTipCan);
	c = canvas.getContext('2d');
	
	obj = myjson;
	chartType = obj.type;
	if (typeof chartType === "undefined") {
	    chartType = "bar";
	}		
					
	background = obj.background;
	if (typeof background === "undefined") {	
		background = "white";
	}
		
	chartStyle = obj.style;
	// test for passing a wrong style
	if ((typeof chartStyle === "undefined")  || (find(['normal', 'glass', 'cylinder', 'dome', 'parallelepiped'],chartStyle) === false)) {	
		chartStyle = "normal";
	}	
	
	data = obj.data[0];
	series = obj.data.length;
	
	labels = obj.labels; 
	if (typeof labels === "undefined") {
		labels = [];
		for (var i=0; i<data.length; i++) {
			labels.push("");
		}
	}
	
	labelOrientation = obj.labelOrientation;
	if (typeof labelOrientation === "undefined") {
    	labelOrientation = "horizontal";
    }
	
	globalAlpha = obj.alpha;
	if (typeof globalAlpha === "undefined") {
        globalAlpha = 0.8;
    }
	
	showTicks = obj.showTicks;
	if (typeof showTicks === "undefined") {
		showTicks = true;
	}	
	
	showGridX = obj.showGridX;
	if (typeof showGridX === "undefined") {
        showGridX = true;
    }
        
	showGridY = obj.showGridY;
	if (typeof showGridY === "undefined") {
        showGridY = true;
    }
	
	message = obj.message;
	if (typeof message === "undefined") {
		if (isStacked(chartType)) {
			message = "#val / #total";
		} else {
			message = "#val";
		}
	}
	
	tickCount = obj.tickCount;
	if (typeof tickCount === "undefined") {
        tickCount = 5;        
    }    
			
	seriesColor = obj.color;
	if (typeof seriesColor === "undefined") {
		seriesColor = distinctHexColors(series);
    }    
	
	// compute min ,max values
	// take care if we also have combo lines
	for (var k=0; k<series; k++) {
		maxK[k] = Math.max.apply( Math, obj.data[k] );
		minK[k] = Math.min.apply( Math, obj.data[k] ); 
	}    		
	if (isStacked(chartType)) {
        for (var i=0; i<data.length; i++) {
            var sum = 0;
            for (var k=0; k<series; k++) {
                sum += obj.data[k][i];
            }    
            maxSum[i] = sum;
        }    
        max = Math.max.apply( Math, maxSum);        
    }  else {
        max = Math.max.apply( Math, maxK);	    
    }  
    min = Math.min.apply( Math, minK);
    if (obj.lineData !== undefined) {
    	var lineMaxK = new Array(); 
    	var lineMinK = new Array();
    	for (var k=0; k<obj.lineData.length; k++) {
    		lineMaxK[k] = Math.max.apply( Math, obj.lineData[k] );
    		lineMinK[k] = Math.min.apply( Math, obj.lineData[k] ); 
    	}      	
    	var lineMin = Math.min.apply( Math, lineMinK);
    	var lineMax = Math.max.apply( Math, lineMaxK);
    	if (lineMin < min) {
    		min = lineMin;
    	}
    	if (lineMax > max) {
    		max = lineMax;
    	}
	}
    
    var objStep = calculateYStep(min, max, tickCount);
    yStep = objStep.yStep;
    minValY = objStep.minValY;
    maxValY = objStep.maxValY;
    
    // compute hStep (for vertical labels and yLegend to fit) 
    hStep = computeHStep();	    
    updateSize(canWidth, canHeight);        	        
    
    canvas.addEventListener('mousemove', 
			function(evt) { 
				var hme = Object.create(handleMouseEvent);
				hme.mousePos = getMousePos(canvas, evt);
				hme.tooltip = getTooltip(hme.mousePos);		
				hme.execute(canvas, tipCanvas, evt); 
			}, 
			false); 
    
    canvas.addEventListener ("mouseout", 
    		function(evt) {
    			tipCanvas.style.left = "-2000px";
    		}, 
    		false);
    
    canvas.addEventListener('click', onClick, false);
        
    if (resizeWidth || resizeHeight) {
    	window.addEventListener('resize', resizeCanvas, false);    	
    }        	   

	drawChart();
}

function updateSize(canWidth, canHeight) {			 
	if (canWidth !== undefined) {
		if (isPercent(canWidth)) {
			var percent = canWidth.substring(0, canWidth.length-1);			
			//canvas.width = window.innerWidth*percent/100;
			var cl = canvas.parentNode;					
			canvas.width = cl.offsetWidth*percent/100;						
			resizeWidth = true;
		} else {
			canvas.width = canWidth;
		}
	}	 
	if (canHeight !== undefined) {
		if (isPercent(canHeight)) {
			var percent = canHeight.substring(0, canHeight.length-1);
			canvas.height = window.innerHeight*percent/100;
			//var cl = canvas.parentNode;	
			//canvas.height = cl.offsetHeight*percent/100;
			resizeHeight = true;
		} else {
			canvas.height = canHeight;
		}
	}			
	
	if (isH(chartType)) {    			
    	if (typeof obj.legend !== "undefined") {   
    		computeVStep();    		
    	}	
    	realHeight = canvas.width;
    	realWidth = canvas.height - hStep/2;
    	if (typeof obj.title !== "undefined") {	
    		realWidth = realWidth - getTitleSpace();
    	}
    	if (typeof obj.legend !== "undefined") {  
    		realWidth = realWidth - getLegendSpace();
    	}    	
						
		xLegendSpace = getXLegendSpace();		
				
		c.translate(canvas.width, canvas.height);
		// flip context horizontally (mirror transformation)
		c.scale(-1,1);
		c.rotate(-90*Math.PI/180);		
		
	} else {
		realWidth = canvas.width;
		realHeight = canvas.height;
	}
		
	// adjust the  x gap between elements (should be smaller for smaller widths)
	gap = realWidth/10 - 10;
						
	tickInit = realHeight/12;	
    
	// space between 2 ticks
	tickStep = (realHeight-step-tickInit)/tickCount;
}


function animDraw() {      
    if (drawIt(H)) {          		    
        return false;
    }    
    H += 1+(realHeight-step-titleSpace-legendSpace)/30;    
    window.requestAnimFrame(animDraw);      
}    


// function called repetitive by animation
function drawIt(H) {    		
	
	// for cylinder we need to redraw the entire canvas (it extends under drawn x axis)
	drawInit();
			
	// if we clear only the rectangle containing the chart (without title , legends, labels)
	// clear the drawn area (if drawInit is called in drawChart)
	//	c.fillStyle = background; 
	//	c.fillRect(hStep-10,titleSpace+legendSpace,width, realHeight-step-titleSpace-legendSpace-2);
	
	var stop = drawData(true, false, "");
	
	drawGrid();
	drawAxis();
	 				
	return stop;
}

// withFill = false means to construct just the path needed for tooltip purposes
function drawData(withFill, withClick, mousePos) {
	var font = c.font;
	    
	//draw data 
	c.lineWidth = 1.0;
	var stop = true;
	var acc = new Array();
	for(var i=0; i<data.length; i++) { 
		acc[i] = realHeight-step;
	}	
			    
	var barTooltip = "";
	var barValue;
	var abort = false;
	for(var k=0; k<series && !abort; k++) {  
	  for(var i=0; i<data.length && !abort; i++) { 		  
	    var dp = obj.data[k][i];
	    if (isStacked(chartType)) {	    
	    	if (k > 0) {
	    		for (var m=0; m<k; m++) {
	    			dp += obj.data[m][i];
	    		}
	    	}
	    }
	    var rectX = hStep + i*(realWidth-hStep)/data.length;       
	    var Yheight = realHeight-step-(dp-minValY)*tickStep/yStep;    
	    var rectY = realHeight-step-H;     	    	    
	    if (rectY <= Yheight) {
	        rectY = Yheight;
	    } else {
	        stop = false;
	    }        
	    if (rectY+2 > xaxisY) {
	        rectY = xaxisY-1;
	        cornerRadius = 1;
	    } else {
	        cornerRadius = 6;
	    }	    
	    	   
	    var rectWidth;
	    if (isStacked(chartType)) {	    		    	 	    
	        rectWidth =  (realWidth - hStep - gap*(1+Math.sqrt(series)))/data.length; 	        
	    } else {     
	        rectWidth =  (realWidth - hStep - gap*(1+Math.sqrt(series)))/data.length/series;
	        rectX = rectX + k*rectWidth; 
	    }  	    
	    
	    var lColor = colorLuminance(seriesColor[k],1.3);
	    var grad = c.createLinearGradient(rectX, realWidth-hStep , rectX + rectWidth , realWidth-hStep);       
	    grad.addColorStop(0,lColor); // light color  
	    grad.addColorStop(1,seriesColor[k]);    
	    
	    var inverseGrad = c.createLinearGradient(rectX, realWidth-hStep , rectX + rectWidth , realWidth-hStep); 		      
	    inverseGrad.addColorStop(0,seriesColor[k]);
	    inverseGrad.addColorStop(1,lColor); // light color
	    	  	    	    	    
	    if (chartStyle == "glass") {	    	 		    
	    	acc[i] = drawGlass(k, i, rectX, rectY, rectWidth, grad, acc[i], withFill);
	    } else if (chartStyle == "cylinder") {	    
	    	acc[i] = drawCylinder(k, i, rectX, rectY, rectWidth, grad, inverseGrad, acc[i], withFill);
	    } else if (chartStyle == "dome") {			    	
	    	acc[i] = drawDome(k, i, rectX, rectY, rectWidth, inverseGrad, stop, acc[i], withFill);
	    } else if (chartStyle == "parallelepiped") {			    	
	    	acc[i] = drawParallelipiped(k, i, rectX, rectY, rectWidth, grad, inverseGrad, stop, acc[i], withFill);
	    } else {	    	
	    	// normal style
	    	acc[i] = drawRectangle(k, i, rectX, rectY, rectWidth, acc[i], withFill);
	    }   	    	    
	    
	    if (!withFill) {
	    	if (c.isPointInPath(mousePos.x, mousePos.y)) {  	    		
	    		var tValue = obj.data[k][i];
	    		if (obj.tooltipPattern !== undefined) {
	    			tValue = formatNumber(tValue, obj.tooltipPattern.decimals, obj.tooltipPattern.decimalSeparator, obj.tooltipPattern.thousandSeparator);
	    		}	    			    		
	    		var returnValue = labels[i]; // returnValue = tValue;
	    		if (withClick) {
	    			barValue = tValue;
	    			// if there is a combo line we test first to see if point for line was clicked
	    			// that's why we do not return the bar clicked value
	    			if (obj.lineData !== undefined) {
			        	abort = true;
			        } else {
			        	return returnValue;
			        }
	    		} else {
			    	var mes = String(message).replace('#val', tValue);
				    var mes = mes.replace('#total', maxSum[i]);
				    if (obj.onClick !== undefined) {
				    	canvas.style.cursor = 'pointer';
				    }
			        barTooltip = mes;
   			        // if there is a combo line we test first to see if point for line was clicked
	    			// that's why we do not return the bar tooltip
			        if (obj.lineData !== undefined) {
			        	abort = true;
			        } else {
			        	return mes;
			        }
	    		}
		    } else {
		    	canvas.style.cursor = 'default';
		    }    					   
	    }
	  } 
	}   
	
	// combo line chart
	if (obj.lineData !== undefined) {
		for(var k=0; k<obj.lineData.length; k++) {  
			  dotsK[k] = [];	
			  for(var i=0; i<obj.lineData[0].length; i++) { 		  
			    var dp = obj.lineData[k][i];	
			    var width =  (realWidth - hStep - gap*(1+Math.sqrt(obj.lineData.length)))/obj.lineData[0].length;
			    var dotX = hStep + i*(realWidth-hStep)/obj.lineData[0].length + width/2;       
			    var Yheight = realHeight-step-(dp-minValY)*tickStep/yStep;   			        			        
			    var dotY = realHeight-step-H;
			    var dotX2 = dotX;
			    var dotY2 = dotY;
			    var Yheight2 = Yheight;
			    if (i < obj.lineData[0].length-1) {
			    	dotX2 = hStep + (i+1)*(realWidth-hStep)/obj.lineData[0].length + width/2;
			    	dotY2 = realHeight-step-H;
			    	Yheight2 = realHeight-step-(obj.lineData[k][i+1]-minValY)*tickStep/yStep;
			    }
			    	    	    
			    if (dotY <= Yheight) {
			        dotY = Yheight;
			    } else {
			        stop = false;
			    }  
			    if (dotY+2 > xaxisY) {
			        dotY = xaxisY-1;	        
			    } 	
			    if (i < obj.lineData[0].length-1) {
				    if (dotY2 <= Yheight2) {
				        dotY2 = Yheight2;
				    } else {
				        stop = false;
				    }  
				    if (dotY2+2 > xaxisY) {
				        dotY2 = xaxisY-1;	        
				    } 	    
			    }
			    	   	    
			    dotsK[k].push({x:dotX, y:dotY});
			    
			    var lineSeriesColor = obj.lineColor;
				if (obj.lineColor === undefined) {
					lineSeriesColor = distinctHexColors(obj.lineData[0].length);
			    }   
			    
			    var savedStroke = c.strokeStyle;			    
			    drawLineElements(c, "normal", "line", 2, lineSeriesColor, dotsK, obj.lineData[0].length, xaxisY, globalAlpha, k, i, dotX, dotY, dotX2, dotY2, withFill);			    
			    c.strokeStyle = savedStroke;
			    
			    if (!withFill) {
			    	if (c.isPointInPath(mousePos.x, mousePos.y)) {  
			    		var tValue = obj.lineData[k][i];			    		
			    		if (obj.tooltipPattern !== undefined) {
			    			tValue = formatNumber(tValue, obj.tooltipPattern.decimals, obj.tooltipPattern.decimalSeparator, obj.tooltipPattern.thousandSeparator);
			    		}	 
			    		var returnValue = labels[k]; // returnValue = tValue;
			    		if (withClick) {
			    			return returnValue;
			    		} else {
			    			var lineMessage = "#val";
					    	var mes = String(lineMessage).replace('#val', tValue);
					    	if (obj.onClick !== undefined) {
					    		canvas.style.cursor = 'pointer';
					    	}
					        return mes;
			    		}
				    } else {	
				    	if (abort == true) {
				    		if (obj.onClick !== undefined) {
				    			canvas.style.cursor = 'pointer';
				    		}
				    	} else {
				    		canvas.style.cursor = 'default';
				    	}
				    }    					   
			    }
			  }
		}	  
    }
		
	if (withFill) {
		return stop;
	} else {		
		if (withClick) {
    		if (barValue !== undefined) {
    			return barValue;
    		}
    	}
		// empty tooltip message if click outside bot line and bar
		return barTooltip;
	}
}

function drawRectangle(k, i, rectX, rectY, rectWidth, acci, withFill) {	
	c.beginPath();	
	c.moveTo(rectX, rectY);
	c.lineTo(rectX+rectWidth, rectY);
	c.lineTo(rectX+rectWidth, acci);
	c.lineTo(rectX,acci);
	c.lineTo(rectX, rectY);        	    	
	if (isStacked(chartType)) {		    				    	 
	    acci = rectY;	    	
	}
	if (withFill) {
		c.fillStyle = seriesColor[k];
		c.globalAlpha = globalAlpha;
		c.fill();  
		c.globalAlpha = 1;
	}
	return acci;
}

function drawCylinder(k, i, rectX, rectY, rectWidth, grad, inverseGrad, acci, withFill) {	
	if (withFill) { 
	    c.beginPath();	 
	    // must compute for arc : starting x, y and radius
	    var radius = rectWidth/2/Math.sin(Math.PI/8);
	    // arc drawn from right to left
	    c.arc(rectX+rectWidth/2, rectY-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
	    if (isStacked(chartType)) {	
	    	c.lineTo(rectX , acci) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);		    		 
	    	acci = rectY;	    	
	    } else {
	    	c.lineTo(rectX , realHeight-step) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);	
	    }		    
	    c.lineTo(rectX+rectWidth , rectY) ;	
	    c.stroke();
	    c.closePath();
	    
	    if (withFill) {    	
	    	c.fillStyle = inverseGrad;
		    // apply alpha only for fill (not to the border stroke)!
		    c.globalAlpha = globalAlpha;
		    c.fill();  
		    c.globalAlpha = 1;
	    }
	    
	    // cylinder upper part with inverted gradient
	    // we stroke only the upper part of circle	    
	    c.beginPath();	
	    if (isStacked(chartType)) {	
	    	c.arc(rectX+rectWidth/2, acci+radius*Math.cos(Math.PI/8), radius, 11*Math.PI/8 , 13*Math.PI/8);
	    	c.stroke();
	    	c.arc(rectX+rectWidth/2, rectY-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
	    } else {
	    	c.arc(rectX+rectWidth/2, rectY+radius*Math.cos(Math.PI/8), radius, 11*Math.PI/8 , 13*Math.PI/8);
	    	c.stroke();
	    	c.arc(rectX+rectWidth/2,rectY-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
	    }
	    c.closePath();		    		   
	   		    		    
	      
	    c.fillStyle = grad;
		// apply alpha only for fill (not to the border stroke)!
		c.globalAlpha = globalAlpha;
		c.fill();  
		c.globalAlpha = 1;
    } else {    	
    	// draw only the outside border
    	c.beginPath();	 			    
	    var radius = rectWidth/2/Math.sin(Math.PI/8);
	    // change from drawCylinder withFill
	    if ((series == 1) || (k == series-1)) {
	    	c.arc(rectX+rectWidth/2, rectY+radius*Math.cos(Math.PI/8), radius, 13*Math.PI/8 , 11*Math.PI/8, true);		    	
	    } else {
	    	c.arc(rectX+rectWidth/2, rectY-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
	    }
	    // same
	    if (isStacked(chartType)) {	
	    	c.lineTo(rectX , acci) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);		    		 
	    	acci = rectY;	    	
	    } else {
	    	c.lineTo(rectX , realHeight-step) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);	
	    }		    
	    c.lineTo(rectX+rectWidth , rectY) ;	
    }
    return acci;
}

function drawGlass(k, i, rectX, rectY, rectWidth, grad, acci, withFill) {
	if (withFill) {
		c.fillStyle = grad;
	}
	// instead of a rectangle draw a path with rounded corners
    c.beginPath();	    
    if (rectWidth <= 2*cornerRadius*series) {
        cornerRadius = 2;
    }    
    c.moveTo(rectX+cornerRadius, rectY);
    c.lineTo(rectX + rectWidth - cornerRadius , rectY);
    if (!isStacked(chartType) || (k == series-1) ) {	
    	c.arcTo(rectX + rectWidth, rectY, rectX + rectWidth , rectY + cornerRadius, cornerRadius);
    } else {
    	c.lineTo(rectX + rectWidth , rectY);
    }
    if (isStacked(chartType)) {		    	
    	c.lineTo(rectX + rectWidth, acci) ;
    	c.lineTo(rectX , acci) ;	 
    	acci = rectY;	    	
    } else {
    	c.lineTo(rectX + rectWidth, realHeight-step) ;
    	c.lineTo(rectX , realHeight-step) ;
    }
    if (!isStacked(chartType) || (k == series-1) ) {	
    	c.lineTo(rectX , rectY+cornerRadius) ;
    	c.arcTo(rectX, rectY, rectX + rectWidth - cornerRadius , rectY , cornerRadius);
    } else {
    	c.lineTo(rectX , rectY) ;
    }
    if (withFill) {
	    c.closePath();		    		   
	    c.stroke();
	    		    
	    // apply alpha only for fill (not to the border stroke)!
	    c.globalAlpha = globalAlpha;
	    c.fill();  
	    c.globalAlpha = 1;
    }
    
    return acci;
}

function drawDome(k, i, rectX, rectY, rectWidth, inverseGrad, stop, acci, withFill) {
	if (withFill) {
		c.fillStyle = inverseGrad;
		
	    c.beginPath();	 
	    // must compute for arc : starting x, y and radius
	    var topRadius = rectWidth/2;
	    var radius = rectWidth/2/Math.sin(Math.PI/8);
	    var value = (obj.data[k][i]-minValY)*tickStep/yStep;
	    var  maxValue = (maxSum[i]-minValY)*tickStep/yStep;
	    var isEllipse = false;            
	    if ((series == 1) || (k == series-1) || (chartType=="bar")) {	
	    	var drawDome = !isStacked(chartType) || (isStacked(chartType) && stop );
	    	if (drawDome) {
		    	if (topRadius <= value) {
				    // arc drawn from right to left	    		
		    		c.arc(rectX+rectWidth/2, rectY+topRadius,  topRadius, 2*Math.PI , Math.PI, true);	    		
		    	} else {
		    		drawUpperEllipse(c, rectX, rectY, rectWidth, 2*value);
		    		isEllipse=true;
		    	}
	    	}
	    } else {		    	
	    	c.arc(rectX+rectWidth/2, rectY+radius*Math.cos(Math.PI/8), radius, 13*Math.PI/8 , 11*Math.PI/8, true);	
	    }		    
	    		    
	    if (isStacked(chartType)) {			    	
	    	if (isEllipse == true) {
		    	// arc drawn from right to left (because ellipse is drawn from left to right)
	    		c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
	    	} else {
		    	// arc drawn from left to right
	    		c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);
	    	}
	    	acci = rectY;	    	
	    } else {
	    	c.lineTo(rectX , realHeight-step) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);	
	    }		    
	    if ((series == 1) || (k == series-1) || (chartType=="bar")) {
	    	var drawDome = !isStacked(chartType) || (isStacked(chartType) && stop );
	    	if (drawDome) {
		    	if (topRadius <= value) {				    		
		    		c.lineTo(rectX+rectWidth , rectY+topRadius) ;		    		
		    	} else {
		    		c.lineTo(rectX , rectY+value) ;		
		    	}
	    	}
	    } else {
	    	c.lineTo(rectX+rectWidth , rectY) ;
	    }        		   		    		    
	    
    	c.stroke();
        c.closePath();
    	
	    // apply alpha only for fill (not to the border stroke)!
	    c.globalAlpha = globalAlpha;
	    c.fill();  
	    c.globalAlpha = 1;
	} else {		
	    c.beginPath();	 
	    // must compute for arc : starting x, y and radius
	    var topRadius = rectWidth/2;
	    var radius = rectWidth/2/Math.sin(Math.PI/8);
	    var value = (obj.data[k][i]-minValY)*tickStep/yStep;
	    var isEllipse = false;            	    
	    if ((series == 1) || (k == series-1) || (chartType=="bar")) {	
	    	var drawDome = !isStacked(chartType) || (isStacked(chartType) && stop );
	    	if (drawDome) {
		    	if (topRadius < value) {
				    // arc drawn from right to left	    		
		    		c.arc(rectX+rectWidth/2, rectY+topRadius,  topRadius, 2*Math.PI , Math.PI, true);	    		
		    	} else {
		    		drawUpperEllipse(c, rectX, rectY, rectWidth, 2*value);
		    		isEllipse=true;
		    	}
	    	}
	    } else {		    	
	    	c.arc(rectX+rectWidth/2, rectY-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);	
	    }		    
	    		   	    
	    if (isStacked(chartType)) {
	    	if ((series == 1) || (k == series-1)) {
		    	if (isEllipse == true) {
			    	// arc drawn from right to left (because ellipse is drawn from left to right)
		    		c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 , 5*Math.PI/8);
		    	} else {
			    	// arc drawn from left to right
		    		c.arc(rectX+rectWidth/2, acci-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);
		    	}
		    	acci = rectY;	    	
	    	} else {
	    		if (isEllipse == true) {
	    			c.lineTo(rectX , acci) ;
	    			// arc drawn from right to left
			    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 13*Math.PI/8 , 11*Math.PI/8, true);	
	    		} else {
	    			c.lineTo(rectX+rectWidth , acci) ;
	    			// arc drawn from left to right
			    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 3*Math.PI/8 ,5*Math.PI/8);	
	    		}
		    	
		    }	
	    } else {
	    	c.lineTo(rectX , realHeight-step) ;
	    	// arc drawn from left to right
	    	c.arc(rectX+rectWidth/2, realHeight-step-radius*Math.cos(Math.PI/8), radius, 5*Math.PI/8 , 3*Math.PI/8, true);	
	    }		    
	    if ((series == 1) || (k == series-1) || (chartType=="bar")) {
	    	var drawDome = !isStacked(chartType) || (isStacked(chartType) && stop );
	    	if (drawDome) {
		    	if (topRadius <= value) {			    	
	    			c.lineTo(rectX+rectWidth , rectY+topRadius) ;
		    	} // else there is no line to draw
	    	}
	    } else {
	    		c.lineTo(rectX , rectY) ;
	    }      	   
	}
    
    return acci;
}

function drawParallelipiped(k, i, rectX, rectY, rectWidth, grad, inverseGrad, stop, acci, withFill) {
	var p = gap/4;	 
	var value = (obj.data[k][i]-minValY)*tickStep/yStep;
	if (withFill) {
		c.fillStyle = grad;
		
		// background lines (will be seen if a globalAlpha < 1 is set
		c.lineWidth = 0.2;
		c.moveTo(rectX+p, rectY);
		c.lineTo(rectX+p, acci);				
		if (k == 0) {
			c.lineTo(rectX, acci+p);	
			c.moveTo(rectX+p, acci);
			c.lineTo(rectX+rectWidth+p, acci);
		}
		c.stroke();
		
		c.lineWidth = 0.5;	
		// draw front
		c.beginPath();	
		c.moveTo(rectX, rectY+p);
		c.lineTo(rectX+rectWidth, rectY+p);
		c.lineTo(rectX+rectWidth, acci+p);
		c.lineTo(rectX,acci+p);
		c.lineTo(rectX, rectY+p);        	    	
		
		c.closePath();
		c.stroke();   		
		c.globalAlpha = globalAlpha;
		c.fill();  
		c.globalAlpha = 1;		
	    
	    // draw top		
		c.fillStyle = inverseGrad;		
	    c.beginPath();	
		c.moveTo(rectX, rectY+p);
		c.lineTo(rectX+p, rectY);
		c.lineTo(rectX+rectWidth+p,rectY);
		c.lineTo(rectX+rectWidth, rectY+p);
		c.lineTo(rectX, rectY+p);
		c.closePath();
		c.stroke();    			
		c.globalAlpha = globalAlpha;
		c.fill();  
		c.globalAlpha = 1;		
		
		// draw aside
		c.fillStyle = inverseGrad;		
	    c.beginPath();	
		c.moveTo(rectX+rectWidth+p,rectY);
		if (isStacked(chartType)) {	
			var m = H;
			if (m > value) {
				m = value;
			}
			c.lineTo(rectX+rectWidth+p, rectY+m);
			c.lineTo(rectX+rectWidth,  rectY+p+m);
		} else {
			c.lineTo(rectX+rectWidth+p, acci);
			c.lineTo(rectX+rectWidth, acci+p);
		}
		
		c.lineTo(rectX+rectWidth, rectY+p);
		c.lineTo(rectX+rectWidth+p,rectY);	
		c.closePath();
		c.stroke();    			
		c.globalAlpha = globalAlpha;
		c.fill();  
		c.globalAlpha = 1;				
		
		if (isStacked(chartType)) {		    				    	 
		    acci = rectY;	    	
		}
		
	} else {		
		c.beginPath();	
		c.moveTo(rectX, rectY+p);
		if ((series == 1) || (k == series-1) || (chartType=="bar")) {		
			c.lineTo(rectX+p, rectY-p);
			if ((chartType=="bar") && (series > 1) && (k < series-1)) {
				var nextValue = (obj.data[k+1][i]-minValY)*tickStep/yStep;
				if (value<=nextValue) {
					c.lineTo(rectX+rectWidth,rectY-p);
				} else {
					c.lineTo(rectX+rectWidth+p,rectY-p);
				}
			}  else {
				c.lineTo(rectX+rectWidth+p,rectY-p);
			}
		} else {
			c.lineTo(rectX+rectWidth, rectY);
			c.lineTo(rectX+rectWidth+p, rectY-p);
		}
		
		if ((chartType=="bar") && (series > 1) && (k < series-1)) {		
			var nextValue = (obj.data[k+1][i]-minValY)*tickStep/yStep;
			if (value <= nextValue) {
				c.lineTo(rectX+rectWidth, acci+p);
			} else {
				c.lineTo(rectX+rectWidth+p, acci-nextValue-p);
				c.lineTo(rectX+rectWidth, acci-nextValue);
				c.lineTo(rectX+rectWidth, acci+p);
			}
		} else {
			c.lineTo(rectX+rectWidth+p, acci);
			c.lineTo(rectX+rectWidth, acci+p);
		}
		
		c.lineTo(rectX,acci+p);		
		c.lineTo(rectX, rectY+p);    
		if (isStacked(chartType)) {		    				    	 
		    acci = rectY;	    	
		}
	}
	return acci;
	
}


function drawInit() {
	
	var font = c.font;
	
	//draw background (clear canvas)
	c.fillStyle = background; 
	if (isH(chartType)) {
		// realWidth is modified for hbar (but we need to clear the entire surface)
		c.fillRect(0,0,realWidth+getTitleSpace()+step,realHeight);		
	} else {
		c.fillRect(0,0,realWidth,realHeight);
	}			
	
	// adjust step with X label space (x label can have different orientations) and X legend space
	var xLabelWidth = computeVStep();

	//draw title		
	if (typeof obj.title !== "undefined") {
		var titleColor = obj.title.color;
		if (titleColor === undefined) {
			titleColor = '#000000';
		}
		c.fillStyle = titleColor;
		var b = " ";
		var f = obj.title.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;   
		if (!isH(chartType)) {
			titleSpace = +20 + +f.size;
		} else {
			titleSpace = 10;
		}
		var alignment = obj.title.alignment;
		if (alignment === undefined) {
			alignment = "center";
		}
		var xTitle;
		if (alignment == "left") {
			xTitle = hStep;
		} else if (alignment == "right") {
			xTitle = canvas.width - c.measureText(obj.title.text).width - 10;
		} else {
			// center
			xTitle = canvas.width/2- c.measureText(obj.title.text).width/2;
		}
		
		if (isH(chartType)) {		
			c.save();
			c.translate(0, realHeight/2);
			c.scale(1, -1);
			var xoff = 0;			
			if (chartType == "hstackedbar") {
				xoff = 7;
			} else {				
				xoff = 11;
			}
			var leg = 0;
			if (typeof obj.legend !== "undefined") {  
				leg = getLegendSpace();
			}
			if (showTicks == false) {
				leg = leg + titleSpace + 20;
			}
			c.translate(realWidth+hStep+titleSpace+xoff-yLegendSpace+leg, -realHeight/2);			
			c.rotate(Math.PI/2);
		}		
		
		c.fillText(obj.title.text, xTitle , 20+titleSpace/2 );    
		c.font = font;   
		
		if (isH(chartType)) {		
			c.restore();						
		}
	} else {
		titleSpace = 10;
	}    
	
	
	//draw X legend	
	if (typeof obj.xLegend !== "undefined") {
						
		var xLegendColor = obj.xLegend.color;
		if (xLegendColor === undefined) {
			xLegendColor = '#000000';
		}
		c.fillStyle = xLegendColor;
		var b = " ";
		var f = obj.xLegend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;      
		xLegendSpace = +20 + +f.size;             
		
		if (isH(chartType)) {		
			c.save();
			c.translate(0, realHeight);
			c.scale(1,-1);
			var x = 0;
			if (typeof obj.legend !== "undefined") {   
				x = c.measureText(obj.xLegend.text).width/2;
			} else if (typeof obj.title !== "undefined") {
				x = titleSpace;
			}
			c.translate(x, -realHeight + f.size/2 + xLegendSpace);
		}			
		
		c.fillText(obj.xLegend.text, realWidth/2- c.measureText(obj.xLegend.text).width/2 , realHeight - f.size );    
		c.font = font;   
		
		if (isH(chartType)) {		
			c.restore();						
		}
	} else {
		xLegendSpace = 0;
	}    
	
	//draw Y legend	
	if (typeof obj.yLegend !== "undefined") {
		var yLegendColor = obj.yLegend.color;
		if (yLegendColor === undefined) {
			yLegendColor = '#000000';
		}
		var b = " ";
		var f = obj.yLegend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;      
		c.fillStyle = yLegendColor;		
		c.save();	    	
    	c.translate(10  , realHeight/2);
    	c.rotate(-Math.PI/2);
    	c.textAlign = "center";	    	 
    	if (isH(chartType)) {					
			c.translate(0, realHeight);
			c.scale(1, -1);	
			var ypos = realHeight -  f.size / 2 - xLegendSpace/2;
			if ((typeof obj.title === "undefined") && (xLegendSpace == 0)) {
				ypos = ypos - f.size;
			}
			c.translate(0, ypos);
		}		
    	c.fillText(obj.yLegend.text,0, f.size);
    	c.restore();		    
		c.font = font;            
	} else {
		yLegendSpace = 0;
	}    

	// draw legend	
	if (typeof obj.legend !== "undefined") {         
		var x = hStep;
		if (isH(chartType)) {	
			x = step;
		}
		c.font = "bold 10px sans-serif";
		legendSpace = 20; 
		var legendY = titleSpace+20;
		c.globalAlpha = globalAlpha;
		for (var k=0; k<series; k++) {        
			c.fillStyle = seriesColor[k];        
			var legendWidth = c.measureText(obj.legend[k]).width + 24;             
			
			if (isH(chartType)) {					
				if (x + legendWidth > realHeight) {
					// draw legend on next line if does not fit on current one
					x = step;
					legendY = legendY + 14;					
				}	
				c.save();
				c.translate(0, realHeight/2);
				c.scale(1, -1);		
				var xoff = 0;			
				if (chartType == "hstackedbar") {
					xoff = 28;
				} else {				
					xoff = 26;
				}
				c.translate(realWidth+hStep/2+xoff - yLegendSpace/2+legendSpace, -realHeight/2);
				c.rotate(Math.PI/2);
			} else {
				if (x + legendWidth > realWidth) {
					// draw legend on next line if does not fit on current one
					x = hStep;
					legendY = legendY + 14;
					if (!isH(chartType)) {
						legendSpace += 20;
					}
				}    
			}		
			c.fillText("---- " + obj.legend[k], x, legendY);
			     
			x = x + legendWidth;
			if (isH(chartType)) {				
				c.restore();						
			} 
		}  
		if (obj.lineLegend !== undefined) {
			var lineSeriesColor = obj.lineColor;
			if (obj.lineColor === undefined) {
				lineSeriesColor = distinctHexColors(obj.lineData[0].length);
		    }   			   
			for (var k=0; k<obj.lineData.length; k++) {   
				c.fillStyle = lineSeriesColor[k];     
				var legendWidth = c.measureText(obj.lineLegend[k]).width + 24;   
				if (x + legendWidth > realWidth) {
					// draw legend on next line if does not fit on current one
					x = hStep;
					legendY = legendY + 14;					
					legendSpace += 20;					
				}  
				c.fillText("---- " + obj.lineLegend[k], x, legendY);
				x = x + legendWidth;
			}				
		}
		c.globalAlpha = 1;
		c.font = font;
	}    	
	
	
	
	c.font = font;

    
	// adjust tickStep depending if title or legend are present or not
	tickStep = (realHeight-step-titleSpace-legendSpace-tickInit)/tickCount; 	

	// compute Y value for xAxis
	xaxisY = tickCount*tickStep+tickInit+titleSpace+legendSpace; 
	
	drawLabels(xLabelWidth);
}


function drawLabels(xLabelWidth) {
	
	var font = c.font;
			
	//draw Y labels and small lines 	
	if (showTicks) {
		c.fillStyle = "black"; 
		if (obj.yData !== undefined) {
			c.fillStyle = obj.yData.color; 
			var b = " ";
			var yfont = obj.yData.font;
			c.font = yfont.weight + b + yfont.size + "px" + b + yfont.family;  
		}
		for(var i=0; i<tickCount+1; i++) {        		
			var label;
			if (obj.tooltipPattern !== undefined) {
				// y labels can have more than two decimals
				var decimals = obj.tooltipPattern.decimals;
				var exp = Math.pow(10, decimals);
				label = Math.round((maxValY-i*yStep)*exp)/exp;
			} else {
				label = Math.round((maxValY-i*yStep)*100)/100;
			}
			var labelWidth = c.measureText(label).width;   
			
			if (isH(chartType)) {	   
				c.save();
				var size = 20;
				if (obj.yData !== undefined) {
					size = obj.yData.font.size;
				}
				c.scale(-1,1);			
				c.translate(-realHeight + step -5 - yLegendSpace + (tickCount-i)*tickStep, i*tickStep +  tickInit + hStep + 1 - 5*labelWidth/6 + step - xLabelWidth - xLegendSpace + legendSpace);	
				c.rotate(-Math.PI/2);							
			}
			
			c.fillText(label + "",hStep - 15 - labelWidth , i*tickStep+tickInit+titleSpace+legendSpace);
			if (isH(chartType)) {	   
				c.restore();
			}
			
			c.lineWidth = 2.0; 
			c.beginPath();     
		    c.moveTo(hStep-15,i*tickStep+tickInit+titleSpace+legendSpace);     
		    c.lineTo(hStep-10,i*tickStep+tickInit+titleSpace+legendSpace);   
		    c.closePath();    
		    c.stroke();    	       	    
		} 
		c.font = font;
	}

	//draw X labels 
	c.fillStyle = "black"; 
	if (obj.xData !== undefined) {
		c.fillStyle = obj.xData.color; 
		var b = " ";
		var xfont = obj.xData.font;
		c.font = xfont.weight + b + xfont.size + "px" + b + xfont.family;  
	}		
	for(var i=0; i<labels.length; i++) {   
	    var middleX = hStep + i*(realWidth-hStep )/data.length + (realWidth - hStep - gap*(1+Math.sqrt(series)))/data.length/2;
	    if (isH(chartType)) {	    	
			c.save();
			
			// X labels are transformed to appear on Y axis (they are vertical) 
			c.scale(1,-1);
			c.translate(0, -2*realHeight+ xLabelWidth + 3*xLegendSpace/2 );
			var size = 20;
			if (obj.xData !== undefined) {
				size = obj.xData.font.size;
			}						
									
			// rotate X labels to appear horizontal			
			c.translate(realHeight-step-size/2+middleX+xLabelWidth/2+xLegendSpace/2, realHeight-middleX- c.measureText(labels[i]).width/2 - size/2 -xLegendSpace/2);						
			c.rotate(Math.PI/2);				
						
			c.fillText(labels[i],middleX  - c.measureText(labels[i]).width / 2, realHeight-step/2 - 2);					
			c.restore();			
		} else {		
			var xLabelSpace = computeXLabelSpace(labels[i]);
		    if (labelOrientation == "vertical") {
		    	c.save();	    	
		    	c.translate(middleX  - c.measureText(labels[i]).width / 2, realHeight-step/2-xLegendSpace/2);
		    	c.rotate(-Math.PI/2);
		    	c.textAlign = "center";	    	 
		    	c.fillText(labels[i],0, c.measureText(labels[i]).width / 2 + 6 );
		    	c.restore();
		     } else if (labelOrientation == "diagonal") {
		    	c.save();	    	
		    	c.translate(middleX  - c.measureText(labels[i]).width / 2, realHeight-step/2-xLegendSpace/2-5);
		    	c.rotate(-Math.PI/4);
		    	c.textAlign = "center";	    	 
		    	c.fillText(labels[i],0, 16);
		    	c.restore();	
		     } else if (labelOrientation == "halfdiagonal") {
			    c.save();	    	
			    c.translate(middleX  - c.measureText(labels[i]).width / 2, realHeight-step + 10);
			    c.rotate(-Math.PI/8);
			    c.textAlign = "center";	    	 
			    c.fillText(labels[i],0, 16);
			    c.restore();		
		    } else {
		    	// horizontal
		    	c.fillText(labels[i],middleX  - c.measureText(labels[i]).width / 2, realHeight-step/2-xLegendSpace/4);
		    }
		}
	}  
	c.font = font;
	
}

function drawGrid() {		
			
	// draw  horizontal grid  (for Y labels)
	if (showGridY) {
		for(var i=0; i<tickCount+1; i++) {        			    	    	    
	    	var xColor = c.strokeStyle;
	    	if (obj.colorGridY !== "undefined") {
	    		c.strokeStyle = obj.colorGridY;
	    	}
	    	c.lineWidth = 0.2;        
	        c.beginPath(); 
	        c.moveTo(hStep-10,i*tickStep+tickInit+titleSpace+legendSpace);  
	        c.lineTo(realWidth-10,i*tickStep+tickInit+titleSpace+legendSpace);  
	        c.closePath();    
	        c.stroke();
	        c.lineWidth = 2.0;   
	        c.strokeStyle = xColor;
	    }    
	} 	
	
	// draw  vertical grid  (for X labels)
    if (showGridX) {
    	for(var i=0; i<labels.length; i++) {   
    		var middleX = hStep + i*(realWidth-hStep )/data.length + (realWidth - hStep - gap*(1+Math.sqrt(series)))/data.length/2;	    	    
	    	var yColor = c.strokeStyle;
	    	if (obj.colorGridX !== "undefined") {
	    		c.strokeStyle = obj.colorGridX;
	    	}
	        c.lineWidth = 0.2;        
	        c.beginPath(); 
	        c.moveTo(middleX,10+titleSpace+legendSpace);  
	        c.lineTo(middleX,realHeight-step);  
	        c.closePath();    
	        c.stroke();
	        c.lineWidth = 2.0;   
	        c.strokeStyle = yColor;
	    }    
	}  	
	
}

function drawAxis() {
	c.fillStyle = "black"; 
	c.lineWidth = 2.0; 
	var axisColor = c.strokeStyle;	
	
	// y axis
	if (obj.colorYaxis !== "undefined") {
		c.strokeStyle = obj.colorYaxis;
	}
	c.beginPath();     
	c.moveTo(hStep-10,titleSpace+legendSpace); 
	c.lineTo(hStep-10,realHeight-step); 
	c.closePath();
	c.stroke();
	
	// x axis
	if (obj.colorXaxis !== "undefined") {
		c.strokeStyle = obj.colorXaxis;
	}	
	c.beginPath(); 
	c.moveTo(hStep-10,realHeight-step); 
	if (isH(chartType)) {
		c.lineTo(realWidth,realHeight-step);
	} else {
		c.lineTo(realWidth-5,realHeight-step);
	}
	c.closePath();
	c.stroke();
	
	c.strokeStyle = axisColor;
}


function getTooltip(mousePos) {	
	return drawData(false, false, mousePos);	 	  	 
}      

function onClick(evt) {
	var v = drawData(false, true, getMousePos(canvas, evt));	
	if ((v !== "") && (obj.onClick !== undefined)) {		
		var f = obj.onClick;			
		eval(f);
		doClick(v);
	}	
	return v;
}

function drawChart() {	
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000/60);
              };
    })();                
            
    window.requestAnimFrame(animDraw); 
}  

//compute hStep (for vertical labels and yLegend to fit) 
function computeHStep() {	
	var result;
	var font = c.font;
	if (showTicks) {
		var maxLabelWidth = 0;	
		if (typeof obj.yData !== "undefined") {	 		
			var yfont = obj.yData.font;		
			var b = " ";
			c.font = yfont.weight + b + yfont.size + "px" + b + yfont.family;  		
		}
		for(var i=0; i<tickCount+1; i++) {        
			var label = Math.round((maxValY-i*yStep)*100)/100;
			var labelWidth = c.measureText(label).width;
			if (labelWidth > maxLabelWidth) {
				maxLabelWidth = labelWidth;
			}   
		}      	
		result = maxLabelWidth + 20;
	} else {
		result = 20;
	}	
	c.font = font;
	if (typeof obj.yLegend !== "undefined") {		
		var b = " ";
		var f = obj.yLegend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;      
		yLegendSpace = +20 + +f.size;		    
		c.font = font;            
		result += yLegendSpace;
	} 			
	return result;
}

// computes vertical step needed 
// returns maximum width for x labels
function computeVStep() {
	var xLabelWidth = 0;
	if (typeof obj.xData !== "undefined") {	 		
		var xfont = obj.xData.font;		
		var b = " ";
		c.font = xfont.weight + b + xfont.size + "px" + b + xfont.family;  		
	}
	for(var i=0; i<labels.length; i++) {            
	    var labelWidth = computeXLabelSpace(labels[i]);
	    if (labelWidth > xLabelWidth) {
	        xLabelWidth = labelWidth;
	    }   
	} 
	var _xLegendSpace = 0;
	if (typeof obj.xLegend !== "undefined") {				
		var f = obj.xLegend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}		      
		_xLegendSpace = +20 + +f.size;  
	}		
	if (step < xLabelWidth+_xLegendSpace) {    
	    step = xLabelWidth+_xLegendSpace;	    		
	}	
	return xLabelWidth;
}

// depends on label orientation
function computeXLabelSpace(label) {
	var _labelWidth = c.measureText(label).width + 10; // vertical
    if (!isH(chartType)) {
	    if (labelOrientation === "horizontal") {
	    	if (typeof obj.xData !== "undefined") {	 	
	    		_labelWidth =  obj.xData.font.size + 20;
	    	} else {
	    		_labelWidth = 12 + 20;
	    	}	
	    } else if (labelOrientation === "halfdiagonal") {
	    	_labelWidth = c.measureText(label).width * Math.sin(Math.PI/8) + 20;
	    } else if (labelOrientation === "diagonal") {
	    	_labelWidth = c.measureText(label).width * Math.sin(Math.PI/4) + 20;
	    }
	}
    return _labelWidth;
}

function getTitleSpace() {
	var space = 10;
	if (typeof obj.title !== "undefined") {		
		var f = obj.title.font;
		if (f === undefined) {			
			f.size = 12;			
		}		      
		space = +20 + +f.size;  
	} 
	return space;
}

function getXLegendSpace() {	
    var _xLegendSpace = 0;
	if (typeof obj.xLegend !== "undefined") {						
		var f = obj.xLegend.font;
		if (f === undefined) {			
			f.size = 12;			
		}		      
		_xLegendSpace = +20 + +f.size;
	}
	return _xLegendSpace;
}

function getLegendSpace() {
	var font = c.font;
	var _legendSpace = 20;
	if (typeof obj.legend !== "undefined") {         
		var x = hStep;
		if (isH(chartType)) {	
			x = step;
		}
		c.font = "bold 10px sans-serif";		
		var legendY = getTitleSpace()+20;		
		for (var k=0; k<series; k++) {        			        
			var legendWidth = c.measureText(obj.legend[k]).width + 24;             			
			if (isH(chartType)) {					
				if (x + legendWidth > realHeight) {
					// draw legend on next line if does not fit on current one
					x = step;
					legendY = legendY + 14;					
				}					
			} else {
				if (x + legendWidth > realWidth) {
					// draw legend on next line if does not fit on current one
					x = hStep;
					legendY = legendY + 14;
					if (!isH(chartType)) {
						_legendSpace += 20;
					}
				}    
			}								     
			x = x + legendWidth;			 
		} 
		if (obj.lineLegend !== undefined) {
			for (var k=0; k<obj.lineData.length; k++) {        			        
				var legendWidth = c.measureText(obj.lineLegend[k]).width + 24;   
				if (x + legendWidth > realWidth) {
					// draw legend on next line if does not fit on current one
					x = hStep;
					legendY = legendY + 14;					
					_legendSpace += 20;					
				}  
			}	
			x = x + legendWidth;
		}
	}
	c.font = font;
	return _legendSpace;
}

function isStacked(chartType) {
	return (chartType == "stackedbar") || (chartType == "hstackedbar");
}

function isH(chartType) {
	return (chartType == "hbar") || (chartType == "hstackedbar");
}

function resizeCanvas() {
	var w = canWidth;
	if (resizeWidth) {
		if (!isPercent(w)) {
			w = "100%";
		}
	}
	var h = canHeight;
	if (resizeHeight) {
		if (!isPercent(h)) {
			h = "100%";
		}
	}				
	updateSize(w, h);	
	drawChart();
}

drawBar(myjson, idCan, idTipCan, canWidth, canHeight);

};
/*
 * Json must contain as mandatory only "data" attribute 
 * 
 * type -> line, area
 * style -> normal, soliddot, hollowdot, anchordot, bowdot, stardot
 * labelOrientation -> horizontal, vertical, diagonal, halfdiagonal
 * message -> can have markup #val for value
 *         -> can contain <br> to split text on more lines
 * title.alignment -> center, left, right
 * onClick -> is a javascript function like 'function doClick(value){ ...}'  *            
 * 
 * { "type": "line", "area"
 *   "style": "normal",
 *   "background" : "white",
 * 	 "data": [[ 16, 66, 24, 30, 80, 52 ], [ 48, 50, 29, 60, 70, 58 ], [ 30, 40, 28, 52, 74, 50 ]], 
 *   "labels": ["JAN","FEB","MAR","APR","MAY", "JUN"],
 *   "labelOrientation": "horizontal",  
 *   "color": ["#004CB3","#A04CB3", "#7aa37a"], 
 *   "legend": ["2011 First year of work" , "2012 Second year of work", "2013 Third year of work"],
 *   "alpha" : 0.8, 
 *   "colorXaxis": "blue",
 *   "colorYaxis": "blue",
 *   "showGridX": true, 
 *   "showGridY": true, 
 *   "colorGridX": "rgb(248, 248, 216)", 
 *   "colorGridY": "rgb(248, 248, 216)", 
 *   "message" : "Value \: #val", 
 *   "showTicks" : true,
 *   "tickCount" : 5, 
 *   "title" : {
 *   	"text": "Analiza financiara", 
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "#000000",
 *      "alignment":"left"
 *   }, 
 *   "xData" : {
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "yData" : {
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "xLegend" : {
 *      "text": "Month", 
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "yLegend" : {
 *      "text": "Sales",
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "tooltipPattern" : {
 *   	"decimals": 2,
 *   	"decimalSeparator" : ".",
 *      "thousandSeparator" : ","
 *   },
 *   "onClick" : "function doClick(value){console.log("Call from function: " + value);}"
 * }
 * 
 */

var lineChart = function(myjson, idCan, idTipCan, canWidth, canHeight) {

var obj;
var data;
var labels; 
var labelOrientation;
var globalAlpha;
var showGridX;
var showGridY;
var background;
var message;
var tickCount;
var showTicks;
var chartType;
var chartStyle;
var seriesColor;
var xData, yData;
var series;
var yStep;
var maxK = new Array(); 
var minK = new Array();
var dotsK = new Array();
var max;
var min;
//space between 2 ticks
var tickStep;

var minValY;
var maxValY;
// bottom vertical space (to fit X labels and X legend)
var step = 0;
var gap = 40;
// left horizontal space (to fit bigger Y labels and Y legend)
var hStep = 60;
var titleSpace = 0;
var legendSpace = 0;
var xLegendSpace = 0;
var yLegendSpace = 0;
var xaxisY = 0;
var realWidth;
var realHeight;
var canvas;  
var c; 
var tipCanvas;
var H = 6;
var dotRadius = 3;
// space between X axis and first tick
var tickInit;
var resizeWidth = false;
var resizeHeight = false;

function drawLine(myjson, idCan, idTipCan, canWidth, canHeight) {	
			
	canvas = document.getElementById(idCan);  
	tipCanvas = document.getElementById(idTipCan);
	c = canvas.getContext('2d');
	
	obj = myjson;
	chartType = obj.type;
	if (typeof chartType === "undefined") {
	    chartType = "line";
	}		
					
	background = obj.background;
	if (typeof background === "undefined") {	
		background = "white";
	}
	
	
	chartStyle = obj.style;
	// test for passing a wrong style
	if ((typeof chartStyle === "undefined") || (find(['normal', 'soliddot', 'hollowdot', 'anchordot', 'bowdot', 'stardot'],chartStyle) === false)) {	
		chartStyle = "normal";
	}	
	
	data = obj.data[0];
	series = obj.data.length;
	
	labels = obj.labels; 
	if (typeof labels === "undefined") {
		labels = [];
		for (var i=0; i<data.length; i++) {
			labels.push("");
		}
	}
	
	labelOrientation = obj.labelOrientation;
	if (typeof labelOrientation === "undefined") {
    	labelOrientation = "horizontal";
    }
	
	globalAlpha = obj.alpha;
	if (typeof globalAlpha === "undefined") {
        globalAlpha = 0.8;
    }
	
	showTicks = obj.showTicks;
	if (typeof showTicks === "undefined") {
		showTicks = true;
	}	
	
	showGridX = obj.showGridX;
	if (typeof showGridX === "undefined") {
        showGridX = true;
    }
        
	showGridY = obj.showGridY;
	if (typeof showGridY === "undefined") {
        showGridY = true;
    }
	
	message = obj.message;
	if (typeof message === "undefined") {		
		message = "#val";		
	}
	
	tickCount = obj.tickCount;
	if (typeof tickCount === "undefined") {
        tickCount = 5;        
    }    
			
	seriesColor = obj.color;
	if (typeof seriesColor === "undefined") {
		seriesColor = distinctHexColors(series);
    }    
	
	// compute min ,max values
	for (var k=0; k<series; k++) {
		maxK[k] = Math.max.apply( Math, obj.data[k] );
		minK[k] = Math.min.apply( Math, obj.data[k] ); 
	}    	
    max = Math.max.apply( Math, maxK);	         
    min = Math.min.apply( Math, minK);
    
    var objStep = calculateYStep(min, max, tickCount);
    yStep = objStep.yStep;
    minValY = objStep.minValY;
    maxValY = objStep.maxValY;
    
    // compute hStep (for vertical labels and yLegend to fit) 
	hStep = computeHStep();	
        		
	updateSize(canWidth, canHeight);
    
    canvas.addEventListener('mousemove', 
			function(evt) { 
				var hme = Object.create(handleMouseEvent);
				hme.mousePos = getMousePos(canvas, evt);
				hme.tooltip = getTooltip(hme.mousePos);		
				hme.execute(canvas, tipCanvas, evt); 
			}, 
			false);  
    
    canvas.addEventListener ("mouseout", 
    		function(evt) {
    			tipCanvas.style.left = "-2000px";
    		}, 
    		false);
    
    canvas.addEventListener("click", onClick, false);
        
    if (resizeWidth || resizeHeight) {    	
    	window.addEventListener('resize', resizeCanvas, false);
    }

	drawChart();
}

function updateSize(canWidth, canHeight) {		
	if (canWidth !== undefined) {
		if (isPercent(canWidth)) {
			var percent = canWidth.substring(0, canWidth.length-1);			
			//canvas.width = window.innerWidth*percent/100;
			var cl = canvas.parentNode;			
			canvas.width = cl.offsetWidth*percent/100;				
			resizeWidth = true;
		} else {
			canvas.width = canWidth;
		}
	}	 
	if (canHeight !== undefined) {
		if (isPercent(canHeight)) {
			var percent = canHeight.substring(0, canHeight.length-1);
			canvas.height = window.innerHeight*percent/100;
			//var cl = canvas.parentNode;	
			//canvas.height = cl.offsetHeight*percent/100;
			resizeHeight = true;
		} else {
			canvas.height = canHeight;
		}
	}		
	
	realWidth = canvas.width;
	realHeight = canvas.height;	
		
	// adjust the  x gap between elements (should be smaller for smaller widths)
	gap = realWidth/10 - 10;
				
	
	tickInit = realHeight/12;	
    
	// space between 2 ticks
	tickStep = (realHeight-step-tickInit)/tickCount;	  
}


function animDraw() {      
    if (drawIt(H)) {          		    
        return false;
    }    
    H += 1+(realHeight-step-titleSpace-legendSpace)/30;    
    window.requestAnimFrame(animDraw);      
}    


// function called repetitive by animation
function drawIt(H) {    		
	
	// to redraw the entire canvas (it extends under drawn x axis)
	drawInit();
			
	// if we clear only the rectangle containing the chart (without title , legends, labels)
	// clear the drawn area (if drawInit is called in drawChart)
	//	c.fillStyle = background; 
	//	c.fillRect(hStep-10,titleSpace+legendSpace,width, realHeight-step-titleSpace-legendSpace-2);
	
	var stop = drawData(true, false, "");
	
	drawGrid();
	drawAxis();
	 				
	return stop;
}

// withFill = false means to construct just the path needed for tooltip purposes
function drawData(withFill, withClick, mousePos) {
	var font = c.font;
	    
	//draw data 
	c.lineWidth = 1.0;
	var stop = true;	
			    
	for(var k=0; k<series; k++) {  
	  dotsK[k] = [];	
	  for(var i=0; i<data.length; i++) { 		  
	    var dp = obj.data[k][i];	
	    var width =  (realWidth - hStep - gap*(1+Math.sqrt(series)))/data.length;
	    var dotX = hStep + i*(realWidth-hStep)/data.length + width/2;       
	    var Yheight = realHeight-step-(dp-minValY)*tickStep/yStep;    
	    var dotY = realHeight-step-H;
	    var dotX2 = dotX;
	    var dotY2 = dotY;
	    var Yheight2 = Yheight;
	    if (i < data.length-1) {
	    	dotX2 = hStep + (i+1)*(realWidth-hStep)/data.length + width/2;
	    	dotY2 = realHeight-step-H;
	    	Yheight2 = realHeight-step-(obj.data[k][i+1]-minValY)*tickStep/yStep;
	    }
	    	    	    
	    if (dotY <= Yheight) {
	        dotY = Yheight;
	    } else {
	        stop = false;
	    }  
	    if (dotY+2 > xaxisY) {
	        dotY = xaxisY-1;	        
	    } 	
	    if (i < data.length-1) {
		    if (dotY2 <= Yheight2) {
		        dotY2 = Yheight2;
		    } else {
		        stop = false;
		    }  
		    if (dotY2+2 > xaxisY) {
		        dotY2 = xaxisY-1;	        
		    } 	    
	    }
	    	   	    
	    dotsK[k].push({x:dotX, y:dotY});
	    	 
	    var savedStroke = c.strokeStyle;
	    if ((chartStyle == "normal") || (chartType == "area")) {
			dotRadius = 2;
		}
	    drawLineElements(c, chartStyle, chartType, dotRadius, seriesColor, dotsK, data.length, xaxisY, globalAlpha, k, i, dotX, dotY, dotX2, dotY2, withFill);
	    c.strokeStyle = savedStroke;
	      	    
	    if (!withFill) {
	    	if (c.isPointInPath(mousePos.x, mousePos.y)) {  
	    		var tValue = obj.data[k][i];
	    		if (obj.tooltipPattern !== undefined) {
	    			tValue = formatNumber(tValue, obj.tooltipPattern.decimals, obj.tooltipPattern.decimalSeparator, obj.tooltipPattern.thousandSeparator);
	    		}	  
	    		var returnValue = labels[i]; // tValue
	    		if (withClick) {
	    			return returnValue;
	    		} else {
			    	var mes = String(message).replace('#val', tValue);	
			    	if (obj.onClick !== undefined) {
			    		canvas.style.cursor = 'pointer';
			    	}
			        return mes;
	    		}
		    } else {
		    	canvas.style.cursor = 'default';
		    }    					   
	    }
	  } 
	}   	
		
	if (withFill) {
		return stop;
	} else {
		// empty tooltip message
		return "";
	}
}

function drawInit() {
	
	var font = c.font;
	
	//draw background (clear canvas)
	c.fillStyle = background; 	
	c.fillRect(0,0,realWidth,realHeight);			
	
	// adjust step with X label space (x label can have different orientations) and X legend space
	var xLabelWidth = computeVStep();

	//draw title		
	if (typeof obj.title !== "undefined") {
		var titleColor = obj.title.color;
		if (titleColor === undefined) {
			titleColor = '#000000';
		}
		c.fillStyle = titleColor;
		var b = " ";
		var f = obj.title.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;   		
		titleSpace = +20 + +f.size;
		 
		var alignment = obj.title.alignment;
		if (alignment === undefined) {
			alignment = "center";
		}
		var xTitle;
		if (alignment == "left") {
			xTitle = hStep;
		} else if (alignment == "right") {
			xTitle = canvas.width - c.measureText(obj.title.text).width - 10;
		} else {
			// center
			xTitle = canvas.width/2- c.measureText(obj.title.text).width/2;
		}				
		
		c.fillText(obj.title.text, xTitle , 20+titleSpace/2 );    
		c.font = font;   				
	} else {
		titleSpace = 10;
	}    
	
	
	//draw X legend	
	if (typeof obj.xLegend !== "undefined") {
						
		var xLegendColor = obj.xLegend.color;
		if (xLegendColor === undefined) {
			xLegendColor = '#000000';
		}
		c.fillStyle = xLegendColor;
		var b = " ";
		var f = obj.xLegend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;      
		xLegendSpace = +20 + +f.size;             					
		
		c.fillText(obj.xLegend.text, realWidth/2- c.measureText(obj.xLegend.text).width/2 , realHeight - f.size );    
		c.font = font;   	
	} else {
		xLegendSpace = 0;
	}    
	
	//draw Y legend	
	if (typeof obj.yLegend !== "undefined") {
		var yLegendColor = obj.yLegend.color;
		if (yLegendColor === undefined) {
			yLegendColor = '#000000';
		}
		var b = " ";
		var f = obj.yLegend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;      
		c.fillStyle = yLegendColor;		
		c.save();	    	
    	c.translate(10  , realHeight/2);
    	c.rotate(-Math.PI/2);
    	c.textAlign = "center";	    	     	
    	c.fillText(obj.yLegend.text,0, f.size);
    	c.restore();		    
		c.font = font;            
	} else {
		yLegendSpace = 0;
	}    

	// draw legend	
	if (typeof obj.legend !== "undefined") {         
		var x = hStep;		
		c.font = "bold 10px sans-serif";
		legendSpace = 20; 
		var legendY = titleSpace+20;
		c.globalAlpha = globalAlpha;
		for (var k=0; k<series; k++) {        
			c.fillStyle = seriesColor[k];        
			var legendWidth = c.measureText(obj.legend[k]).width + 24;             
						
			if (x + legendWidth > realWidth) {
				// draw legend on next line if does not fit on current one
				x = hStep;
				legendY = legendY + 14;				
				legendSpace += 20;				
			}    
					
			c.fillText("---- " + obj.legend[k], x, legendY);
			     
			x = x + legendWidth;			
		}  
		c.globalAlpha = 1;
		c.font = font;
	}    	
	
	
	
	c.font = font;

    
	// adjust tickStep depending if title or legend are present or not
	tickStep = (realHeight-step-titleSpace-legendSpace-tickInit)/tickCount; 	

	// compute Y value for xAxis
	xaxisY = tickCount*tickStep+tickInit+titleSpace+legendSpace; 
	
	drawLabels(xLabelWidth);
}


function drawLabels(xLabelWidth) {
	
	var font = c.font;
			
	//draw Y labels and small lines 	
	if (showTicks) {
		c.fillStyle = "black"; 
		if (obj.yData !== undefined) {
			c.fillStyle = obj.yData.color; 
			var b = " ";
			var yfont = obj.yData.font;
			c.font = yfont.weight + b + yfont.size + "px" + b + yfont.family;  
		}
		for(var i=0; i<tickCount+1; i++) {        		
			var label;
			if (obj.tooltipPattern !== undefined) {
				// y labels can have more than two decimals
				var decimals = obj.tooltipPattern.decimals;
				var exp = Math.pow(10, decimals);
				label = Math.round((maxValY-i*yStep)*exp)/exp;
			} else {
				label = Math.round((maxValY-i*yStep)*100)/100;
			}
			var labelWidth = c.measureText(label).width;   						
			
			c.fillText(label + "",hStep - 15 - labelWidth , i*tickStep+tickInit+titleSpace+legendSpace);
			
			c.lineWidth = 2.0; 
			c.beginPath();     
		    c.moveTo(hStep-15,i*tickStep+tickInit+titleSpace+legendSpace);     
		    c.lineTo(hStep-10,i*tickStep+tickInit+titleSpace+legendSpace);   
		    c.closePath();    
		    c.stroke();    	       	    
		} 
		c.font = font;
	}

	//draw X labels 
	c.fillStyle = "black"; 
	if (obj.xData !== undefined) {
		c.fillStyle = obj.xData.color; 
		var b = " ";
		var xfont = obj.xData.font;
		c.font = xfont.weight + b + xfont.size + "px" + b + xfont.family;  
	}		
	for(var i=0; i<labels.length; i++) {   
	    var middleX = hStep + i*(realWidth-hStep )/data.length + (realWidth - hStep - gap*(1+Math.sqrt(series)))/data.length/2;
	    		
		var xLabelSpace = computeXLabelSpace(labels[i]);
		if (labelOrientation == "vertical") {
		   	c.save();	    	
		   	c.translate(middleX  - c.measureText(labels[i]).width / 2, realHeight-step/2-xLegendSpace/2);
		   	c.rotate(-Math.PI/2);
		   	c.textAlign = "center";	    	 
		   	c.fillText(labels[i],0, c.measureText(labels[i]).width / 2 + 6 );
		   	c.restore();
		} else if (labelOrientation == "diagonal") {
		  	c.save();	    	
		   	c.translate(middleX  - c.measureText(labels[i]).width / 2, realHeight-step/2-xLegendSpace/2-5);
		   	c.rotate(-Math.PI/4);
		   	c.textAlign = "center";	    	 
		   	c.fillText(labels[i],0, 16);
		   	c.restore();	
		} else if (labelOrientation == "halfdiagonal") {
		    c.save();	    	
		    c.translate(middleX  - c.measureText(labels[i]).width / 2, realHeight-step + 10);
		    c.rotate(-Math.PI/8);
		    c.textAlign = "center";	    	 
		    c.fillText(labels[i],0, 16);
		    c.restore();		
		} else {
		   	// horizontal
		   	c.fillText(labels[i],middleX  - c.measureText(labels[i]).width / 2, realHeight-step/2-xLegendSpace/4);
		}
		
	}  
	c.font = font;
	
}

function drawGrid() {		
			
	// draw  horizontal grid  (for Y labels)
	if (showGridY) {
		for(var i=0; i<tickCount+1; i++) {        			    	    	    
	    	var xColor = c.strokeStyle;
	    	if (obj.colorGridY !== "undefined") {
	    		c.strokeStyle = obj.colorGridY;
	    	}
	    	c.lineWidth = 0.2;        
	        c.beginPath(); 
	        c.moveTo(hStep-10,i*tickStep+tickInit+titleSpace+legendSpace);  
	        c.lineTo(realWidth-10,i*tickStep+tickInit+titleSpace+legendSpace);  
	        c.closePath();    
	        c.stroke();
	        c.lineWidth = 2.0;   
	        c.strokeStyle = xColor;
	    }    
	} 	
	
	// draw  vertical grid  (for X labels)
    if (showGridX) {
    	for(var i=0; i<labels.length; i++) {   
    		var middleX = hStep + i*(realWidth-hStep )/data.length + (realWidth - hStep - gap*(1+Math.sqrt(series)))/data.length/2;	    	    
	    	var yColor = c.strokeStyle;
	    	if (obj.colorGridX !== "undefined") {
	    		c.strokeStyle = obj.colorGridX;
	    	}
	        c.lineWidth = 0.2;        
	        c.beginPath(); 
	        c.moveTo(middleX,10+titleSpace+legendSpace);  
	        c.lineTo(middleX,realHeight-step);  
	        c.closePath();    
	        c.stroke();
	        c.lineWidth = 2.0;   
	        c.strokeStyle = yColor;
	    }    
	}  	
	
}

function drawAxis() {
	c.fillStyle = "black"; 
	c.lineWidth = 2.0; 
	var axisColor = c.strokeStyle;	
	
	// y axis
	if (obj.colorYaxis !== "undefined") {
		c.strokeStyle = obj.colorYaxis;
	}
	c.beginPath();     
	c.moveTo(hStep-10,titleSpace+legendSpace); 
	c.lineTo(hStep-10,realHeight-step); 
	c.closePath();
	c.stroke();
	
	// x axis
	if (obj.colorXaxis !== "undefined") {
		c.strokeStyle = obj.colorXaxis;
	}	
	c.beginPath(); 
	c.moveTo(hStep-10,realHeight-step); 
	
	c.lineTo(realWidth-5,realHeight-step);
	
	c.closePath();
	c.stroke();
	
	c.strokeStyle = axisColor;
}


function getTooltip(mousePos) {	
	return drawData(false, false, mousePos);	 	  	 
}      

function onClick(evt) {
	var v = drawData(false, true, getMousePos(canvas, evt));	
	if ((v !== "") && (obj.onClick !== undefined)) {		
		var f = obj.onClick;			
		eval(f);
		doClick(v);
	}	
	return v;
}

function drawChart() {	
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000/60);
              };
    })();                
            
    window.requestAnimFrame(animDraw); 
}  

//compute hStep (for vertical labels and yLegend to fit) 
function computeHStep() {	
	var result;
	var font = c.font;
	if (showTicks) {
		var maxLabelWidth = 0;	
		if (typeof obj.yData !== "undefined") {	 		
			var yfont = obj.yData.font;		
			var b = " ";
			c.font = yfont.weight + b + yfont.size + "px" + b + yfont.family;  		
		}
		for(var i=0; i<tickCount+1; i++) {        
			var label = Math.round((maxValY-i*yStep)*100)/100;
			var labelWidth = c.measureText(label).width;
			if (labelWidth > maxLabelWidth) {
				maxLabelWidth = labelWidth;
			}   
		}      	
		result = maxLabelWidth + 20;
	} else {
		result = 20;
	}
	c.font = font;
	if (typeof obj.yLegend !== "undefined") {		
		var b = " ";
		var f = obj.yLegend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;      
		yLegendSpace = +20 + +f.size;		    
		c.font = font;            
		result += yLegendSpace;
	} 	
	return result;
}

// computes vertical step needed 
// returns maximum width for x labels
function computeVStep() {
	var xLabelWidth = 0;
	if (typeof obj.xData !== "undefined") {	 		
		var xfont = obj.xData.font;		
		var b = " ";
		c.font = xfont.weight + b + xfont.size + "px" + b + xfont.family;  		
	}
	for(var i=0; i<labels.length; i++) {            
	    var labelWidth = computeXLabelSpace(labels[i]);
	    if (labelWidth > xLabelWidth) {
	        xLabelWidth = labelWidth;
	    }   
	} 
	var _xLegendSpace = 0;
	if (typeof obj.xLegend !== "undefined") {				
		var f = obj.xLegend.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}		      
		_xLegendSpace = +20 + +f.size;  
	}		
	if (step < xLabelWidth+_xLegendSpace) {    
	    step = xLabelWidth+_xLegendSpace;	    		
	}	
	return xLabelWidth;
}

// depends on label orientation
function computeXLabelSpace(label) {
	var _labelWidth = c.measureText(label).width + 10; // vertical
   
	if (labelOrientation === "horizontal") {
	   	if (typeof obj.xData !== "undefined") {	 	
	   		_labelWidth =  obj.xData.font.size + 20;
	   	} else {
	   		_labelWidth = 12 + 20;
	   	}	
	} else if (labelOrientation === "halfdiagonal") {
	   	_labelWidth = c.measureText(label).width * Math.sin(Math.PI/8) + 20;
	} else if (labelOrientation === "diagonal") {
	   	_labelWidth = c.measureText(label).width * Math.sin(Math.PI/4) + 20;
	}
	
    return _labelWidth;
}

function getTitleSpace() {
	var space = 10;
	if (typeof obj.title !== "undefined") {		
		var f = obj.title.font;
		if (f === undefined) {			
			f.size = 12;			
		}		      
		space = +20 + +f.size;  
	} 
	return space;
}

function getXLegendSpace() {	
    var _xLegendSpace = 0;
	if (typeof obj.xLegend !== "undefined") {						
		var f = obj.xLegend.font;
		if (f === undefined) {			
			f.size = 12;			
		}		      
		_xLegendSpace = +20 + +f.size;
	}
	return _xLegendSpace;
}

function getLegendSpace() {
	var font = c.font;
	var _legendSpace = 20;
	if (typeof obj.legend !== "undefined") {         
		var x = hStep;		
		c.font = "bold 10px sans-serif";		
		var legendY = getTitleSpace()+20;		
		for (var k=0; k<series; k++) {        			        
			var legendWidth = c.measureText(obj.legend[k]).width + 24;             			
			
			if (x + legendWidth > realWidth) {
				// draw legend on next line if does not fit on current one
				x = hStep;
				legendY = legendY + 14;				
				_legendSpace += 20;				
			}    
											     
			x = x + legendWidth;			 
		} 
	}
	c.font = font;
	return _legendSpace;
}

function resizeCanvas() {
	var w = canWidth;
	if (resizeWidth) {
		if (!isPercent(w)) {
			w = "100%";
		}
	}
	var h = canHeight;
	if (resizeHeight) {
		if (!isPercent(h)) {
			h = "100%";
		}
	}
	updateSize(w, h);
	drawChart();
}

drawLine(myjson, idCan, idTipCan, canWidth, canHeight);

};

/**** line chart utilities ****/
//return Y coordinates of the two ends of a line
//when we draw small dots with space between lines
function getLineY(dotY, dotY2, alpha, space) {
	var y, y2;
	if (dotY == dotY2) {
		y = dotY;
		y2 = dotY2;						
	} else if (dotY > dotY2) {
		y = dotY-space*Math.sin(alpha);
		y2 = dotY2 + space*Math.sin(alpha);
	} else if (dotY < dotY2){
		y = dotY+space*Math.sin(alpha);
		y2 = dotY2 - space*Math.sin(alpha);
	}
	return {y:y, y2:y2};
}

function drawDot(c, chartStyle, dotX, dotY, dotRadius, withFill) {
	c.beginPath();        	
  c.arc(dotX, dotY, dotRadius, 0, Math.PI * 2, true);    	    
  if (withFill) {
  	if (chartStyle == "hollowdot") {
  		c.stroke();
  	} else {
  		c.fill();
  	}
  }
}

function drawBow(c, dotX, dotY, withFill) {
	var d = 4;
	c.beginPath();
	c.moveTo(dotX, dotY);
	c.lineTo(dotX-d, dotY-d);
	c.lineTo(dotX+d, dotY-d);
	c.lineTo(dotX-d, dotY+d);
	c.lineTo(dotX+d, dotY+d);
	c.lineTo(dotX, dotY);
	if (withFill) {
		c.stroke();
	}
}

function drawAnchor(c, dotX, dotY, withFill) {
	var d = 8;
	c.beginPath();
	c.moveTo(dotX-d/2, dotY+Math.sqrt(3)*d/6);
	c.lineTo(dotX, dotY-2*Math.sqrt(3)*d/6);
	c.lineTo(dotX+d/2, dotY+Math.sqrt(3)*d/6);
	c.lineTo(dotX-d/2, dotY+Math.sqrt(3)*d/6);
	if (withFill) {
		c.stroke();
	}
}

//x of center, y of center, radius, number of points, fraction of radius for inset
function drawStar(c, x, y, r, p, m, withFill) {
  c.save();
  c.beginPath();
  c.translate(x, y);
  c.moveTo(0,0-r);
  for (var i = 0; i < p; i++) {
      c.rotate(Math.PI / p);
      c.lineTo(0, 0 - (r*m));
      c.rotate(Math.PI / p);
      c.lineTo(0, 0 - r);
  }
  if (withFill) {
  	c.stroke();
  }
  c.restore();
}

function drawLineElements(c, chartStyle, chartType, dotRadius, seriesColor, dotsK, dataLength, xaxisY, globalAlpha, k, i, dotX, dotY, dotX2, dotY2, withFill) {			
	
	var space = dotRadius+2;
	var y, y2, alpha;
	if (i < dataLength-1) {		
		alpha = Math.atan(Math.abs(dotY2-dotY)/Math.abs(dotX2-dotX));
	}
	var yy = getLineY(dotY, dotY2, alpha, space);
	c.strokeStyle = seriesColor[k];	
	c.fillStyle = seriesColor[k];		
	if (i < dataLength-1) {				
		c.beginPath();
		c.moveTo(dotX+space*Math.cos(alpha), yy.y);	
		c.lineTo(dotX2-space*Math.cos(alpha), yy.y2);	
	} else {
		if (chartType == "area") {					
			c.strokeStyle = colorLuminance(seriesColor[k],1.3);
			c.beginPath();
			for (var i = 0; i < dotsK[k].length; i++) {
				var dot = dotsK[k][i];
				if (i == 0) {
					c.moveTo(dot.x, dot.y);
				} else {
					c.lineTo(dot.x, dot.y);
				}
		        
			}    	
			c.lineTo(dotX, xaxisY);				
			c.lineTo(dotsK[k][0].x ,xaxisY);
			c.lineTo(dotsK[k][0].x, dotsK[k][0].y);
			c.closePath();
			if (withFill) {
				c.globalAlpha = globalAlpha;
				c.fill();
				c.globalAlpha = 1;
			}			
		}
	}	
	
	if (withFill) {
		// dotX = dotX2 for last interval when we have no line to draw between two points
		if (dotX != dotX2) {
			c.lineWidth = 2;
			c.stroke();
		}
	}				
				
	c.lineWidth = 1;		    
	if ((chartStyle == "normal") || (chartStyle == "soliddot") || (chartStyle == "hollowdot")) {			
	    drawDot(c, chartStyle, dotX, dotY, dotRadius, withFill);		
	} else if (chartStyle == "bowdot") {						
		drawBow(c, dotX, dotY, withFill);
	} else if (chartStyle == "anchordot") {		
		drawAnchor(c, dotX, dotY, withFill);
	} else if (chartStyle == "stardot") {		
		drawStar(c, dotX, dotY,  5, 5, 0.5, withFill);		
	}
      	
}

/**** end line chart utilities****/
/*
 * Json must contain as mandatory only "data" attribute 
 * 
 * type -> piechart
 * message -> can have two markups #val for value, #percent for percent and #total for total value
 *         -> can contain <br> to split text on more lines
 * title.alignment -> center, left, right
 * onClick -> is a javascript function like 'function doClick(value){ ...}'  *            
 * 
 * { "type": "pie",  *   
 *   "background" : "white",
 * 	 "data": [[ 16, 66, 24, 30, 80, 52 ]], 
 *   "labels": ["JANUARY","FEBRUARY","MARCH","APRIL","MAY", "JUNE"],     
 *   "color": ["#004CB3","#A04CB3", "#7aa37a", "#f18e9f", "#90e269", "#bc987b"],   
 *   "alpha" : 0.8,  *    
 *   "message" : "Value \: #val",  *    
 *   "title" : {
 *   	"text": "Analiza financiara", 
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "#000000",
 *      "alignment":"left"
 *   },    
 *   "xData" : {
 *   	"font": {
 *   		"weight": "bold", 
 *   		"size": "16", 
 *   		"family": "sans-serif"
 *   	}, 
 *   	"color": "blue"
 *   },
 *   "tooltipPattern" : {
 *   	"decimals": 2,
 *   	"decimalSeparator" : ".",
 *      "thousandSeparator" : ","
 *   },
 *   "onClick : "function doClick(value){console.log("Call from function: " + value);}"
 * }
 * 
 */

var pieChart = function(myjson, idCan, idTipCan, canWidth, canHeight) {

var obj;
var data;
var labels; 
var globalAlpha;
var background;
var message;
var chartType;
var seriesColor;
var titleSpace = 0;
var realWidth;
var realHeight;
var canvas;  
var c; 
var tipCanvas;
var H = 6;
var line = 20;
var hline = 5;
var resizeWidth = false;
var resizeHeight = false;

function drawPie(myjson, idCan, idTipCan, canWidth, canHeight) {	
			
	canvas = document.getElementById(idCan);  
	tipCanvas = document.getElementById(idTipCan);
	c = canvas.getContext('2d');
	
	obj = myjson;
	chartType = obj.type;
	if (typeof chartType === "undefined") {
	    chartType = "pie";
	}		
					
	background = obj.background;
	if (typeof background === "undefined") {	
		background = "white";
	}			
	
	data = obj.data[0];	
	
	labels = obj.labels; 			
	
	globalAlpha = obj.alpha;
	if (typeof globalAlpha === "undefined") {
        globalAlpha = 0.8;
    }
			
	message = obj.message;
	if (typeof message === "undefined") {		
		message = "#val / #total<br>#percent% of 100%";		
	}
					
	seriesColor = obj.color;
	if (typeof seriesColor === "undefined") {
		seriesColor = distinctHexColors(data.length);
    }    
	// if less colors than data are specified, append more of them
	if (seriesColor.length < data.length) {
		seriesColor = seriesColor.concat(distinctHexColors(data.length-seriesColor.length));
	}
        										
	updateSize(canWidth, canHeight);
    
    canvas.addEventListener('mousemove', 
			function(evt) { 
				var hme = Object.create(handleMouseEvent);
				hme.mousePos = getMousePos(canvas, evt);				
				hme.tooltip = getTooltip(hme.mousePos);		
				hme.execute(canvas, tipCanvas, evt); 
			}, 
			false);     
    
    canvas.addEventListener ("mouseout", 
    		function(evt) {
    			tipCanvas.style.left = "-2000px";
    		}, 
    		false);
    
    canvas.addEventListener("click", onClick, false);
       
    if (resizeWidth || resizeHeight) {
    	window.addEventListener('resize', resizeCanvas, false);
    }

	drawChart();
}

function updateSize(canWidth, canHeight) {
	if (canWidth !== undefined) {
		if (isPercent(canWidth)) {
			var percent = canWidth.substring(0, canWidth.length-1);			
			//canvas.width = window.innerWidth*percent/100;
			var cl = canvas.parentNode;			
			canvas.width = cl.offsetWidth*percent/100;				
			resizeWidth = true;
		} else {
			canvas.width = canWidth;
		}
	}	 
	if (canHeight !== undefined) {
		if (isPercent(canHeight)) {
			var percent = canHeight.substring(0, canHeight.length-1);
			canvas.height = window.innerHeight*percent/100;
			//var cl = canvas.parentNode;	
			//canvas.height = cl.offsetHeight*percent/100;
			resizeHeight = true;
		} else {
			canvas.height = canHeight;
		}
	}		
	realWidth = canvas.width;
	realHeight = canvas.height;	
}


function animDraw() {      
    if (drawIt(H)) {          		    
        return false;
    }    
    H += 1+(realHeight-titleSpace)/30;    
    window.requestAnimFrame(animDraw);      
}    


// function called repetitive by animation
function drawIt(H) {    		
	
	drawInit();
					
	var stop = drawData(true, false, "");		
	 				
	return stop;
}

// withFill = false means to construct just the path needed for tooltip purposes
function drawData(withFill, withClick, mousePos) {
	var font = c.font;
	    
	//draw data 
	c.lineWidth = 1.0;
	var stop = true;	
	
	var pieData = [];
	var cx = realWidth-2*getMaxLabelWidth()-2*line-20;
	var cy = realHeight-titleSpace-getLabelHeight()-2*line-20;
	var center = [realWidth / 2, (realHeight+titleSpace) / 2];	
	var radius = Math.min(cx, cy) / 2;
	if (radius < 0) {
		radius = 20;
	}
	var total = 0;
	var lastPosition = 0;
	// total up all the data for chart
	for (var i in data) { total += data[i]; }
	
	if (radius < H) {
        H = radius;
    } else {
        stop = false;
    } 
	
	// populate arrays for each slice
	for(var i in data) {
		pieData[i] = [];
		pieData[i]['value'] = data[i];
		var percent = data[i]*100/total;		
		pieData[i]['percent'] = Math.round(percent*100)/100;
		pieData[i]['startAngle'] = 2 * Math.PI * lastPosition;
		pieData[i]['endAngle'] = 2 * Math.PI * (lastPosition + (data[i]/total));
		pieData[i]['labelAngle'] = pieData[i]['startAngle'] + Math.abs(pieData[i]['endAngle']-pieData[i]['startAngle'])/2;
		pieData[i]['middle'] = [center[0]+H*Math.cos(pieData[i]['labelAngle']), center[1]+H*Math.sin(pieData[i]['labelAngle'])];
		lastPosition += data[i]/total;
	}
			    
	for(var i=0; i<data.length; i++) {  	  		 	  	    		   	    	    	    	     
	    
		if (withFill) {
		    var gradient = c.createLinearGradient( 0, 0, realWidth, realHeight );
			gradient.addColorStop( 0, "#ddd" );
			gradient.addColorStop( 1, seriesColor[i] );
	
			// draw slices
			c.beginPath();
			if (pieData.length > 1) {
				c.moveTo(center[0],center[1]);
			}				
			c.arc(center[0],center[1],H,pieData[i]['startAngle'],pieData[i]['endAngle'],false);
			if (pieData.length > 1) {
				c.lineTo(center[0],center[1]);
			}
			c.closePath();
			c.fillStyle = gradient;
			c.fill();			
			c.lineWidth = 1;
			c.strokeStyle = "#fff";
			c.stroke();	  			
		
			// draw Labels	
			if (typeof labels !== "undefined") {
				drawLabels(i, pieData);
			}
			
		} else {
	    		    		    	
	    	var fromCenterX = mousePos.x - center[0];
			var fromCenterY = mousePos.y - center[1];
			var fromCenter = Math.sqrt(Math.pow(Math.abs(fromCenterX), 2) + Math.pow(Math.abs(fromCenterY), 2 ));

			if (fromCenter <= radius) {
				var angle = Math.atan2(fromCenterY, fromCenterX);
				if (angle < 0) angle = 2 * Math.PI + angle; // normalize

				for (var slice in pieData) {
					if (angle >= pieData[slice]['startAngle'] && angle <= pieData[slice]['endAngle']) {
						var tValue = pieData[slice]['value'];						
			    		if (obj.tooltipPattern !== undefined) {
			    			tValue = formatNumber(tValue, obj.tooltipPattern.decimals, obj.tooltipPattern.decimalSeparator, obj.tooltipPattern.thousandSeparator);
			    		}	  		
			    		var returnValue;
			    		if (labels === undefined) {
			    			returnValue = "";
			    		} else {
			    			returnValue = labels[slice]; // tValue
			    		}
			    		if (withClick) {
			    			return returnValue;
			    		} else {
					    	var mes = String(message).replace('#val', tValue);
					    	mes = mes.replace('#total', total);
					    	mes = mes.replace('#percent', pieData[slice]['percent']);
					    	if (obj.onClick !== undefined) {
					    		canvas.style.cursor = 'pointer';
					    	}
					        return mes;
			    		}
					} else {
						canvas.style.cursor = 'default';
					}
				}
			}	
	    					   
	    }
	   
	}   	
		
	if (withFill) {
		return stop;
	} else {
		// empty tooltip message
		return "";
	}
}

function drawLabels(i, pieData) {
	var x = pieData[i]['middle'][0];
	var y = pieData[i]['middle'][1];
	var x1 = x + line*Math.cos(pieData[i]['labelAngle']);
	var y1 = y + line*Math.sin(pieData[i]['labelAngle']);	
	
	c.beginPath();
	c.moveTo(x, y);
	c.lineTo(x1, y1);
	
	var writeFrom = true;	
	if ((pieData[i]['labelAngle'] == Math.PI) || (pieData[i]['labelAngle'] == 2*Math.PI)) {
		// no horizontal line to draw	
		if ((pieData[i]['labelAngle'] == Math.PI) || (pieData.length == 1)) {
			writeFrom = false;
		}
	} else if (pieData[i]['labelAngle'] <= Math.PI/2) {		
		x1 = x1+hline;				
	} else if (pieData[i]['labelAngle'] < Math.PI) {
		x1 = x1-hline;
		writeFrom = false;
	} else if (pieData[i]['labelAngle'] <= 3*Math.PI/2) {
		x1 = x1-hline;
		writeFrom = false;
	} else if (pieData[i]['labelAngle'] < 2*Math.PI) {
		x1 = x1+hline;
	}
	c.lineTo(x1, y1);	
	
	c.strokeStyle = seriesColor[i];
	c.stroke();
	
	c.fillStyle = seriesColor[i];
	var fontHeight = 12;
	if (obj.xData !== undefined) {
		//c.fillStyle = obj.xData.color; 
		var b = " ";
		var xfont = obj.xData.font;
		fontHeight = xfont.size;
		c.font = xfont.weight + b + xfont.size + "px" + b + xfont.family;  
	} else {		
		c.font = "bold 12px sans-serif";
	}	   		
		
	if (writeFrom) {
		c.fillText(labels[i],x1+5, y1 + fontHeight/2);
	} else {
		var size = c.measureText(labels[i]).width+5;
		c.fillText(labels[i],x1-size, y1 + fontHeight/2);
	}
}


function drawInit() {
	
	var font = c.font;
	
	//draw background (clear canvas)
	c.fillStyle = background; 	
	c.fillRect(0,0,realWidth,realHeight);			

	//draw title		
	if (typeof obj.title !== "undefined") {
		var titleColor = obj.title.color;
		if (titleColor === undefined) {
			titleColor = '#000000';
		}
		c.fillStyle = titleColor;
		var b = " ";
		var f = obj.title.font;
		if (f === undefined) {
			f.weight = "bold";
			f.size = 12;
			f.family = "sans-serif";
		}
		c.font = f.weight + b + f.size + "px" + b + f.family;   		
		titleSpace = +20 + +f.size;
		 
		var alignment = obj.title.alignment;
		if (alignment === undefined) {
			alignment = "center";
		}
		var xTitle;
		if (alignment == "left") {
			xTitle = hStep;
		} else if (alignment == "right") {
			xTitle = canvas.width - c.measureText(obj.title.text).width - 10;
		} else {
			// center
			xTitle = canvas.width/2- c.measureText(obj.title.text).width/2;
		}				
		
		c.fillText(obj.title.text, xTitle , 20+titleSpace/2 );    
		c.font = font;   				
	} else {
		titleSpace = 0;
	}    
			
	c.font = font;   
}

function getTooltip(mousePos) {	
	return drawData(false, false, mousePos);	 	  	 
}      

function onClick(evt) {
	var v = drawData(false, true, getMousePos(canvas, evt));	
	if ((v !== "") && (obj.onClick !== undefined)) {		
		var f = obj.onClick;				
		eval(f);
		doClick(v);
	}	
	return v;
}

function drawChart() {	
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000/60);
              };
    })();                
            
    window.requestAnimFrame(animDraw); 
}  

function getTitleSpace() {
	var space = 0;
	if (typeof obj.title !== "undefined") {		
		var f = obj.title.font;
		if (f === undefined) {			
			f.size = 12;			
		}		      
		space = +20 + +f.size;  
	} 
	return space;
}

function getLabelHeight() {
	var fontHeight = 12;
	if (obj.xData !== undefined) {		
		fontHeight = obj.xData.font.size;		 
	}
	return fontHeight;
}

function getMaxLabelWidth() {
	if (typeof labels === "undefined") {
		return 0;
	}
	var font = c.font;
	var max = 0;	
	if (obj.xData !== undefined) {		 
		var b = " ";
		var xfont = obj.xData.font;
		fontHeight = xfont.size;
		c.font = xfont.weight + b + xfont.size + "px" + b + xfont.family;  
	} else {		
		c.font = "bold 12px sans-serif";
	}	   					
	for(var i=0; i<labels.length; i++) {   
		var size = c.measureText(labels[i]).width+5;		
		if (size > max) {
			max = size;
		}
	}
	c.font = font;	
	return max;
}

function resizeCanvas() {
	var w = canWidth;
	if (resizeWidth) {
		if (!isPercent(w)) {
			w = "100%";
		}
	}
	var h = canHeight;
	if (resizeHeight) {
		if (!isPercent(h)) {
			h = "100%";
		}
	}
	updateSize(w, h);
	drawChart();
}


drawPie(myjson, idCan, idTipCan, canWidth, canHeight);

};
function nextChart(myjson, idCan, idTipCan) {	
	var can = document.getElementById(idCan);
	var tipCan = document.getElementById(idTipCan);		
	nextChart(myjson, idCan, idTipCan, can.width, can.height);	
}

function nextChart(myjson, idCan, idTipCan, canWidth, canHeight) {			
	var chartType = myjson.type;
	if (typeof chartType === "undefined") {
	    chartType = "line";
	}		
	
	//zoom
	if ((canWidth === "100%") && (canHeight === "100%")) {
		var can = document.getElementById(idCan);
		can.width = $(window).width();
		can.height = $(window).height();	  
	}
	
	if (isBar(chartType)) {
		barChart(myjson, idCan, idTipCan, canWidth, canHeight);
	} else if (isPie(chartType)) {
		pieChart(myjson, idCan, idTipCan, canWidth, canHeight);	
	} else {
		lineChart(myjson, idCan, idTipCan, canWidth, canHeight);
	}		
}	

function isBar(chartType) {
	return (chartType == "bar") || (chartType == "hbar") || (chartType == "stackedbar") || (chartType == "hstackedbar");
}

function isLine(chartType) {
	return (chartType == "line") || (chartType == "area");
}

function isPie(chartType) {
	return (chartType == "pie");
}

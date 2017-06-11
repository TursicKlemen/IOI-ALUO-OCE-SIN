function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
        //alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
        //alert('ie');
        return true;
    }
    else  // If another browser, return 0
    {
        //alert("otherbroswer");
        return false;
    }        
    return false;
}

var scalefactor = 4;
var canvas = document.getElementById('technogram');
var ctx = canvas.getContext('2d');
var intersectionRadius = 7;
var xoffset = 120;
var textoffset = 40;
var canvasWidth = canvas.width - xoffset;
var canvasHeight = canvas.height;

var setted = false;
var startLoc = -1;
var startLocName = "";        
var newStartLoc = -1;
var newStartLocName = "";

var oldOper = 0;
var newOper = 0;

var oldOperStack = 0;

var procesi = "";
var stroj = "";
var stroj_id = 0;
var extensions = {};
var extensions_cat = {};

var firstNode = true;
var machineSlika = "";

var verStep = 0;
//tukaj shrani ext id -> skupaj; 2, 3, 4,...

//vse operacije -> seznam
var operAll = {};
var ext_calc_data = {};
var mach_calc_data = {};

var msie = msieversion();

var i=1;

$( document ).ready(function() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
});
//$( document ).ready(function() {
   //spremenljivke - risanje         
         ctx.setLineDash([5, 5]);
         ctx.lineWidth = 2;
         ctx.strokeStyle = 'rgba(128,128,128, 0.5)';
         ctx.beginPath();
         ctx.moveTo(xoffset + canvasWidth / 10 + 0 * canvasWidth / 5, canvasHeight * 1 / 10);
         ctx.lineTo(xoffset + canvasWidth / 10 + 0 * canvasWidth / 5, 3 * canvasHeight / 10);
         ctx.stroke();
         ctx.closePath();
         
         //draw vertical dotted lines
         for (var k = 0; k < 5; k++) {
         	ctx.beginPath();
         	ctx.moveTo(xoffset + canvasWidth / 10 + k * canvasWidth / 5, canvasHeight * 3 / 10);
         	ctx.lineTo(xoffset + canvasWidth / 10 + k * canvasWidth / 5, 9 * canvasHeight / 10);
         	ctx.stroke();
         	ctx.closePath();
         }
         
         //draw horizontal dotted lines
         for (var k = 1; k < 5; k++) {
         	ctx.beginPath();
         	ctx.moveTo(xoffset + canvasWidth / 10, canvasHeight / 10 + k * canvasHeight / 5);
         	ctx.lineTo(xoffset + 9 * canvasWidth / 10, canvasHeight / 10 + k * canvasHeight / 5);
         	ctx.stroke();
         	ctx.closePath();
         }
         
         var odmikY = 20;
         //draw descriptions
         drawText1('Gozdni sestoj', xoffset + canvasWidth / 10, canvasHeight - odmikY);
         drawText1('Sečna pot', xoffset + canvasWidth * 3 / 10, canvasHeight - odmikY);
         drawText1('Gozdna vlaka', xoffset + canvasWidth * 5 / 10, canvasHeight - odmikY);
         drawText1('Gozdna cesta', xoffset + canvasWidth * 7 / 10, canvasHeight - odmikY);
         drawText1('Končni uporabnik', xoffset + canvasWidth * 9 / 10, canvasHeight - odmikY);
         
         drawText1('Stoječe drevo', textoffset, canvasHeight / 10);
         drawImg("tree.png", {"x":xoffset, "y":(canvasHeight / 10)});

         drawText1('Podrto drevo (dolg les s krošnjo)', textoffset, canvasHeight * 3 / 10);
         drawImg("treeDown.png", {"x":xoffset, "y":(canvasHeight * 3 / 10)});
         
         drawText1('Deblovina', textoffset, canvasHeight * 5 / 10);
         drawImg("treeTrunk.png", {"x":xoffset, "y":(canvasHeight * 5 / 10)});
         
         drawText1('Sortimenti / Mnokratniki', textoffset, canvasHeight * 7 / 10);
         drawImg("treeCut.png", {"x":xoffset, "y":(canvasHeight * 7 / 10)});
         
         drawText1('Sekanci / Drva', textoffset, canvasHeight * 9 / 10);
         drawImg("treeFin.png", {"x":xoffset, "y":(canvasHeight * 9 / 10)});
         
         ctx.setLineDash([0]);
         //Draw dots
         for (var l = 0; l < 5; l++) {
         	for (var m = 0; m < 5; m++) {
         		if (l === 0 && m > 0) {
         			continue;
         		}
         		ctx.beginPath();
         		ctx.fillStyle = 'rgba(54,136,38, 0.5)';
         		ctx.arc(xoffset + canvasWidth / 10 + m * canvasWidth / 5, canvasHeight / 10 + l * canvasHeight / 5, intersectionRadius, 0, Math.PI * 2, true);
         		ctx.closePath();
         		ctx.fill();
         	}
         }
         
   //main
   resetPGB();

//}); //konec document.ready



//--------------------- risanje
  //function drawTechnogram(scalefactor){


         function drawText1(text, PTx, PTy) {
         	fontSize = 12 * scalefactor / 4;
         	ctx.font = fontSize + "px Helvetica";
         	ctx.fillStyle = "#000";
         	ctx.textAlign = "center";
         	splitText(text, 15, PTx, PTy);
         }

         function splitText(text, maxLineLength, PTx, PTy) {
         	first = true;
         	if (text.length <= maxLineLength) {
         		ctx.fillText(text, PTx, PTy);
         		return (text);
         	} else {
         		var splitTextIn = text.split(" ");
         		var newText = "";
         		var newLine = "";
         		splitTextIn.forEach(function(entry) {
         			if ((newLine + entry).length <= maxLineLength) {
         				if (first) {
         					newLine += entry;
         					first = false;
         				} else {
         					newLine += " " + entry;
         				}
         			} else {
         				ctx.fillText(newLine, PTx, PTy);
         				PTy += 12 * scalefactor / 4;
         				newText += newLine + "\n";
         				newLine = entry;
         			}
         		});
         		ctx.fillText(newLine, PTx, PTy);
         		newText += newLine;
         		return newText;
         	}
         }

         function drawPoints(location, operation) {
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.strokeStyle = "black";
            ctx.setLineDash([0]);
            ctx.lineWidth = 1;
            ctx.arc(xoffset + canvasWidth / 10 + location * canvasWidth / 5, canvasHeight / 10 + operation * canvasHeight / 5, intersectionRadius + 5, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
         }
        //drawLine(2, 1, 3, 1, true);
       //drawPoints(1, 2, ctx);drawPoints(1, 3, ctx);
       /*drawLine(0, 0, 0, 2, true, false);
       drawLine(0, 2, 4, 2, false, true);*/
       function drawLine(fromX, fromY, toX, toY, showStartDot, showArrow, image) {                  
                    
                    var lineWidthFactor = 1.5;
                    var arrowWidthEnlarge = 10;

                    if (toX > fromX && toY > fromY) {
                        //Both directions change... for this we will have to use viaPoint

                    } else if (toX > fromX) {
                        //We move in x direction
                        ctx.beginPath();
                        ctx.fillStyle = "green";
                        ctx.setLineDash([0]);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "black";
                        
                        rectX = xoffset + canvasWidth / 10 + fromX * canvasWidth / 5;
                        rectY = canvasHeight / 10 + fromY * canvasHeight / 5 - intersectionRadius / lineWidthFactor;
                        rectWidth = (toX - fromX) * canvasWidth / 5 - intersectionRadius * 2;
                        rectHeight = intersectionRadius * lineWidthFactor;                        
                        ctx.rect(rectX, rectY, rectWidth, rectHeight);                        
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();
                        
                        
                        if(showStartDot){
                            drawPoints(fromX, fromY);
                        }

                        if (showArrow) {
                            drawSvg(image, getMachineDrawingPoint({"x":fromX, "y":fromY}, {"x":toX, "y":toY}), true);
                            drawPoints(toX, toY);
                            ctx.fillStyle = "green";
                            ctx.setLineDash([0]);
                            ctx.lineWidth = 0.5;
                            ctx.strokeStyle = "black";
                        
                            x = rectX + rectWidth - arrowWidthEnlarge / 2;
                            y = canvasHeight / 10 + fromY * canvasHeight / 5;
                            a = intersectionRadius * 2 + arrowWidthEnlarge;
                            triangle(x, y, a, 0); 
                        }
                        //canvas.sendToBack(rect);

                    } else {
                        //We move in y direction
                        ctx.beginPath();
                        ctx.fillStyle = "green";
                        ctx.setLineDash([0]);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "black";
                        
                        rectX = xoffset + canvasWidth / 10 + fromX * canvasWidth / 5 - (intersectionRadius / lineWidthFactor) - 1;
                        rectY = canvasHeight / 10 + fromY * canvasHeight / 5 + intersectionRadius / lineWidthFactor;
                        rectWidth = intersectionRadius * lineWidthFactor;
                        rectHeight = (toY - fromY) * canvasHeight / 5 - intersectionRadius * 2 + 14;                        
                        ctx.rect(rectX, rectY, rectWidth, rectHeight);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        
                        
                        if(showStartDot){
                            drawPoints(fromX, fromY);//location, operation
                        }

                        if (showArrow) {
                            drawSvg(image, getMachineDrawingPoint({"x":fromX, "y":fromY}, {"x":toX, "y":toY}));
                            drawPoints(toX, toY);//location, operation
                            ctx.fillStyle = "green";
                            ctx.setLineDash([0]);
                            ctx.lineWidth = 0.5;
                            ctx.strokeStyle = "black";
                        
                            //x = rectX - arrowWidthEnlarge / 2;
                            x = rectX + rectWidth - arrowWidthEnlarge / 2;
                            y = rectY + (rectHeight - 14) - intersectionRadius;
                            a = intersectionRadius * 2 + arrowWidthEnlarge;
                            triangle(x, y, a, 90); 

                        }


                    }
                }
                
                

            
            function triangleLong(x, y, a, rotate){
                ctx.save();
                ctx.translate(x, y);
            
                ctx.rotate(rotate * Math.PI / 180);
                ctx.beginPath();
            
                ctx.moveTo(0,0-(a/2));
                ctx.lineTo(a,0);
                ctx.lineTo(0,a/2);
                ctx.fill();
                ctx.closePath();
                /*ctx.rotate(-rotate * Math.PI / 180);
                ctx.translate(-x,-y);*/
                ctx.restore();
              
                
            }

        function triangle(x, y, a, rotate){
            ctx.save();            
            ctx.translate(x, y);            
            ctx.rotate(rotate * Math.PI / 180);
            ctx.beginPath();
            ctx.moveTo(0,0-(a/2));
            ctx.lineTo(a/2,0);
            ctx.lineTo(0,a/2);            
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            /*ctx.rotate(-rotate * Math.PI / 180);
            ctx.translate(-x,-y);*/
            ctx.restore();
        }
        
    function getMachineDrawingPoint(startLocationPoint, endLocationPoint) {
		return {"x":(endLocationPoint.x + startLocationPoint.x + 2) / 2 - 1, "y":((endLocationPoint.y + startLocationPoint.y + 2) / 2 - 1)};
	}

	function drawSvg(url, locationPoint, horizontal) {
       if (horizontal === undefined) {
         horizontal = false;
       }
        var img = new Image();
          
        //console.log(img);
        img.onload = function() {
            /*console.log(img.height);
            console.log(img.width);*/
            //console.log("risem");
            //ctx.scale(3 * (scalefactor / 4) / 2, 3 * (scalefactor / 4) / 2);
            ctx.save();
            /*koef = 15;
            ctx.scale(1/koef, 1/koef);
            x = (xoffset + canvasWidth / 10 + locationPoint.x * canvasWidth / 5 + intersectionRadius * 2)*koef;
            y = (canvasHeight / 10 + locationPoint.y * canvasHeight / 5 - intersectionRadius - 25)*koef;*/
            x = (xoffset + canvasWidth / 10 + locationPoint.x * canvasWidth / 5 + intersectionRadius * 2);
            y = (canvasHeight / 10 + locationPoint.y * canvasHeight / 5 - intersectionRadius - 25);
            
            sizeImg = 55;
            if(img.width < img.height){
                sirina = ((img.width/img.height)*sizeImg);
                visina = sizeImg;
            }
            else{
                sirina = sizeImg+10;
                visina = ((img.height/img.width)*(sizeImg+10));
            }
            /*if(horizontal){
                y -= visina/2;
            }*/
            if(horizontal){
                y -= img.height/2;
            }
            /*console.log(img);
            console.log(x);
            console.log(y);
            console.log("sirina: "+sirina);
            console.log("visina: "+visina);*/
            if(isNaN(visina) || visina == 0){
                visina=50;
                //console.log("spremenjena visina");
            }
            /*console.log(img);
            console.log(x);
            console.log(y);*/
            /*console.log("sirina: "+sirina);
            console.log("visina: "+visina);*/
            
            /*console.log("sirina slike: "+img.width);
            console.log("visina slike: "+img.height);
            img.width=sirina;
            img.height=visina;
            console.log(img);*/
            /*console.log(img);
             console.log("sirina slike: "+img.width);
            console.log("visina slike: "+img.height);*/
            ctx.drawImage(img, x, y);
            //ctx.translate((xoffset + canvasWidth / 10 + locationPoint.x * canvasWidth / 5 + intersectionRadius * 2), (canvasHeight / 10 + locationPoint.y * canvasHeight / 5 - intersectionRadius - 25));
            ctx.restore();
            //ctx.scale(1, 1);
        };
        //img.src = "img/chainsaw.svg";
        //img.src = "img/"+url;
        img.src = "img/"+url;   
	}
    
    function drawImg(url, locationPoint) {
        var img = new Image();
        img.onload = function() {
            //ctx.scale(3 * (scalefactor / 4) / 2, 3 * (scalefactor / 4) / 2);
            ctx.save();
            /*visina = 70;
            ctx.drawImage(img, locationPoint.x-visina/2, locationPoint.y-visina/2, (img.width/img.height)*visina, visina);*/
            maxSize = 55;
            if(img.height < img.width){ //slikica je bolj visoka kot širša
                ctx.drawImage(img, locationPoint.x-maxSize/2, locationPoint.y-maxSize/2, maxSize, (img.height/img.width)*maxSize);
            }
            else{//slikica je bolj široka kot visoka
                ctx.drawImage(img, locationPoint.x-maxSize/2, locationPoint.y-maxSize/2, (img.width/img.height)*maxSize, maxSize);
            }
            ctx.restore();
        };
        //img.src = "img/chainsaw.svg";
        img.src = "img/"+url;        
	}
        
 
        //drawTechnogram(4);
        //drawLine(0, 2, 4, 2, true, true);
        
        
       ///////////////////////////////////////////////////////////////////////////////////////////////////// main prog:
        
      
       
        //Listener za izbor mesta začetka
        $("#procStart .btn-group button").on("click", function(){            
            startLoc = $(this).data("value");
            startLocName = $(this).text();
            newStartLoc = startLoc;
            newStartLocName = startLocName;            
            
            correctDestinations();
            
            parent = $(this).parents().find("div#procStart");
            
            if(msie){ //IE fix
                $(this).parents().find("div#procStart").fadeOut(100, function(){
                    $("#operation").fadeIn(100);                
                    setNextPGB();
                    $("#backward").show();
                });
            }
            else{
                parent.fadeOut(100, function(){
                    $("#operation").fadeIn(100);                
                    setNextPGB();
                    $("#backward").show();
                });
            }            
            
            if($("#operation .btn-group button.btn-danger").length > 0){
                $("#operNext").show();
            }
            showOperNext();
            if(startLoc > 0){
                $("#operation button[data-value='0']").prop('disabled', true);
                $("#operation button[data-value='0']").removeClass("btn-danger").addClass("btn-success");
                oldOper = 1;
                newOper = 1;
            }
            else{
                $("#operation button[data-value='0']").prop('disabled', false);
                oldOper = 0;
                newOper = 0;
            }
        });
        
        
        $("#procEnd .btn-group button").on("click", function(){
            $("#procEnd .btn-group button.btn-danger").removeClass("btn-danger").addClass("btn-success");
            
            $(this).toggleClass("btn-success");
            $(this).toggleClass("btn-danger");
            $(this).data("opch", true);
            
            showOperNext();
            
            //console.log("clicked "+$(this).data("value"));           
            /*parent = $(this).parents().find("div#procEnd");
            var stroji = $("#stroji");
            stroji.children().remove();
            
            var izberi = document.createElement('option');  
            izberi.innerHTML = "Izberite stroj";
            izberi.value = -1;                    
            stroji.append(izberi);
            
            //Nafilaj seznam
            var index = 0;
            for (var prop in spravilo) {
                var option = document.createElement('option');  
                option.innerHTML = spravilo[prop];
                option.value = index;                    
                stroji.append(option);
                index++;
            }
            
            //prikaži izbor strojev
            parent.fadeOut(100, function(){
                $("#stroj").fadeIn(100);
                setNextPGB();
            });*/
        });
        
        //Listener za izbor operacij
        $("#operation .btn-group button").on("click", function(){            
            $(this).toggleClass("btn-success");
            $(this).toggleClass("btn-danger");
            $(this).data("opch", true);            
            if ($(this).data("value") == 4){
                if($(this).hasClass("btn-danger")){
                    $("#procEnd").fadeIn(100);                    
                }
                else{
                    $("#procEnd").fadeOut(100); 
                }
            }
            showOperNext();            
            
        });
        
        function correctDestinations(){
            $("#operation button").prop('disabled', false);

            for(jOpMover=0; jOpMover<oldOper; jOpMover++){
                $("#operation button[data-value='"+jOpMover+"']").prop('disabled', true);
                $("#operation button[data-value='"+jOpMover+"']").removeClass("btn-danger").addClass("btn-success");
            }            
            
            if(startLoc == 4){
                $("#operation button[data-value='4']").prop('disabled', true);
                $("#operation button[data-value='4']").removeClass("btn-danger").addClass("btn-success");
            }
            else{
                $("#operation button[data-value='4']").prop('disabled', false);
            }
            
            if( $("#operation button[data-value='4']").hasClass("btn-danger")){
                $("#procEnd").fadeIn(100);                    
            }
            else{
                $("#procEnd").fadeOut(100); 
            }
            
            $("#procEnd button").prop('disabled', false);            
            for(jMover=0; jMover<=startLoc; jMover++){
                $("#procEnd button[data-value='"+jMover+"']").prop('disabled', true);
                $("#procEnd button[data-value='"+jMover+"']").removeClass("btn-danger").addClass("btn-success");
            }           

        }
        
        
        //potrditev izbranih operacij in premik na izbor stroja
        function nextWithOper(){//debugger;
            procesi = "";
            //parent = $(this).parents().find("div#operation");
            setted = false;
            parent = $("div#operation");
            
            /*if($(this).data("value") == 4){
                //Prikaži mesto konca procesa - izbrano je bilo spravilo/transport
                parent.fadeOut(100, function(){
                    $("#procEnd").fadeIn(100);
                });
            }
            else{  */                              
            var secnja = checkButtonOper(0);
            var klescenje = checkButtonOper(1);
            var krojenje = checkButtonOper(2);
            var sekanci = checkButtonOper(3);
            var spravilo = checkButtonOper(4);
            
            var secnaPot = checkButtonProcEnd(1, spravilo);
            var gozdnaVlaka = checkButtonProcEnd(2, spravilo);
            var gozdnaCesta = checkButtonProcEnd(3, spravilo);
            var koncniUp = checkButtonProcEnd(4, spravilo);
                        
            if(checkButtonOper("4") == 1){            
                newStartLoc = $("#procEnd .btn-group button.btn-danger").data("value");
                newStartLocName = $("#procEnd .btn-group button.btn-danger").text();
                var dest = ["0", "0", "0", "0", "0"];
                for(var zacI=startLoc; zacI<=newStartLoc; zacI++){
                    dest[zacI] = "1";
                }
                secnaPot = dest[1];
                gozdnaVlaka = dest[2];
                gozdnaCesta = dest[3];
                koncniUp = dest[4];
           }
           
            
            procesi = makeStringProces(secnja, klescenje, krojenje, sekanci, spravilo);
            //secnja, klescenje, krojenje, sekanci, secnaPot, gozdnaVlaka, gozdnaCesta, koncniUp
            getMachines(secnja, klescenje, krojenje, sekanci, secnaPot, gozdnaVlaka, gozdnaCesta, koncniUp);
            
            //prikaži izbor strojev
            $("#procEnd").fadeOut(100);
            
            if(msie){ //IE fix
                $("div#operation").fadeOut(100, function(){
                  $("#stroj").fadeIn(100);
                  $("#backward").fadeIn(100);
                  $("#operNext").hide();
                  setNextPGB();
              });
            }
            else{
               parent.fadeOut(100, function(){
                  $("#stroj").fadeIn(100);
                  $("#backward").fadeIn(100);
                  $("#operNext").hide();
                  setNextPGB();
              });
            }        
            
           // }
           
        }
        
        function makeStringProces(secnja, klescenje, krojenje, sekanci, spravilo){
            rezultat = "";
            firstProc = true;
            firstOper = -1;
            
            oldOperStack = oldOper;
            
            if(secnja == 1){
                rezultat += "Sečnja";
                firstProc = false;
                newOper = 1;
                firstOper = 0;
            }
            if(klescenje == 1){            
                if(!firstProc){
                    rezultat += ", ";                    
                }
                else{
                    firstOper = 1;
                }
                rezultat += "Kleščenje";
                firstProc = false;
                newOper = 2;
            }
            if(krojenje == 1){            
                if(!firstProc){
                    rezultat += ", ";                    
                }
                else{
                    firstOper = 2;
                }
                rezultat += "Krojenje";
                firstProc = false;
                newOper = 3;
            }
            if(sekanci == 1){            
                if(!firstProc){
                    rezultat += ", ";                    
                }
                else{
                    firstOper = 3;
                }
                rezultat += "Sekanci";
                firstProc = false;
                newOper = 4;
            }
            if(spravilo == 1){            
                if(!firstProc){
                    rezultat += ", ";
                }
                rezultat += "Spravilo/transport";
                firstProc = false;
            }
            
            if(verStep === 0){
                if(newOper > 1){                    
                    if(firstOper != newOper && firstOper > -1){//preverjanje če imamo več kot eno operacijo
                        oldOper = firstOper;
                    }
                    else{
                        oldOper = newOper-1;
                    }
                }
                if(oldOper === 0 && newOper === 0 && newStartLoc > 0){ //izbrana ni nobena operacija, samo premik
                    oldOper = 1;
                    newOper = 1;
                }
                //debugger;
                //premik stroja brez operaije -> oldOper newOper firstOper startLoc newStartLoc
                //1 0 -1 1 3
                //0 1 0 0 3
                //console.log("oldOper: "+oldOper+" newOper: "+newOper+" firstOper"+firstOper+" startLoc: "+startLoc+" newStartLoc: "+newStartLoc);
                /*if(oldOper === 0 && newOper === 0 && newStartLoc > 0){ //izbrana ni nobena operacija, samo premik
                    oldOper = 1;
                    newOper = 1;
                }*/
                
                //if(((oldOper > 0 && newOper < 1) || oldOper === 0) && newStartLoc > 0){
                    //preverjanje če je narejen premik brez operacije hkrati pa je izbrana lokacija višja od gozdnega sestoja
                    /*if(firstOper > -1){
                        oldOper = firstOper;
                        //newOper je že nastavljen
                    }
                    else{
                        oldOper = 1;
                        newOper = 1;
                    }  */                  
                  /*  oldOper = 1;
                    newOper = 1;
                }*/
                
            }
            
            return rezultat;
        }
        
        function checkButtonOper(num){
            return $("#operation .btn-group button.btn-danger[data-value='"+num+"']").length > 0 ?"1":"0";
        }
        
        function checkButtonProcEnd(num, spravilo){
            if(spravilo == 1){
                return $("#procEnd .btn-group button.btn-danger[data-value='"+num+"']").length > 0 ?"1":"0";
            }
            else{
                return "0";
            }
            
            
        }
        
        function showOperNext(){
            if($("#operation .btn-group button.btn-danger").length > 0){
                if(checkButtonOper(4) == 1){
                    if($("#procEnd .btn-group button.btn-danger").length > 0){
                        $("#operNext").show();
                    }
                    else{
                        $("#operNext").hide();
                    }    
                }
                else{
                     $("#operNext").show();
                }
            }
            else{
                $("#operNext").hide();
            }
        }
        
        
        function nextWithMachine(){
            $("#stroj").fadeOut(100);
            $("#toProcess").fadeOut(100);
            hideNadgradnja();
            resetPGB();
            konecPGB();
            
            var highest = null;
            
            var all_ext_ids = [];            
            //vsi extensioni
            for(extLBL=1; extLBL<=6; extLBL++){
                extIzbran = $("#nadgradnje"+extLBL+" option:selected");
                if(extIzbran.val() >= 0){
                    extensions[extLBL] = extIzbran.val();
                    all_ext_ids.push(extIzbran.val());
                    extensions_cat[extIzbran.data("cat_ext")] = extLBL;
                    //highestCat = extLBL;
                    highest = extIzbran.val();
                }               
            }
            //console.log(all_ext_ids);
            str_ext_cat = "";
            str_ext_c_first = true;
            $.each(extensions_cat, function(key,value) {
                if(!str_ext_c_first){
                    str_ext_cat += " ";
                }
                str_ext_cat += key;
                str_ext_c_first = false;
            });
            
            
            //Pridobi storilnosti stroj, največji extension -> zaradi stroilnosti in pa vse kategorije extensionu
            getStorilnost(stroj_id, highest, str_ext_cat, all_ext_ids);
            
            if(newOper == 4 && newStartLoc == 4){
                $("#newProcess").fadeOut(100);                
                setNextPGB();
            }
            $("#backward").fadeOut(100);
            okvir = $("#contVerigaProc");
            okvir.show();
            $("#gorivoCena").show();
        }
        
        //Listener za izbor stroja
        $("#stroji").on("change", function(){
            stroj = "";
            extensions = {};
            extensions_cat = {};
           
            if($('option:selected',this).val() > 0){                
                stroj = $('option:selected',this).text();
                stroj_id = $('option:selected',this).val();
                kategorija = $('option:selected',this).data("kategorija");
                dodatek = $('option:selected',this).data("dodatek");
                /*var nadgradnje = $("#nadgradnje1");
                nadgradnje.children().remove();*/
                $("#nadgradnja").fadeOut(100);
                var nadgradnjeLBL = $(".nadgradnjaLBL");
                var nadgradnjeCL = $(".nadgradnjaCL");
                nadgradnjeCL.hide();
                nadgradnjeLBL.hide();
                nadgradnjeCL.empty();
                
                
                //filtriranje glede na lokacijo
                var dest = ["0", "0", "0", "0", "0"];
                for(var zacI=startLoc; zacI<=newStartLoc; zacI++){
                    dest[zacI] = "1";
                }
                secnaPot = dest[1];
                gozdnaVlaka = dest[2];
                gozdnaCesta = dest[3];
                koncniUp = dest[4];
                //console.log(dest);
                
                var secnja = checkButtonOper(0);
                var klescenje = checkButtonOper(1);
                var krojenje = checkButtonOper(2);
                var sekanci = checkButtonOper(3);
                var spravilo = checkButtonOper(4);
                
                
                getUpgrades(stroj_id, 1, secnja, klescenje, krojenje, sekanci, spravilo, secnaPot, gozdnaVlaka, gozdnaCesta, koncniUp, kategorija==1?dodatek:-1);//Drobno orodje in osebna var. opr.
                getUpgrades(stroj_id, 2, secnja, klescenje, krojenje, sekanci, spravilo, secnaPot, gozdnaVlaka, gozdnaCesta, koncniUp, kategorija==2?dodatek:-1);//Gozdarska nadgradnja
                getUpgrades(stroj_id, 3, secnja, klescenje, krojenje, sekanci, spravilo, secnaPot, gozdnaVlaka, gozdnaCesta, koncniUp, kategorija==3?dodatek:-1);//Verige
                getUpgrades(stroj_id, 4, secnja, klescenje, krojenje, sekanci, spravilo, secnaPot, gozdnaVlaka, gozdnaCesta, koncniUp, kategorija==4?dodatek:-1);//Vitli
                getUpgrades(stroj_id, 5, secnja, klescenje, krojenje, sekanci, spravilo, secnaPot, gozdnaVlaka, gozdnaCesta, koncniUp, kategorija==5?dodatek:-1);//Tritočkovni vitli, izvlečne klešče in prikolice
                getUpgrades(stroj_id, 6, secnja, klescenje, krojenje, sekanci, spravilo, secnaPot, gozdnaVlaka, gozdnaCesta, koncniUp, kategorija==6?dodatek:-1);//Sekalniki, cepilniki in rezalno cepilni stroji
                
                /*if(kategorija){
                    okvirNadgr = $("#nadgradnje"+kategorija);
                    okvirNadgr.val(dodatek);
                    console.log("test");
                }*/
            }
            else{               
                $("#toProcess").hide();
                hideNadgradnja();                
            }            
        });
        
        //Listener za izbor nadgradnje
       /*$("#nadgradnje1").on("change", function(){
            nadgrSel = $('option:selected',this).val();
            if(nadgrSel >= 0){
                var index = extensions.indexOf(nadgrSel);
                if(index >= 0){
                    extensions.splice(index, 1);
                }
                extensions[extensions.length]= $('option:selected',this).val();
            }*/
            /*                       
            if($('option:selected',this).val() > 0){                
                stroj = $('option:selected',this).text();
                var nadgradnje = $("#nadgradnje");
                nadgradnje.children().remove();
                
                getUpgrades($('option:selected',this).val());               
                
            }
            else{               
                $("#toProcess").hide();
                hideNadgradnja();                
            }*/        
        /*});*/
        
        function endProcessing(){
            $("#mainPanel").fadeOut(100);
            $("#koncano").fadeIn(100);
            $("#podrobnoPanel").fadeIn(100);
            $("#skupniIzracun").fadeIn(100);
            $("#resetAndNewProcess").fadeIn(100);
            /*if(stroj_id == 8){
                getMachineCalc(8);
            }*/
            allOperIDs = [];
            attrs = {};
            
            finStrIzbrVer = 0; //Skupni stroški vseh strojev in priključkov za končni prikaz.
            finStrIzbrVerM3 = 0;
            for( var key in operAll ){              
                /*console.log(key+" "+data[key].id+" "+data[key].value);
                sel.append('<option value="' + data[i].id + '">' + data[i].desc + '</option>');*/
                //console.log("obj." + key + " = " + operAll[key]);
                //console.log(operAll[key]);
                
                //getMachineCalc(operAll[key].stroj_id, operAll[key].ime, operAll[key].strDela, operAll[key].slider);
                
                /*allOperIDs.push(operAll[key].stroj_id);
                attrs[operAll[key].stroj_id] = {"ime":operAll[key].ime, "strDela":operAll[key].strDela, "slider":operAll[key].slider};*/
                
                //Novi izracuni za masino
                matStrMachInExt = 0;
                
                machID = operAll[key].stroj_id;
                mData = mach_calc_data[machID];                
                
                fiksniStroskiAmortDoba = mData.nabVr/mData.amort+mData.delObrSr*mData.nabVr;
                fiksniStroskiUra = fiksniStroskiAmortDoba/mData.letRaba;
                strMazivaOdstotek = mData.strMaziva/100;
                varStrosGorivaInMaz = mData.pw*strMazivaOdstotek*mData.obremStroja*mData.povprPoraba*(mData.vrstaGoriva == 1?$("#fuel1").val():$("#fuel2").val());
                varStrosVzdrz = mData.nabVr*mData.facVzdrz/mData.zivlDoba;
                skupMatStr = fiksniStroskiUra+varStrosGorivaInMaz+varStrosVzdrz;
                matStrMachInExt += skupMatStr;
                                
                /*skupStrDProc = skupMatStr+operAll[key].strDela;//strošek dela * št delavcev
                skupStrDProcM3 = skupStrDProc/($("#"+operAll[key].slider).val());*/
                //console.log(response);
                $("#rezultati tbody").append('<tr><td><b>'+operAll[key].ime+'</b></td><td>'+
                                             formatD(fiksniStroskiAmortDoba)+'</td><td>'+
                                             formatD(fiksniStroskiUra)+'</td><td>'+
                                             formatD(varStrosGorivaInMaz)+'</td><td>'+
                                             formatD(varStrosVzdrz)+'</td><td>'+
                                             formatD(skupMatStr)+'</td><td class="'+key+'StrDela"><b>'+
                                             formatD(getIdentValue(operAll[key].str_dela_ident))+'</b></td><td class="'+key+'SkupStr"></td><td class="'+key+'SkupStrM3"></td></tr>');
                
                $("#podrobno tbody").append('<tr><td><b>'+operAll[key].ime+'</b></td><td>'+
                                             formatD(mData.pw)+'</td><td>'+
                                             formatD(mData.nabVr)+'</td><td>'+
                                             formatD(mData.zivlDoba)+'</td><td>'+
                                             formatD(mData.amort)+'</td><td>'+
                                             formatD(mData.letRaba)+'</td><td>'+
                                             getFuelType(mData.vrstaGoriva)+'</td><td>'+
                                             formatD(parseFloat(mData.facVzdrz),3)+'</td><td>'+
                                             formatD(fiksniStroskiAmortDoba)+'</td><td>'+
                                             formatD(fiksniStroskiUra)+'</td><td>'+
                                             formatD(varStrosGorivaInMaz)+'</td><td>'+
                                             formatD(varStrosVzdrz)+'</td><td>'+
                                             formatD(skupMatStr)+'</td><td class="'+key+'StrDela"><b>'+
                                             formatD(getIdentValue(operAll[key].str_dela_ident))+'</b></td><td class="'+key+'SkupStr"></td><td class="'+key+'SkupStrM3"></td></tr>');
                
                
                extNumRows = 1;
                //Dodajanje priključkov
                $.each((operAll[key].extensions), function(keyE,value) {                
                    extID = value;
                    eData = ext_calc_data[extID];
                    
                    fiksniStroskiAmortDoba = eData.nabVr/eData.amort+eData.delObrSr*eData.nabVr;
                    fiksniStroskiUra = fiksniStroskiAmortDoba/eData.letRaba;
                    strMazivaOdstotek = mData.strMaziva/100;
                    varStrosGorivaInMaz = strMazivaOdstotek*eData.obremStroja*eData.povprPoraba;
                    varStrosVzdrz = eData.nabVr*eData.facVzdrz/eData.zivlDoba;
                    skupMatStr = fiksniStroskiUra+varStrosGorivaInMaz+varStrosVzdrz;
                    matStrMachInExt += skupMatStr;
                                    
                    /*skupStrDProc = skupMatStr+operAll[key].strDela;//strošek dela * št delavcev
                    skupStrDProcM3 = skupStrDProc/($("#"+operAll[key].slider).val());*/
                    //console.log(response);
                    $("#rezultati tbody").append('<tr><td class="subChildExt"><i class="glyphicon glyphicon-arrow-right text-success" ></i> '+eData.name+'</td><td>'+
                                                 formatD(fiksniStroskiAmortDoba)+'</td><td>'+
                                                 formatD(fiksniStroskiUra)+'</td><td>'+
                                                 formatD(varStrosGorivaInMaz)+'</td><td>'+
                                                 formatD(varStrosVzdrz)+'</td><td>'+
                                                 formatD(skupMatStr)+'</td>');
                                                /*<td>'+
                                                 formatD(skupStrDProc)+'</td><td>'+
                                                 formatD(skupStrDProcM3)+'</td></tr>');*/                    
                  
                    $("#podrobno tbody").append('<tr><td class="subChildExt"><i class="glyphicon glyphicon-arrow-right text-success" ></i> '+eData.name+'</td><td>'+
                                             formatD((eData.pw > 0?eData.pw:"-"))+'</td><td>'+
                                             formatD(eData.nabVr)+'</td><td>'+
                                             formatD(eData.zivlDoba)+'</td><td>'+
                                             formatD(eData.amort)+'</td><td>'+
                                             formatD(eData.letRaba)+'</td><td>'+
                                             getFuelType(eData.vrstaGoriva)+'</td><td>'+
                                             formatD(eData.facVzdrz)+'</td><td>'+
                                             formatD(fiksniStroskiAmortDoba)+'</td><td>'+
                                             formatD(fiksniStroskiUra)+'</td><td>'+
                                             formatD(varStrosGorivaInMaz)+'</td><td>'+
                                             formatD(varStrosVzdrz)+'</td><td>'+
                                             formatD(skupMatStr)+'</td></tr>');
                                                
                    extNumRows++;
                    
                });
                
                //izračun skupnih atributov
                skupStrDProc = matStrMachInExt+(getIdentValue(operAll[key].str_dela_ident)*getIdentValue(operAll[key].st_delavcev_ident));//strošek dela * št delavcev
                skupStrDProcM3 = skupStrDProc/(getIdentValue(operAll[key].slider));
                
                $("."+key+"SkupStr").html("<b>"+formatD(skupStrDProc)+"</b>");
                $("."+key+"SkupStr").attr('rowspan', extNumRows);
                $("."+key+"SkupStrM3").html("<b>"+formatD(skupStrDProcM3)+"</b>");
                $("."+key+"SkupStrM3").attr('rowspan', extNumRows);
                $("."+key+"StrDela").attr('rowspan', extNumRows);
                
                //Seštevanje stroškov za skupni prikaz
                finStrIzbrVer += skupStrDProc;
                finStrIzbrVerM3 += skupStrDProcM3;
                
            }
            $("#finStrIzbrVer").html("<b>"+formatD(finStrIzbrVer)+" €/h</b>");
            $("#finStrIzbrVerM3").html("<b>"+formatD(finStrIzbrVerM3)+" €/m<sup>3</sup></b>");
            $("#izrCenaDizel").html(formatD($("#fuel1").val(),3));
            $("#izrCenaBencin").html(formatD($("#fuel2").val(),3));
            //getCalculations(allOperIDs, attrs);
        }
        
        function getFuelType(tipGoriva){
            switch(tipGoriva){
                case "1":
                    return "Dizel";
                case "2":
                    return "Bencin";
                default:
                    return "-";
            }
        }
        
        function getIdentValue(identifikator){
            return parseInt($("#"+identifikator).val());
        }
        
        function newProcess(){
            resetPGB();
            setNextPGB();
            $("#operation .btn-group button.btn-danger").removeClass("btn-danger").addClass("btn-success");
            //$("#procStart").fadeIn(100);
            startLoc = newStartLoc;
            startLocName = newStartLocName;            
            oldOper = newOper;
            $("#trenMesto").text(startLocName);
            $("#contTrenMesto").fadeIn(100);
            $("#operation").fadeIn(100);
            $("#contVerigaProc").fadeOut(100);
            $("#gorivoCena").fadeOut(100);
            $("#backward").fadeOut(100);
            correctDestinations();
        }
        
        //Premik nazaj
        $("button.backMove").on("click", function(){
            $("#toProcess").hide();
            $("#operNext").hide();
            //nazaj = $(this);
            trenuten = $("div.locIndicate[style$='display: block;']");            
            switch(trenuten[0].id){
                case "operation":
                    moveBackward("procStart");
                    $("#backward").hide();
                    $("#procEnd").hide();
                    break;
                case "stroj":
                    oldOper = oldOperStack;
                    moveBackward("operation");
                    setTimeout(function(){
                        showOperNext();
                        hideNadgradnja();
                        correctDestinations();
                    }, 100);
                    break;
                case "contVerigaProc":
                    moveBackward("stroj");                    
                    if(availUpgr){
                        showNadgradnja();
                    }
                    $("#toProcess").show();
                    $("#verigaProcesov table tbody tr:last").remove();
                    break;
            }
            /*var opcija = nazaj.data("value");
            $(".container > div.panel").not($("#"+nazaj.data("value"))).fadeOut(100); //hideAll panels                
           //console.log($(this));
            setTimeout(function(){
                 $("#"+nazaj.data("value")).fadeIn(100);  //showWanted panels                 
                 goBackPGB();                 
                 if(opcija == "operation"){
                    goBackPGB();
                 }
            }, 110);*/
            
            
            
        });
        
        function resetAndNewProcess(){
            location.reload();
        }
        
        function resetFuel(){
            $("#fuel1").val("1.198");
            $("#fuel2").val("1.297");
        }
        
        function moveBackward(id){
             $(".container > div.panel.locIndicate").hide();
             setTimeout(function(){
                 $("#"+id).fadeIn(100);  //showWanted panels                 
                 goBackPGB();                                  
            }, 100);
        }
                
        
        function konecPGB(){
            setNextPGB();
            setNextPGB();
            setNextPGB();
            //setNextPGB();
        }
        
        function resetPGB(){
            i=1;
            $('.progress .circle').removeClass().addClass('circle');
            $('.progress .bar').removeClass().addClass('bar');
            setNextPGB();
        }
        
        function setNextPGB(){
            $('.progress .circle:nth-of-type(' + i + ')').addClass('active');

            $('.progress .circle:nth-of-type(' + (i - 1) + ')').removeClass('active').addClass('done');
            
            $('.progress .circle:nth-of-type(' + (i - 1) + ') .label').html('&#10003;');
            
            $('.progress .bar:nth-of-type(' + (i - 1) + ')').addClass('active');
            
            $('.progress .bar:nth-of-type(' + (i - 2) + ')').removeClass('active').addClass('done');
            i++;
        }
        
        function goBackPGB(){
            i--;
            $('.progress .circle:nth-of-type(' + i + ')').removeClass('active');
            
            $('.progress .circle:nth-of-type(' + (i - 1) + ')').removeClass('done').addClass('active');
            
            $('.progress .circle:nth-of-type(' + (i - 1) + ') .label').html(i-1);
            
            $('.progress .bar:nth-of-type(' + (i - 1) + ')').removeClass('active');
            
            $('.progress .bar:nth-of-type(' + (i - 2) + ')').removeClass('done').addClass('active');
            
        }
        
 
 
 ///////////////////////////////////////////////////////////////////////////////////////////////////// klici php:
 
 
 
 function getMachines(secnja, klescenje, krojenje, sekanci, secnaPot, gozdnaVlaka, gozdnaCesta, koncniUp){
    var formData = {
        'secnja': secnja,
        'klescenje' : klescenje,
        'krojenje' : krojenje,
        'sekanci' : sekanci,
        'secnaPot' : secnaPot,
        'gozdnaVlaka' : gozdnaVlaka,
        'gozdnaCesta' : gozdnaCesta,
        'koncniUp' : koncniUp    };
    $.ajax({
        type: 'POST',
        url: 'api/getMachines.php',
        data: formData,
        dataType: 'json',
        encode: true
    }).then(handleMSuccess, handleMError);
    //then(function(data) { handleSuccess(data, sendIds); }, handleError);
 }
 
  function handleMSuccess(response) {    
    if(response.success){                    
        try{
            //obj = JSON.parse(response);
            //console.log(response.options);
            data = response.options;
            //console.log(response);
            var stroji = $("#stroji");
            stroji.empty();
            
            if(data.length > 0){
                $("#strojLbl")[0].innerHTML = "Stroj:";                
                var izberi = document.createElement('option');            
                izberi.innerHTML = "Izberite stroj";
                izberi.value = -1;                    
                stroji.append(izberi);
                
                $.each(data, function(key,value){
                   opcija = '<option value="' + value.id + '"';
                   if(value.kategorija){
                      opcija += ' data-kategorija="'+value.kategorija+'"';
                   }
                   if(value.dodatek){
                      opcija += ' data-dodatek="'+value.dodatek+'"';
                   }
                   opcija += '>' + value.value+ '</option>';
                   stroji.append(opcija);
                 });
                stroji.fadeIn();
            }
            else{
                $("#strojLbl")[0].innerHTML = "Za izbrane operacije v bazi podatkov trenutno ni na voljo nobenega stroja, vrnite se NAZAJ in določite nov niz operacij.";
                stroji.hide();
            }
            
            /*for( key in data ){              
                console.log(key+" "+data[key].id+" "+data[key].value);
                sel.append('<option value="' + data[i].id + '">' + data[i].desc + '</option>');
            }*/  
        }
        catch(err){
            parsed = response.podatki;
            console.log("Parse fail");
        }
       
    }
    else{
        console.log("No data");
    }
}

function handleMError(response) {
    console.log("Error: "+response);
}

 function getMachinesByID(catID){
    var formData = {
        'catID': catID
    };
    $.ajax({
        type: 'POST',
        url: 'api/getMachinesByID.php',
        data: formData,
        dataType: 'json',
        encode: true
    }).then(handleMIDSuccess, handleMIDError);
    //then(function(data) { handleSuccess(data, sendIds); }, handleError);
 }

 function handleMIDSuccess(response) {    
    if(response.success){                    
        try{
            //obj = JSON.parse(response);
            //console.log(response.options);
            data = response.options;
            //console.log(response);
            var stroji = $("#stroji");
            stroji.empty();
            
            var izberi = document.createElement('option');  
            izberi.innerHTML = "Izberite stroj";
            izberi.value = -1;                    
            stroji.append(izberi);
            
            $.each(data, function(key,value) {
                
                stroji.append('<option value="' + value.id + '">' + value.value+ '</option>');
             });
            
            /*for( key in data ){              
                console.log(key+" "+data[key].id+" "+data[key].value);
                sel.append('<option value="' + data[i].id + '">' + data[i].desc + '</option>');
            }*/  
        }
        catch(err){
            parsed = response.podatki;
            console.log("Parse fail");
        }
       
    }
    else{
        console.log("No data");
    }
}

function getMachineCalc(catID, ime, strDela, slider){
    var formData = {
        'catID': catID
    };
    $.ajax({
        type: 'POST',
        url: 'api/getMachineCalc.php',
        data: formData,
        dataType: 'json',
        encode: true
    //}).then(handleCalcSuccess, handleMIDError);
    }).then(function(data){handleCalcSuccess(data, ime, strDela, slider);}, handleMIDError);
    
    //then(function(data) { handleSuccess(data, sendIds); }, handleError);
 }
 
  function handleCalcSuccess(response, ime, strDela, slider) {    
    if(response.success){                    
        try{
            //obj = JSON.parse(response);
            //console.log(response.options);
            data = response.fiksni;
            skupStrDProc = response.skupMatStr+strDela;//strošek dela * št delavcev
            skupStrDProcM3 = skupStrDProc/($("#"+slider).val());
            //console.log(response);
            $("#rezultati tbody").append('<tr><td>'+ime+'</td><td>'+formatD(data)+'</td><td>'+formatD(response.nsl)+'</td><td>'+formatD(response.vsgm)+'</td><td>'+formatD(response.vsvz)+'</td><td>'+formatD(response.skupMatStr)+'</td><td>'+formatD(skupStrDProc)+'</td><td>'+formatD(skupStrDProcM3)+'</td></tr>');
            //console.log(response);
            /*var stroji = $("#stroji");
            stroji.empty();
            
            var izberi = document.createElement('option');  
            izberi.innerHTML = "Izberite stroj";
            izberi.value = -1;                    
            stroji.append(izberi);*/
            
            /*$.each(data, function(key,value) {
                
                stroji.append('<option value="' + value.id + '">' + value.value+ '</option>');
             });*/
            
            /*for( key in data ){              
                console.log(key+" "+data[key].id+" "+data[key].value);
                sel.append('<option value="' + data[i].id + '">' + data[i].desc + '</option>');
            }*/  
        }
        catch(err){
            parsed = response.podatki;
            console.log("Parse fail");
        }
       
    }
    else{
        console.log("No data");
    }
}

function handleMIDError(response) {
    console.log("Error: "+response);
}

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d === undefined ? "," : d, 
    t = t === undefined ? "." : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

function formatD(number, m){
    if(number != "-"){
        if(typeof number === 'string'){
            number = parseFloat(number);
        }
        if (m === undefined) {
          m=2;
        }
        if(number % 1 != 0){
          //return parseFloat(Math.round(number * Math.pow(10,m)) / Math.pow(10,m)).toFixed(m);
          return (number).formatMoney(m);
        }
        else{
          //return parseFloat(Math.round(number * Math.pow(10,m)) / Math.pow(10,m)).toFixed(m);
          //return number; //->cela števila vrne brez decimalk
          return (number).formatMoney(0);
        }
    }
    else{
        return number;
    }
}


function getCalculations(allOperIDs, attrs){
    var formData = {
        'allOperIDs': allOperIDs
    };
    $.ajax({
        type: 'POST',
        url: 'api/getCalculations.php',
        data: formData,
        dataType: 'json',
        encode: true
    }).then(function(data){handleCalculationsSuccess(data, attrs);}, handleMIDError);
    
    //then(function(data) { handleSuccess(data, sendIds); }, handleError);
 }
 
   function handleCalculationsSuccess(response, attrs) {    
    if(response.success){                    
        try{
            //obj = JSON.parse(response);
            //console.log(response.options);
            debugger;
            data = response.fiksni;
            skupStrDProc = response.skupMatStr+strDela;//strošek dela * št delavcev
            skupStrDProcM3 = skupStrDProc/($("#"+slider).val());
            //console.log(response);
            $("#rezultati tbody").append('<tr><td>'+ime+'</td><td>'+formatD(data)+'</td><td>'+formatD(response.nsl)+'</td><td>'+formatD(response.vsgm)+'</td><td>'+formatD(response.vsvz)+'</td><td>'+formatD(response.skupMatStr)+'</td><td>'+formatD(skupStrDProc)+'</td><td>'+formatD(skupStrDProcM3)+'</td></tr>');
            //console.log(response);
            /*var stroji = $("#stroji");
            stroji.empty();
            
            var izberi = document.createElement('option');  
            izberi.innerHTML = "Izberite stroj";
            izberi.value = -1;                    
            stroji.append(izberi);*/
            
            /*$.each(data, function(key,value) {
                
                stroji.append('<option value="' + value.id + '">' + value.value+ '</option>');
             });*/
            
            /*for( key in data ){              
                console.log(key+" "+data[key].id+" "+data[key].value);
                sel.append('<option value="' + data[i].id + '">' + data[i].desc + '</option>');
            }*/  
        }
        catch(err){
            parsed = response.podatki;
            console.log("Parse fail");
        }
       
    }
    else{
        console.log("No data");
    }
}

 function getUpgrades(stroj, cat, secnja, klescenje, krojenje, sekanci, spravilo, secnaPot, gozdnaVlaka, gozdnaCesta, koncniUp, dodatek){
    var formData = {
        'stroj': stroj,
        'cat' :  cat,
        'secnja': secnja,
        'klescenje' : klescenje,
        'krojenje' : krojenje,
        'sekanci' : sekanci,
        'spravilo' : spravilo,
        'secnaPot' : secnaPot,
        'gozdnaVlaka' : gozdnaVlaka,
        'gozdnaCesta' : gozdnaCesta,
        'koncniUp' : koncniUp,
        'dodatek' : (dodatek>-1?'1':'0')
    };
    $.ajax({
        type: 'POST',
        url: 'api/getUpgrades.php',
        data: formData,
        dataType: 'json',
        encode: true
    }).then(function(data){handleUpgSuccess(data, cat, dodatek);}, handleMError);
    //then(function(data) { handleSuccess(data, sendIds); }, handleError);
 }
 
   function handleUpgSuccess(response, cat, dodatek) {
    if(response.success && response.options){                    
        try{
            //obj = JSON.parse(response);
            //console.log(response.options);
            data = response.options;
            //console.log(response);
            var nadgradnje = $("#nadgradnje"+cat);
            nadgradnje.empty();
            
            var izberi = document.createElement('option');  
            izberi.innerHTML = "Izberite nadgradnjo";
            izberi.value = -1;                    
            nadgradnje.append(izberi);
            
            $.each(data, function(key,value) {                
                nadgradnje.append('<option value="' + value.id + '" data-cat_ext="' + value.cat_ext + '">' + value.value+ '</option>');
             });
            
            /*for( key in data ){              
                console.log(key+" "+data[key].id+" "+data[key].value);
                sel.append('<option value="' + data[i].id + '">' + data[i].desc + '</option>');
            }*/  
        }
        catch(err){
            parsed = response.podatki;
            console.log("Parse fail");
        }
       showNadgradnjaSel(cat);
       showNadgradnja();       
       availUpgr = true;
       
       if(dodatek > -1){
            okvirNadgr = $("#nadgradnje"+cat);
            okvirNadgr.val(dodatek);            
        }
       
    }
    else{
      availUpgr = false;
      console.log("No data");
      //hideNadgradnja();
      hideNadgradnjaSel(cat);
    }
    $("#toProcess").show();
}

 function getStorilnost(id, ext, extensions_cat, all_ext_ids){
    if(all_ext_ids === undefined){
        all_ext_ids = [];
    }
    var formData = {
        'idMachine': id,
        'ext' : ext,
        'extensions_cat' : extensions_cat,
        'all_ext_ids' : all_ext_ids
    };
    $.ajax({
        type: 'POST',
        url: 'api/getStorilnost.php',
        data: formData,
        dataType: 'json',
        encode: true
      }).then(function(data){handleStorSuccess(data, ext);}, handleMError);
    //}).then(handleStorSuccess, handleMError);
    //then(function(data) { handleSuccess(data, sendIds); }, handleError);
 }
 
  function handleStorSuccess(response, ext) {
    if(response.success){                    
        try{
            //obj = JSON.parse(response);
            //console.log(response.options);
            //data = response.options;
            //console.log(response);
            inputIdentify = addToTable(response.storilnost, response.min, response.max, response.ext_names, response.stDela);
            //machineSlika = response.ikona+".svg"; //Pridobivanje slike stroja
            machineSlika = response.slika+".png"; //slika celotnega seta 
            drawToGraph();
            //addToArray
            //DODAJ osnovne podatke v array, zaradi kasnejših izračunov
            //Dodaj nov array -> priključki in potme ločeno hrani informacije
            //En array bo imel samo povezane IDje, drugi(slovar) pa vse podatke
            
            operAll[verStep+"-"+response.id] = {
               ime: response.ime,
               stroj_id: response.id,
               stroj_cat: response.cat_mach,
               ikona: response.ikona,
               storilnost: response.storilnost,
               min: response.min,
               max: response.max,
               procesi: procesi,
               extensions: extensions,
               extensions_cat: extensions_cat,
               strDela: response.stDela,
               slider: "inp"+inputIdentify,
               str_dela_ident: "str_dela_"+inputIdentify,
               st_delavcev_ident: "st_delavcev_"+inputIdentify,
               glExt: ext
               };
               
            $.each(response.ext_calc_data, function(key,value){
                ext_calc_data[value.id] = {
                    id : value.id,
                    name : value.name,
                    pw : value.pw,
                    nabVr : value.nabVr,
                    amort : value.amort,
                    zivlDoba : value.zivlDoba,								
                    letRaba : value.letRaba,								
                    facVzdrz : value.facVzdrz,								
                    delObrSr : value.delObrSr,								
                    vrstaGoriva : value.vrstaGoriva,								
                    strMaziva : value.strMaziva,								
                    obremStroja : value.obremStroja,								
                    povprPoraba : value.povprPoraba
                                };
            });
            
            $.each(response.mach_calc_data, function(key,value){
                mach_calc_data[value.id] = {
                    id : value.id,
                    name : value.name,
                    pw : value.pw,
                    nabVr : value.nabVr,
                    amort : value.amort,
                    zivlDoba : value.zivlDoba,								
                    letRaba : value.letRaba,								
                    facVzdrz : value.facVzdrz,								
                    delObrSr : value.delObrSr,								
                    vrstaGoriva : value.vrstaGoriva,								
                    strMaziva : value.strMaziva,								
                    obremStroja : value.obremStroja,								
                    povprPoraba : value.povprPoraba
                                };
            });
            
            /*if(response.id==8){
               if($("#nadgradnje6").val() == 6){
                  machineSlika = "chipper4.svg";            
                  drawToGraph();
               }             
            }*/
            
        }
        catch(err){
            parsed = response.podatki;
            console.log("Parse fail");
        }
       
    }
    else{
        console.log("No data");
    }
}

function drawToGraph(){
   //preveri če gre poševno
   
   if((startLoc != newStartLoc) && (oldOper != newOper)){
       drawLine(startLoc, oldOper, startLoc, newOper, firstNode, false, machineSlika);                
       drawLine(startLoc, newOper, newStartLoc, newOper, false, true, machineSlika);
   }
   else{
       drawLine(startLoc, oldOper, newStartLoc, newOper, firstNode, true, machineSlika);
   }            
   firstNode = false;
   /*console.log("Stara lokacija: "+startLoc +"  nova lokacija: "+newStartLoc);
   console.log("Stara oper: "+oldOper +"  nova oper: "+newOper);*/
   $("#contTech").fadeIn(100).css("display","block");
}

function addToTable(storilnost, min, max, ext_names, str_dela){
   tabela = $("#verigaProcesov table");
   trID = "stor"+stroj_id+"st"+verStep;
   //tabela.append('<tr data-id='+stroj_id+' class="clickable" data-toggle="" id="rowControl'+verStep+'" data-target=".rowControl'+verStep+'"><td><b>'+stroj+'</b> <i class="glyphicon glyphicon-retweet .text-info" data-toggle="tooltop" data-container:"body" title="Zamenjaj stroj"> <span data-toggle="modal" data-target="#modEditMachine" data-id="'+stroj_id+'"><i class="glyphicon glyphicon-pencil .text-info" data-toggle="tooltop" data-container:"body" title="Uredi parametre"></i></span></td><td>'+procesi+'</td><td><input class="rangeInput" id="inp'+trID+'" data-slVal="'+trID+'" value="'+storilnost+'" required name="quantity" min="'+min+'" max="'+max+'" type="number" /><span class="rangeNumMin col-sm-1">'+min+'</span><div class="rangeSlideCont col-sm-8"><div id="'+trID+'"></div></div><span class="rangeNumMax col-sm-1">'+max+'</span></td><td><i class="glyphicon glyphicon-wrench .text-info" data-toggle="tooltop" data-container:"body" title="Uredi set"></td></tr>');
   tabela.append('<tr data-id='+stroj_id+' class="clickable" data-toggle="" id="rowControl'+verStep+'" data-target=".rowControl'+verStep+'"><td><b>'+stroj+'</b> <i class="glyphicon glyphicon-retweet .text-info" data-toggle="tooltop" data-container:"body" title="Zamenjaj stroj"></i> <span data-toggle="modal" data-target="#modEditMachine" data-id="'+stroj_id+'"><i class="glyphicon glyphicon-pencil .text-info" data-toggle="tooltop" data-container:"body" title="Uredi parametre"></i></span></td><td>'+procesi+'</td><td><input class="rangeInput" id="inp'+trID+'" data-slVal="'+trID+'" value="'+storilnost+'" required name="quantity" min="'+min+'" max="'+max+'" type="number" /><span class="rangeNumMin col-sm-1">'+min+'</span><div class="rangeSlideCont col-sm-8"><div id="'+trID+'"></div></div><span class="rangeNumMax col-sm-1">'+max+'</span></td><td><input class="rangeInput costInput" id="str_dela_'+trID+'" value="'+str_dela+'" required name="str_dela" min="0" type="number" /></td><td><input class="rangeInput workersInput" id="st_delavcev_'+trID+'" value="1" required name="st_delavcev" min="0" type="number" /></td></tr>');
   //tabela.append('<tr data-id='+stroj_id+' class="clickable" data-toggle="collapse" id="rowControl'+verStep+'" data-target=".rowControl'+verStep+'"><td><b>'+stroj+'</b> <i class="glyphicon glyphicon-retweet .text-info" data-toggle="tooltop" data-container:"body" title="Zamenjaj stroj"> <span data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo"><i class="glyphicon glyphicon-pencil .text-info" data-toggle="tooltop" data-container:"body" title="Uredi parametre"></i></span></td><td>'+procesi+'</td><td><input class="rangeInput" id="inp'+trID+'" data-slVal="'+trID+'" value="'+storilnost+'" required name="quantity" min="'+min+'" max="'+max+'" type="number" /><span class="rangeNumMin col-sm-1">'+min+'</span><div class="rangeSlideCont col-sm-8"><div id="'+trID+'"></div></div><span class="rangeNumMax col-sm-1">'+max+'</span></td><td><i class="glyphicon glyphicon-wrench .text-info" data-toggle="tooltop" data-container:"body" title="Uredi set"></td></tr>');
   
   $("div#"+trID).slider({
      range: "min",
      value: parseInt(storilnost),
      step: 1,
      min: parseInt(min),
      max: parseInt(max),
      slide: function (event, ui) {         
          $("input#inp"+(this.id)).val(ui.value);    
      }
   });
   
   //dodajanje priključkov v tabelo
   $.each(ext_names, function(key,value){                          
               /*console.log(value.id);
               console.log(value.name);*/
               tabela.append('<tr class="collapse in rowControl'+verStep+'" data-id="'+value.id+'"><td class="subChildExt"><i class="glyphicon glyphicon-arrow-right text-success" ></i> '+value.name+' &nbsp;<span data-toggle="modal" data-target="#modEditExt" data-id="'+value.id+'"><i class="glyphicon glyphicon-pencil .text-info" data-toggle="tooltop" data-container:"body" title="Uredi parametre"></i></span></td><td>'+procesi+'</td><td></td><td></td><td></td></tr>');
             });
   
   
   $("input#inp"+trID).on("keyup, change",function(e){
      //$("div#"+trID).slider("value",this.value);
      $("#"+$(this).data("slval")).slider("value",this.value);
 });
   verStep++;
   return trID;
}

$('#modEditMachine').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var id = button.data('id'); // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this);
  stroj = mach_calc_data[id];
  modal.find('.modal-title').text('Urejanje stroja: ' + stroj.name);
  modal.find('.modal-body #modHStroj').val(stroj.name);
  
  //editableAtts
  modal.find('.modal-body #modSmoc').val(stroj.pw);
  modal.find('.modal-body #modSnabVr').val(stroj.nabVr);
  modal.find('.modal-body #modSzivlDoba').val(stroj.zivlDoba);
  modal.find('.modal-body #modSamortDoba').val(stroj.amort);
  modal.find('.modal-body #modSletRaba').val(stroj.letRaba);
  modal.find('.modal-body #modSfakVzdrz').val(stroj.facVzdrz);
  
  //savedAtts
  modal.find('.modal-body #modSid').val(stroj.id);
  modal.find('.modal-body #modSstrMaziva').val(stroj.strMaziva);
  modal.find('.modal-body #modSobremStroja').val(stroj.obremStroja);
  modal.find('.modal-body #modSpovprPoraba').val(stroj.povprPoraba);
  
  modal.find('.modal-body #modSdelObrSr').val(stroj.delObrSr);
  modal.find('.modal-body #modSvrstaGoriva').val(stroj.vrstaGoriva);
  //modal.find('.modal-body #modS').val(stroj.);
  
  modSfikStros = stroj.nabVr/stroj.amort+stroj.delObrSr*stroj.nabVr;
  modSfikStrosH = modSfikStros/stroj.letRaba;
  modSstrMazivaOdst = stroj.strMaziva/100;
  modSvarStrosGinM = stroj.pw*modSstrMazivaOdst*stroj.obremStroja*stroj.povprPoraba*(stroj.vrstaGoriva == 1?$("#fuel1").val():$("#fuel2").val());
  modSvarStrosVzdrz = stroj.nabVr*stroj.facVzdrz/stroj.zivlDoba;
  modSskupStros = modSfikStrosH+modSvarStrosGinM+modSvarStrosVzdrz;

  modal.find('.modal-body #modSfikStros').val(formatD(modSfikStros));
  modal.find('.modal-body #modSfikStrosH').val(formatD(modSfikStrosH));
  modal.find('.modal-body #modSvarStrosGinM').val(formatD(modSvarStrosGinM));
  modal.find('.modal-body #modSvarStrosVzdrz').val(formatD(modSvarStrosVzdrz));
  modal.find('.modal-body #modSskupStros').val(formatD(modSskupStros));
});

$('.editMachINP').on('change', function (event) {
    pw = $("#modSmoc").val();
    nabVr = $("#modSnabVr").val();
    zivlDoba = $("#modSzivlDoba").val();
    amort = $("#modSamortDoba").val();
    letRaba = $("#modSletRaba").val();
    facVzdrz = $("#modSfakVzdrz").val();
    
    id = $("#modSid").val();    
    strMaziva = $("#modSstrMaziva").val();
    obremStroja = $("#modSobremStroja").val();
    povprPoraba = $("#modSpovprPoraba").val();
    delObrSr = $("#modSdelObrSr").val();
    vrstaGoriva = $("#modSvrstaGoriva").val();
    // = $("#modS").val();
    modSfikStros = nabVr/amort+delObrSr*nabVr;
    modSfikStrosH = modSfikStros/letRaba;
    modSstrMazivaOdst = strMaziva/100;
    modSvarStrosGinM = pw*modSstrMazivaOdst*obremStroja*povprPoraba*(vrstaGoriva == 1?$("#fuel1").val():$("#fuel2").val());
    modSvarStrosVzdrz = nabVr*facVzdrz/zivlDoba;
    modSskupStros = modSfikStrosH+modSvarStrosGinM+modSvarStrosVzdrz;
    
    
    $("#modSfikStros").val(formatD(modSfikStros));
    $("#modSfikStrosH").val(formatD(modSfikStrosH));
    $("#modSvarStrosGinM").val(formatD(modSvarStrosGinM));
    $("#modSvarStrosVzdrz").val(formatD(modSvarStrosVzdrz));
    $("#modSskupStros").val(formatD(modSskupStros));
});

$("body").on("click", "#modEditMachine button.btn-saveEditedMach", function(){
    console.log("shranjujem");
    pw = $("#modSmoc").val();
    nabVr = $("#modSnabVr").val();
    zivlDoba = $("#modSzivlDoba").val();
    amort = $("#modSamortDoba").val();
    letRaba = $("#modSletRaba").val();
    facVzdrz = $("#modSfakVzdrz").val();
    id = $("#modSid").val();
    
    obj = mach_calc_data[id];
    obj.pw = pw;
    obj.nabVr = nabVr;
    obj.zivlDoba = zivlDoba;
    obj.amort = amort;
    obj.letRaba = letRaba;
    obj.facVzdrz = facVzdrz;    
});

$('#modEditExt').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var id = button.data('id'); // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this);
  ext = ext_calc_data[id];
  modal.find('.modal-title').text('Urejanje priključka: ' + ext.name);
  modal.find('.modal-body #modHPriklj').val(ext.name);
  
  //editableAtts
  modal.find('.modal-body #modPmoc').val(ext.pw);
  modal.find('.modal-body #modPnabVr').val(ext.nabVr);
  modal.find('.modal-body #modPzivlDoba').val(ext.zivlDoba);
  modal.find('.modal-body #modPamortDoba').val(ext.amort);
  modal.find('.modal-body #modPletRaba').val(ext.letRaba);
  modal.find('.modal-body #modPfakVzdrz').val(ext.facVzdrz);
  
  //savedAtts
  modal.find('.modal-body #modPid').val(ext.id);
  modal.find('.modal-body #modPstrMaziva').val(ext.strMaziva);
  modal.find('.modal-body #modPobremStroja').val(ext.obremStroja);
  modal.find('.modal-body #modPpovprPoraba').val(ext.povprPoraba);
  
  modal.find('.modal-body #modPdelObrSr').val(ext.delObrSr);
  modal.find('.modal-body #modPvrstaGoriva').val(ext.vrstaGoriva);
  //modal.find('.modal-body #modP').val(ext.);
  
  
  modPfikStros = ext.nabVr/ext.amort+ext.delObrSr*ext.nabVr;
  modPfikStrosH = modPfikStros/ext.letRaba;
  modPstrMazivaOdst = ext.strMaziva/100;
  modPvarStrosGinM = ext.pw*modPstrMazivaOdst*ext.obremStroja*ext.povprPoraba*(ext.vrstaGoriva == 1?$("#fuel1").val():$("#fuel2").val());
  modPvarStrosVzdrz = ext.nabVr*ext.facVzdrz/ext.zivlDoba;
  modPskupStros = modPfikStrosH+modPvarStrosGinM+modPvarStrosVzdrz;
  
  modal.find('.modal-body #modPfikStros').val(formatD(modPfikStros));
  modal.find('.modal-body #modPfikStrosH').val(formatD(modPfikStrosH));
  modal.find('.modal-body #modPvarStrosGinM').val(formatD(modPvarStrosGinM));
  modal.find('.modal-body #modPvarStrosVzdrz').val(formatD(modPvarStrosVzdrz));
  modal.find('.modal-body #modPskupStros').val(formatD(modPskupStros));
});

$('.editExtINP').on('change', function (event) {
    pw = $("#modPmoc").val();
    nabVr = $("#modPnabVr").val();
    zivlDoba = $("#modPzivlDoba").val();
    amort = $("#modPamortDoba").val();
    letRaba = $("#modPletRaba").val();
    facVzdrz = $("#modPfakVzdrz").val();
    
    id = $("#modPid").val();    
    strMaziva = $("#modPstrMaziva").val();
    obremStroja = $("#modPobremStroja").val();
    povprPoraba = $("#modPpovprPoraba").val();
    delObrSr = $("#modPdelObrSr").val();
    vrstaGoriva = $("#modPvrstaGoriva").val();
    // = $("#modP").val();
    modPfikStros = nabVr/amort+delObrSr*nabVr;
    modPfikStrosH = modPfikStros/letRaba;
    modPstrMazivaOdst = strMaziva/100;
    modPvarStrosGinM = pw*modPstrMazivaOdst*obremStroja*povprPoraba*(vrstaGoriva == 1?$("#fuel1").val():$("#fuel2").val());
    modPvarStrosVzdrz = nabVr*facVzdrz/zivlDoba;
    modPskupStros = modPfikStrosH+modPvarStrosGinM+modPvarStrosVzdrz;
    
    
    $("#modPfikStros").val(formatD(modPfikStros));
    $("#modPfikStrosH").val(formatD(modPfikStrosH));
    $("#modPvarStrosGinM").val(formatD(modPvarStrosGinM));
    $("#modPvarStrosVzdrz").val(formatD(modPvarStrosVzdrz));
    $("#modPskupStros").val(formatD(modPskupStros));
});

$("body").on("click", "#modEditExt button.btn-saveEditedExt", function(){
    pw = $("#modPmoc").val();
    nabVr = $("#modPnabVr").val();
    zivlDoba = $("#modPzivlDoba").val();
    amort = $("#modPamortDoba").val();
    letRaba = $("#modPletRaba").val();
    facVzdrz = $("#modPfakVzdrz").val();    
    id = $("#modPid").val();
    
    obj = ext_calc_data[id];
    obj.pw = pw;
    obj.nabVr = nabVr;
    obj.zivlDoba = zivlDoba;
    obj.amort = amort;
    obj.letRaba = letRaba;
    obj.facVzdrz = facVzdrz;
});

function showNadgradnja(){
   //Prikaz izbora dodatkov za stroj 
   $("#nadgradnja").fadeIn(100);
   //$("#strojBackward").hide();
   if(!setted){
       //setNextPGB();
       setted = true;
   }
}

function hideNadgradnja(){
   $("#nadgradnja").fadeOut(100);
   if(setted){
       //goBackPGB();
       setted = false;
   }     
}

function showNadgradnjaSel(cat){
   $("#nadgradnje"+cat).fadeIn(100);
   $("#nadgradnjeLBL"+cat).fadeIn(100);
   if(setted){
       //goBackPGB();
       setted = false;
   }     
}

function hideNadgradnjaSel(cat){
   $("#nadgradnje"+cat).fadeOut(100);
   $("#nadgradnjeLBL"+cat).fadeOut(100);
   if(setted){
       //goBackPGB();
       setted = false;
   }     
}


window.onbeforeunload = function (evt) {
  var message = 'Ali res želite zapustiti to spletno mesto?';
  if (typeof evt == 'undefined') {
    evt = window.event;
  }
  if (evt) {
    evt.returnValue = message;
  }
  return message;
}

$("body").delegate('.rangeInput', 'focusout', function(){
    if($(this).val() < 0){
        $(this).val('0');
    }
});

$("body").delegate('.fuelInp', 'focusout', function(){
    if($(this).val() < 0){
        $(this).val('0');
    }
});


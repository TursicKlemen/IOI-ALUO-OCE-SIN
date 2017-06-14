<!DOCTYPE HTML>
	<?php
	require("conf.php");
	$daysShow = 30;
	
	if(isset($_POST['submit']) && isset($_POST['oce']) && isset($_POST['sin']) && isset($_POST['coords']) && isset($_POST['coordsInv'])  && isset($_POST['center']) && isset($_POST['formid']) && isset($_SESSION['formid']) && $_POST["formid"] == $_SESSION["formid"]){
	
		$_SESSION["formid"] = '';
		//echo 'Process form';
		saveToBase($db);
	}
	else
	{
		$_SESSION["formid"] = md5(rand(0,10000000));
	}
	
	
	function saveToBase($db){
		
		$seznam = array(
				":1"=>'',
				":2"=>date("Y-m-d H:i:s"),
				":3"=>$_SERVER['REMOTE_ADDR'],
				":4"=>$_POST['oce'],
				":5"=>$_POST['sin'],
				":6"=>$_POST['coords'],
				":7"=>$_POST['coordsInv'],
				":8"=>$_POST['center']);
		
		$query = "INSERT INTO records VALUES (:1, :2, :3, :4, :5, :6, :7, :8)";
		
		
		try 
			{ 
				$stmt   = $db->prepare($query);
				$result = $stmt->execute($seznam);
				echo "<script>alert('Podatki uspešno shranjeni');</script>";
			} 
		catch(PDOException $ex) 
			{
				die("Napaka: " . $ex->getMessage()); 
			}
		
	}
	
	function readRecords(){
		global $db, $daysShow;
		$records = array();
		$sql = "SELECT * FROM records";        
		try {
			$q = $db->prepare($sql);
			$q->execute();
			$result = $q->fetchall();
		
			foreach($result as $key => $value) {
				$daysAgo = floor((time()-strtotime($value['date'])) / (60 * 60 * 24));
				if($daysAgo<=$daysShow){
					$opacity = 1.1 - ($daysAgo/$daysShow);
					if($opacity > 0){
						$records[] = array("coords" => json_decode($value['coords']),
									   "coordsInv" => json_decode($value['coordsInv']),
									   "opacity" => $opacity);
					}
				}
				
			}			
		}
		catch (PDOException $ex) {
			die("Napaka: ".$ex->getMessage());
		}
		return $records;
	}
	
	function readNames(){
		global $db, $daysShow;
		$records = array();
		$sql = "SELECT * FROM records ORDER BY date DESC";        
		try {
			$q = $db->prepare($sql);
			$q->execute();
			$result = $q->fetchall();
		
			foreach($result as $key => $value) {
				$daysAgo = floor((time()-strtotime($value['date'])) / (60 * 60 * 24));
				if($daysAgo<=$daysShow){
					$opacity = 1.1 - ($daysAgo/$daysShow);
					if($opacity > 0){
						$records[] = array("id" => $value['id'],
								   "nameFather" => $value['nameFather'],
								   "nameSon" => $value['nameSon'],
								   "opacity" => $opacity);
					}
					
				}
				
			}			
		}
		catch (PDOException $ex) {
			die("Napaka: ".$ex->getMessage());
		}
		return $records;
	}
	
	function readKonfig(){
		global $db, $daysShow;
		$records = array();
		$sql = "SELECT * FROM konfig";        
		try {
			$q = $db->prepare($sql);
			$q->execute();
			$result = $q->fetchall();

			foreach($result as $key => $value) {
				$records[$value['kljuc']] = $value['value'];
			}			
		}
		catch (PDOException $ex) {
			die("Napaka: ".$ex->getMessage());
		}
		return $records;
	}
	
	$konfig = readKonfig();
	$daysShow = $konfig['days'];
	
	
	?>
<html>
  <head>
	<link rel="stylesheet" href="css/bootstrap.min.css">	
	<!-- Optional theme -->
	<link rel="stylesheet" href="css/bootstrap-theme.min.css">
	<script src="js/jquery-3.1.0.min.js"></script>
	<link rel="stylesheet" href="css/jquery-ui.css">
    <script src="js/jquery-ui.js"></script>
	<!-- Latest compiled and minified JavaScript -->
	<script src="js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="css/style.css">
	<title>FRI & ALUO - Oče in sin; By Klemen Turšič</title>
  </head>
  <body>
	<div class="container">
		<br>
		<div class="panel panel-<?php echo $konfig['barvnaShema']; ?>">
			<div class="panel-heading"><?php echo $konfig['slov']; ?></div>
			<div class="panel-body margin-decr"><?php echo $konfig['engl']; ?></div>
		  </div>
    
		
		<center>
			<h3 class="naslov"><!---Oče, jaz in sin--></h3>
			<canvas id="myCanvas" width="500" height="500"></canvas>
			<br>
			<div class="forma">
				<input type="button" class="btn btn-default" name="Reset" id="clear" value="Reset" /><br><br>
				<form method="POST" name="form1" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" onsubmit="return validate();">
					<div class="form-group">
						<input type="text" name="oce" class="form-control" required placeholder="Vaš oče / Your father" /><br>
						<input type="text" name="sin" class="form-control" required placeholder="Vaš sin / Your son" /><br>
						<input type="hidden" id="coords" name="coords" value="" />
						<input type="hidden" id="coordsInv" name="coordsInv" value="" />
						<input type="hidden" id="center" name="center" value="" />
						<input type="hidden" name="formid" value="<?php echo htmlspecialchars($_SESSION["formid"]); ?>" />
						<input type="submit" class="btn btn-default" name="submit" value="Shrani / Save" />
					</div>
				</form>
			</div>
		</center>
		<br>
		<div class="panel panel-<?php echo $konfig['barvnaShema']; ?>">
			<div class="panel-heading">
				<h3 class="panel-title"><?php echo str_replace("{d}", $daysShow, $konfig['namesSLO']); ?> / <?php echo str_replace("{d}", $daysShow, $konfig['namesANG']); ?></h3>
			</div>
			<div class="panel-body text-center">
				
				<?php
				
					$inserts = readNames();
					
					foreach($inserts as $insert){
						echo "<div class='panel panel-default col-sm-2'>";
						echo "<div class='panel-body text-center' style='color: rgba(0, 0, 0, ".$insert['opacity'].")'>";						
						echo $insert["nameFather"]."<br>";
						echo $insert["nameSon"];						
						echo "</div>";
						echo "</div>";						
					}
				
				?>

				
			</div>
		</div>
		

    <script>
		
		function newCoord(x, y){
			if(x>250){
					newX = 250-(x-250);
				}
				else if(x<250){
					newX = 250+(250-x);
				}
				else{
					newX = x;
				}
				
				if(y>250){
					newY = 250-(y-250);
				}
				else if(y<250){
					newY = 250+(250-y);
				}
				else{
					newY = y;
				}
				return {x:newX, y:newY};
		}
		
		function drawPath(seznam, opacity){
			var first = true;
			var arrayLength = seznam.length;
			for (var i = 0; i < arrayLength; i++) {
					koord = newCoord(seznam[i].x, seznam[i].y);
					if(!first){
							context.beginPath();
							context.moveTo(koordF.x, koordF.y);
							context.lineTo(koord.x, koord.y, 6);
		
							context.strokeStyle = 'rgba('+lineColor+', '+opacity+')';
							
							context.lineWidth = <?php echo $konfig['lineWidth']; ?>;
							context.stroke();					
							koordF = koord;
					}
					else{
						first = false;
						koordF = koord;
					}
			}
		}
		
		function colorToRGB(value){
			// #XXXXXX -> ["XX", "XX", "XX"]
			var value = value.match(/[A-Za-z0-9]{2}/g);
			
			// ["XX", "XX", "XX"] -> [n, n, n]
			value = value.map(function(v) { return parseInt(v, 16); });
			
			// [n, n, n] -> rgb(n,n,n)
			//return "rgb(" + value.join(",") + ")";
			return value.join(",");
		}
		
		drawingColor = colorToRGB("<?php echo $konfig['drawingColor']; ?>");	
		lineColor = colorToRGB("<?php echo $konfig['lineColor']; ?>");
		
      canvas = document.getElementById('myCanvas');
      context = canvas.getContext('2d');
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
      radius = 240;
			
			points = [];
			pointsInv = [];
      isDown = false;
	</script>
	
		<script>
		records = [];
		<?php
		$records = readRecords();
		echo "records = ".json_encode($records).";";
		?>
		
		function drawRecords(){
			records.forEach(function(obj) {			
				drawPath(obj.coords, obj.opacity);
				drawPath(obj.coordsInv, obj.opacity);
			});
		}		
		
		
	</script>
	
	<script>
function init(){
	points = [];
	pointsInv = [];
  isDown = false;
	
	lineDrawed = false;
	$("#myCanvas").css("cursor", "crosshair");
	document.getElementById("coords").value = "";
	
	  //krog
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

      context.lineWidth = 1;
      context.strokeStyle = '#003300';
      context.stroke();
			
		//sredinska točka
		context.beginPath();
		context.arc(centerX, centerY, 2, 0, 2 * Math.PI, true);
		context.fill();
	  
	  drawRecords();
	  
	  context.lineWidth = 2;
	  
	  clicks = 0;
		lastClick = [0, 0];
	
	
}

init();

//Risanje po canvasu
		
start();
function start() {

		    
    canvas.onmousedown = function(e) {
			if(!lineDrawed){
        var pos = getXY(e);
        last = pos;

        points = [];
		pointsInv = [];
        isDown = true;
        points.push(pos);
		pointsInv.push(newCoord(pos.x, pos.y));
			}
    };

    canvas.onmousemove = function(e) {
				if(!lineDrawed){
        if (!isDown) return;
        
        var pos = getXY(e);
        points.push(pos);
        
        context.beginPath();
        context.moveTo(last.x, last.y);
        context.lineTo(pos.x, pos.y);
		
		context.lineWidth = <?php echo $konfig['drawingWidth']; ?>;
		context.strokeStyle = 'rgba('+drawingColor+', 1)';
		
        context.stroke();
				
		//mirorring
		
		koordL = newCoord(last.x, last.y);
		koordN = newCoord(pos.x, pos.y);
		
		context.beginPath();
				
        context.moveTo(koordL.x, koordL.y);
        context.lineTo(koordN.x, koordN.y);
        context.stroke();
		//end mirroring				
				
        pointsInv.push(koordN);
				
        last = pos;
				}
    };

    canvas.onmouseup = function(e) {
			if(!lineDrawed){
        if (!isDown) return;        
        isDown = false;
				lineDrawed = true;
				
				document.getElementById("coords").value = JSON.stringify(points);
				document.getElementById("coordsInv").value = JSON.stringify(pointsInv);
				document.getElementById("center").value = centerX;
				
				$("#myCanvas").css("cursor", "not-allowed");				
			}
    };
	
}

function validate(){
	var coordInput = document.getElementById("coords").value;
	if(coordInput == "" || !lineDrawed){
		alert("Najprej narišite črto.");
		return false;
	}
	return true;
}

function getXY(e) {
    var rect = canvas.getBoundingClientRect();
    return {x: e.clientX - rect.left, y: e.clientY - rect.top}
}

// bind event handler to clear button
document.getElementById('clear').addEventListener('click', function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	init();	
}, false);
//End risanje po canvasu


function getCursorPosition(e) {
    var x;
    var y;

    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    
    return [x, y];
}


function pointInCircle(x, y, cx, cy, radius) {
  var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
}



	  
    </script>
	</div>
	
	<footer>
		<div class="container">
			<div class="row">
				<div class="col-sm-12 text-center">
					<p><a href="https://www.fri.uni-lj.si/" target="_blank">FRI</a> & <a href="http://www.aluo.uni-lj.si/" target="_blank">ALUO</a> 2017</p>		
					<p>Copyright &copy; 2017 by <a href="mailto: tursic.klemen@gmail.com?Subject=Oce, jaz & sin - FRI & ALUO projekt - Mail iz spletne strani">Klemen Turšič (tursic.klemen@gmail.com)</a></p>
				</div>
			</div>
		</div>
	</footer>
  </body>
</html> 
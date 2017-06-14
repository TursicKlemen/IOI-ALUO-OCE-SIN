<!DOCTYPE HTML>
	<?php
	require("../conf.php");
	
	//default vrednost, se potem povozi iz baze
	$daysShow = 30;

	if(isset($_POST['submit']) /*&& isset($_POST['formid']) && isset($_SESSION['formid']) && $_POST["formid"] == $_SESSION["formid"]*/){
	
		$_SESSION["formid"] = '';
		unset($_POST['formid']);
		unset($_POST['submit']);
		$success = true;
		foreach($_POST as $kljuc => $vrednost){
			if(!updateKonfig($kljuc, $vrednost)){
				$success = false;
			}
		}
		
		if($success){
			echo "<script>alert('Podatki uspešno shranjeni.');</script>";
		}
		else{
			echo "<script>alert('Napaka pri shranjevanju.');</script>";
		}
	}
	else if(isset($_POST['archive'])){		
		if(archiveRecords()){
			echo "<script>alert('Podatki uspešno arhivirani.');</script>";
		}
		else{
			echo "<script>alert('Napaka pri arhiviranju.');</script>";
		}
	}
	else
	{
		$_SESSION["formid"] = md5(rand(0,10000000));
	}

	function archiveRecords(){
		global $db;
		$success = true;
		$sql = "SELECT * FROM records";        
		try {
			$q = $db->prepare($sql);
			$q->execute();
			$records = $q->fetchall();
		}
		catch (PDOException $ex) {
			return false;
			die("Napaka: ".$ex->getMessage());
		}
		
		foreach($records as $key => $value) {
				$archived = saveToArchive($value['id'], $value['date'], $value['ip'], $value['nameFather'], $value['nameSon'], $value['coords'], $value['coordsInv'], $value['offCenter']);
				if($archived){
					if(!deleteFromRecords($value['id'])){
						$success = false;
					}
				}
				else{
					$success = false;
				}
		}
		
		return $success;		
	}
	
	function deleteFromRecords($id){
		global $db;
		
		$seznam = array(
				":1"=>$id);
		
		$query = "DELETE FROM records WHERE id = :1";
				
		try 
			{ 
				$stmt   = $db->prepare($query);
				$result = $stmt->execute($seznam);				
				return true;
			} 
		catch(PDOException $ex) 
			{
				return false;
				die("Napaka: " . $ex->getMessage()); 
			}
	}
	
	function saveToArchive($id, $date, $ip, $oce, $sin, $coords, $coordsInv, $center){
		global $db;
		
		$seznam = array(
				":1"=>'',
				":2"=>$id,
				":3"=>$date,
				":4"=>$ip,
				":5"=>$oce,
				":6"=>$sin,
				":7"=>$coords,
				":8"=>$coordsInv,
				":9"=>$center);
		
		$query = "INSERT INTO archive VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9)";
				
		try 
			{ 
				$stmt   = $db->prepare($query);
				$result = $stmt->execute($seznam);				
				return true;
			} 
		catch(PDOException $ex) 
			{
				return false;
				die("Napaka: " . $ex->getMessage()); 
			}		
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
	
	function updateKonfig($key, $value){
		global $db;
		$seznam = array(
				":1"=>$key,
				":2"=>$value);
		
		$query = "UPDATE konfig SET value = :2 WHERE kljuc = :1";
		
		try 
			{ 
				$stmt   = $db->prepare($query);
				$result = $stmt->execute($seznam);				
			} 
		catch(PDOException $ex) 
			{
				return false;
				die("Napaka: " . $ex->getMessage()); 
			}
			return true;
	}
	
	function readRecords(){
		global $db, $daysShow;
		$records = array();
		$sql = "SELECT * FROM records ORDER BY date DESC";        
		try {
			$q = $db->prepare($sql);
			$q->execute();
			$result = $q->fetchall();
		
			foreach($result as $key => $value) {
				$daysAgo = floor((time()-strtotime($value['date'])) / (60 * 60 * 24));
				$visible = false;
				if($daysAgo<=$daysShow){
					$opacity = 1 - ($daysAgo/$daysShow);
					if($opacity > 0){
						$visible = true;
					}					
				}
				
				$records[] = array("id" => $value['id'],
									"date" => $value['date'],
									"ip" => $value['ip'],									
									"nameFather" => $value['nameFather'],
									"nameSon" => $value['nameSon'],
									"visible" => $visible);
				
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
	<link rel="stylesheet" href="../css/bootstrap.min.css">	
	<!-- Optional theme -->
	<link rel="stylesheet" href="../css/bootstrap-theme.min.css">
	<script src="../js/jquery-3.1.0.min.js"></script>
	<link rel="stylesheet" href="../css/jquery-ui.css">
    <script src="../js/jquery-ui.js"></script>
	<!-- Latest compiled and minified JavaScript -->
	<script src="../js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="../css/style.css">
	<title>ADMIN - FRI & ALUO - Oče in sin; By Klemen Turšič</title>
  </head>
  <body>
	<div class="container">
		<br>
		<div class="panel panel-<?php echo $konfig['barvnaShema']; ?>">
			<div class="panel-heading">Administrator plošča</div>
			<div class="panel-body margin-decr">
				<center>		
					<div>
						<a href="../" target="_blank">Odpri spletno stran</a><br><br>
						<form method="POST" name="form1" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" onsubmit="return validate();">
							<div class="row">
								<div class="col-sm-offset-2 col-sm-8">
									
									<div class="row">
										<div class="panel panel-default">
											<div class="panel-body">
												<div class="col-sm-6">
													<div class="form-group">
														<label for="slov">Navodilo SLO:</label>								
														<textarea class="form-control" rows="3" name="slov" id="slov"><?php echo $konfig['slov']; ?></textarea>
													</div>
												</div>								
												<div class="col-sm-6">
													<div class="form-group">
														<label for="engl">Navodilo ANG:</label>
														<textarea class="form-control" rows="3" name="engl" id="engl"><?php echo $konfig['engl']; ?></textarea>
													</div>
												</div>
											</div>
										</div>
									</div>
									
									<div class="row">
										<div class="panel panel-default">
											<div class="panel-body" aria-describedby="imenaHelp">
												<div class="col-sm-6">
													<div class="form-group">
														<label for="namesSLO">Shranjena imena naslov SLO:</label>																
														<textarea class="form-control" rows="3" name="namesSLO" id="namesSLO"><?php echo $konfig['namesSLO']; ?></textarea>
													</div>
												</div>
																		
												<div class="col-sm-6">
													<div class="form-group">
														<label for="namesANG">Shranjena imena naslov ANG:</label>																
														<textarea class="form-control" rows="3" name="namesANG" id="namesANG"><?php echo $konfig['namesANG']; ?></textarea>								
													</div>
												</div>
											</div>
											<p id="imenaHelp" class="form-text text-muted">
											Za prikaz dejanskega števila dni prikaza uporabite {d}.
										  </p>
										</div>
									</div>									
																		
									<div class="row">
										<div class="panel panel-default">
											<div class="panel-body">
												<div class="row">
													<div class="col-sm-6">
														<div class="form-group">
															<label for="lineColor">Barva starih črt:</label>
															<div class="input-group">
																<input type="color" name="lineColor" id="lineColor" class="form-control" required value="<?php echo $konfig['lineColor']; ?>" />													
															</div>
														</div>
													</div>
			
													<div class="col-sm-6">
														<div class="form-group">
															<label for="drawingColor">Barva črte med risanjem:</label>
															<div class="input-group">
																<input type="color" name="drawingColor" id="drawingColor" class="form-control" required value="<?php echo $konfig['drawingColor']; ?>" />													
															</div>
														</div>
													</div>
												</div>
												
												<div class="row">
													<div class="col-sm-6">
														<div class="form-group">
															<label for="lineWidth">Debelina starih črt:</label>
															<div class="input-group">
																<input id="lineWidth" name="lineWidth" type="number" min="1" max="10" step="1" required value="<?php echo $konfig['lineWidth']; ?>" />
															</div>
														</div>
													</div>
			
													<div class="col-sm-6">
														<div class="form-group">
															<label for="drawingWidth">Debelina črte med risanjem:</label>
															<div class="input-group">																
																<input id="drawingWidth" name="drawingWidth" type="number" min="1" max="10" step="1" required value="<?php echo $konfig['drawingWidth']; ?>" />
															</div>
														</div>
													</div>
												</div>
												
												<div class="row">
													<div class="col-sm-offset-4 col-sm-4">
														<div class="form-group">
															<label for="days">Izris zgodovine črt za obdobje:</label>
															<div class="input-group">
																<input type="number" name="days" id="days" class="form-control" required value="<?php echo $konfig['days']; ?>" onkeypress='return event.charCode >= 48 && event.charCode <= 57;' />
																<div class="input-group-addon">dni</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>									
									
									<div class="row">
										<div class="col-sm-offset-3 col-sm-6">																				
											<div class="form-group">
												<label for="barvnaShema">Barvna shema:</label>
												<select class="form-control" id="barvnaShema" name="barvnaShema">
													<option value="default" <?php echo ($konfig['barvnaShema'] == "default"?"selected":""); ?>>Siva</option>
													<option value="primary" <?php echo ($konfig['barvnaShema'] == "primary"?"selected":""); ?>>Temno modra</option>
													<option value="info" <?php echo ($konfig['barvnaShema'] == "info"?"selected":""); ?>>Svetlo modra</option>
													<option value="success" <?php echo ($konfig['barvnaShema'] == "success"?"selected":""); ?>>Zelena</option>
													<option value="warning" <?php echo ($konfig['barvnaShema'] == "warning"?"selected":""); ?>>Rumena</option>
													<option value="danger" <?php echo ($konfig['barvnaShema'] == "danger"?"selected":""); ?>>Rdeča</option>
												</select>
											</div>				
										</div>
									</div>	
									
									<input type="hidden" name="formid" value="<?php echo htmlspecialchars($_SESSION["formid"]); ?>" />
									
									<div class="form-group">
										<input type="submit" class="btn btn-default" name="submit" value="Shrani" />										
									</div>
									
									<br>
									<div class="form-group">
										<input type="submit" class="btn btn-default" name="archive" value="Arhiviraj in začni znova"  onclick="return confirm('Ste prepričani da želite začeti znova?');" />
									</div>
							
								</div>
							</div>
						</form>
					</div>
				</center>
			</div>
		</div>
		<br>
		<div class="panel panel-<?php echo $konfig['barvnaShema']; ?>">
			<div class="panel-heading">
				<h3 class="panel-title">Shranjena imena</h3>
			</div>
			<div class="panel-body text-center">
				
				<?php
				
				$days_ago = date('d.m.Y', strtotime("-".$daysShow." days", strtotime(date("r"))));
				echo "<p>Grafični prikaz za zapise do datuma: <b>".$days_ago."</b></p>";
				
				?>
				<table class="table table-striped table-bordered table-hover table-condensed">
					<thead>
						<tr>
							<th>ID</th>
							<th>Datum</th>
							<th>IP</th>
							<th>Oče</th>
							<th>Sin</th>
							<th>Prikazan</th>
						</tr>
					</thead>
					<tbody>
				<?php
				
					$records = readRecords();
					
					foreach($records as $insert){
						$date = DateTime::createFromFormat('Y-m-d H:i:s', $insert['date']);
						
						echo "<tr title='".$insert['id'].": ".$insert['nameFather']." - ". $insert['nameSon'] ."'>";
						echo "<td>".$insert['id']."</td>";
						echo "<td>".$date->format('d.m.Y H:i:s')."</td>";
						echo "<td>".$insert['ip']."</td>";
						echo "<td>".$insert['nameFather']."</td>";
						echo "<td>".$insert['nameSon']."</td>";
						echo "<td><i class='glyphicon ".($insert['visible'] == true?" glyphicon-ok text-success":" glyphicon-remove text-danger")."'></i></td>";
						echo "</tr>";
									
					}
				
				?>
					</tbody>
				</table>
				
			</div>
		</div>		

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
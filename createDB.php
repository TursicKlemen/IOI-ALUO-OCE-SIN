<?php

//v primeru da tabele že obstajajo, se ne bo zgodilo nič, če pa pri uvozu pride do napake, bo skripta to izpisala na ekran.
//po uvozu spremenite atribut $active = false;
$active = true;


if(!$active){
	die();
}

require("conf.php");

function executeSQL($query){
	global $db;		
			
	try 
		{ 
			$stmt   = $db->prepare($query);
			$result = $stmt->execute();				
			return (object) array('success' => true);
		} 
	catch(PDOException $ex) 
		{
			return (object) array('success' => false, 'error' => $ex->getMessage());			
		}
}

function konfigRows(){
	global $db;		
	
	$query = "SELECT * FROM konfig";
	try 
		{ 
			$stmt   = $db->prepare($query);
			$result = $stmt->execute();
			$vrstic = $stmt->rowCount();
			return (object) array('success' => true, 'rows' => $vrstic);
		} 
	catch(PDOException $ex) 
		{
			return (object) array('success' => false);
		}
}

$createKonfig = executeSQL("CREATE TABLE IF NOT EXISTS `konfig` (
  `kljuc` varchar(20) COLLATE utf8_slovenian_ci NOT NULL PRIMARY KEY,
  `value` text COLLATE utf8_slovenian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;");

$vrstic = konfigRows();

if($vrstic->success && $vrstic->rows <= 0 && $createKonfig->success){
	$insertKonfig = executeSQL("INSERT INTO `konfig` (`kljuc`, `value`) VALUES
	('barvnaShema', 'info'),
	('days', '36'),
	('drawingColor', '#000000'),
	('drawingWidth', '2'),
	('engl', 'Draw 1 line as you obey your imagination and write your father\'s and son\'s name.'),
	('lineColor', '#000000'),
	('lineWidth', '1'),
	('namesANG', 'Saved names - Showing records within {d} days'),
	('namesSLO', 'Shranjena imena - Prikaz zgodovine za {d} dni'),
	('slov', 'Nariši 1 linijo kot ti veleva tvoja imaginacija in napiši ime tvojega očeta in sina.');");
}

$createRecords = executeSQL("CREATE TABLE IF NOT EXISTS `records` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `ip` text COLLATE utf8_slovenian_ci NOT NULL,
  `nameFather` text COLLATE utf8_slovenian_ci NOT NULL,
  `nameSon` text COLLATE utf8_slovenian_ci NOT NULL,
  `coords` text COLLATE utf8_slovenian_ci NOT NULL,
  `coordsInv` text COLLATE utf8_slovenian_ci NOT NULL,
  `offCenter` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;");

$createArchive = executeSQL("CREATE TABLE IF NOT EXISTS `archive` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `oldID` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `ip` text COLLATE utf8_slovenian_ci NOT NULL,
  `nameFather` text COLLATE utf8_slovenian_ci NOT NULL,
  `nameSon` text COLLATE utf8_slovenian_ci NOT NULL,
  `coords` text COLLATE utf8_slovenian_ci NOT NULL,
  `coordsInv` text COLLATE utf8_slovenian_ci NOT NULL,
  `offCenter` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;");


echo "Postopek končan";

if(!$createKonfig->success){
	echo "<br>-------------------------<br>";
	echo "Napaka pri tabeli Konfig!<br>";
	echo $createKonfig->error;
}

if(!$createRecords->success){
	echo "<br>-------------------------<br>";
	echo "Napaka pri tabeli Records!<br>";
	echo $createRecords->error;
}

if(!$createArchive->success){
	echo "<br>-------------------------<br>";
	echo "Napaka pri tabeli Archive!<br>";
	echo $createArchive->error;
}


?>
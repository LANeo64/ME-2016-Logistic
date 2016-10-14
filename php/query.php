<?php
/**
 * Získá data z databáze
 */

include "dbHandler.php";

$from = 0;
// Validace vstupních parametrů
if(isset($_GET["from"]))
{
	$from = (int)$_GET["from"];
}

if($from < 0)
{
	$from = 0;
}

// Dotaz na databázi
$dbHandler = getDatabase();
$query = $dbHandler->prepare("SELECT * FROM Gifts LIMIT 10 OFFSET :fromLimit");												
$query->bindParam(':fromLimit', $from, PDO::PARAM_INT);
$query->execute();

echo "{'data': ".json_encode($query->fetchAll())."}";
?>

<?php
/**
 * Získá data z databáze
 */

include "dbHandler.php";

$dbHandler = getDatabase();
$query = $dbHandler->prepare("SELECT * FROM Gifts");
$query->execute();
echo "{'data': ".json_encode($query->fetchAll())."}";
?>

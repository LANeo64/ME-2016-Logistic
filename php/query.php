<?php
/**
 * Získá data z databáze
 */

include "dbHandler.php";

$dbHandler = getDatabase();
$query = $dbHandler->prepare("SELECT * FROM goods");
echo json_encode($query->fetchAll());
?>

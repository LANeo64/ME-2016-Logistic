<?php
/**
 * Vypíše data na základě payload parametru
 */

include "dbHandler.php";

$payload = $_POST['payload'];

// Dotaz na databázi
$dbHandler = getDatabase();
if($payload == "users")
{
	$query = $dbHandler->prepare("SELECT `user_id`, `name` FROM Users");
	$query->execute();

	echo json_encode($query->fetchAll());
}
elseif($payload == "storage")
{
	$query = $dbHandler->prepare("SELECT `place_id`, `place` FROM Place");
	$query->execute();
	echo json_encode($query->fetchAll());
}
?>

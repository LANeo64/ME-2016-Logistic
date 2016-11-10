<?php
/**
 * Uloží data do databáze. Přejímá 1 povinný parametr data 
 */

if(!isset($_POST["data"]))
{
	header('HTTP/1.1 400 Bad request');
	die();
}

//header('Content-type: application/json');
include "dbHandler.php";

try{
	$data = json_decode($_POST["data"], true);

	// Dotaz na databázi
	$dbHandler = getDatabase();
	$id = (int)$data['user'];
	for($i = 0; $i < (int)$data['item_count']; $i++)
	{
		$query = $dbHandler->prepare("INSERT INTO Gifts(`user_id`, `name`, `count`, `type`, `place`, `price`, `predicted_price`) Values(:userID, :name, :count, :type, :place, :price, :predicted_price)");
		$query->bindParam(':userID', $id, PDO::PARAM_INT);
		$name = $data["items"][$i]['name'];
		$query->bindParam(':name', $name);
		$count = (int)$data["items"][$i]['quantity'];
		$query->bindParam(':count', $count, PDO::PARAM_INT);
		$price = (int)$data["items"][$i]['buy_price'];
		$query->bindParam(':price', $price, PDO::PARAM_INT);
		$predicted_price = (int)$data["items"][$i]['sell_price'];
		$query->bindParam(':predicted_price', $predicted_price, PDO::PARAM_INT);
		$type = (int)$data["items"][$i]['perishable'] === 1;
		$query->bindParam(':type', $type, PDO::PARAM_BOOL);
		$place = $data["items"][$i]['storage'];
		$query->bindParam(':place', $place);
		$query->execute();
	}
	header('HTTP/1.1 200 OK');
}
catch(Exception $e)
{
	header('HTTP/1.1 400 Bad request');
	die($e);
}
?>

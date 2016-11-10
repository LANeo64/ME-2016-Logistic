<?php
/**
 * Získá data z databáze
 */

include "dbHandler.php";

// Dotaz na databázi
$dbHandler = getDatabase();
$query = $dbHandler->prepare("SELECT Users.name as \"user_name\", Gifts.name, `count`, `type`, `place`, `price`, `predicted_price` FROM Gifts LEFT JOIN Users ON Users.user_id = Gifts.user_id");
$query->execute();

echo json_encode($query->fetchAll());
?>

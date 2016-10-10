<?php
/**
 * Načte konfigurační soubor, který musí obsahovat následující atributy.
 * host - adresa databáze
 * user - uživatelské jméno
 * password - heslo
 */
function loadDatabaseCredentials()
{
	$data = parse_ini_file("config.ini");
	if($data == False)
	{
		throw new Exception("Konfigurační soubor nebyl nalezen");
	}
	return $data;
}

/**
 * Vrátí handler pro databázi.
 */
function getDatabase()
{
	$credentials = loadDatabaseCredentials();
	assert(isset($credentials["host"]), "Host se nenachází v konfiguračním souboru!");
	assert(isset($credentials["user"]), "User se nenachází v konfiguračním souboru!");
	assert(isset($credentials["password"]), "Password se nenachází v konfiguračním souboru!");
	$host = $credentials["host"];
	$user = $credentials["user"];
	$password = $credentials["password"];
	$charset = "utf8";
	$db = "ME";
	$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
	$opt = [
		PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
	];
	$handler = new PDO($dsn, $user, $password, $opt);
	$handler->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $handler;
}
?>

<?php
$serverName = "localhost";
$username = "";
$password = "";

$conn = new mysqli($serverName, $username, $password);

if ($conn -> connect_error){
    die("Conection failed: ". $conn->connect_error);
}
echo "Connected succesfully";

$sql="CREATE DATABASE myDB";
if($conn-> query($sql) === TRUE){
echo"Database created successfully";
} else{
    echo "Error creating database: ".$conn->error;
}
$conn->close();
?>
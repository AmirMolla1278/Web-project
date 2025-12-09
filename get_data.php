<?php
header('Content-Type: application/json');
include 'db_connection.php';

$sql = "SELECT * FROM Users";
$result = $conn->query($sql);

$users = array();
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $users[] = $row;
  }
}

echo json_encode($users);

$conn->close();
?>
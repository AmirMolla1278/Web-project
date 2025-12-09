<?php
header('Content-Type: application/json');
include 'db_connection.php';

$sql = "SELECT * FROM Courses";
$result = $conn->query($sql);

$courses = array();
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $courses[] = $row;
  }
}

echo json_encode($courses);

$conn->close();
?>
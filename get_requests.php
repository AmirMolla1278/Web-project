<?php
header('Content-Type: application/json');
include 'db_connection.php';

$sql = "SELECT r.*, u.name as requestedByName FROM Requests r LEFT JOIN Users u ON r.requestedBy = u.id";
$result = $conn->query($sql);

$requests = array();
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $row['requestedBy'] = $row['requestedByName'];
    unset($row['requestedByName']);
    $requests[] = $row;
  }
}

echo json_encode($requests);

$conn->close();
?>
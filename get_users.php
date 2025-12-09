<?php
header('Content-Type: application/json');
include 'db_connection.php';

$sql = "SELECT u.*, GROUP_CONCAT(b.name) as badges FROM Users u LEFT JOIN User_Badges ub ON u.id = ub.user_id LEFT JOIN Badges b ON ub.badge_id = b.id GROUP BY u.id";
$result = $conn->query($sql);

$users = array();
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $row['badges'] = $row['badges'] ? explode(',', $row['badges']) : [];
    $users[] = $row;
  }
}

echo json_encode($users);

$conn->close();
?>
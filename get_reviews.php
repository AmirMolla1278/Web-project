<?php
header('Content-Type: application/json');
include 'db_connection.php';

$noteId = isset($_GET['noteId']) ? (int)$_GET['noteId'] : 0;

if ($noteId > 0) {
    $sql = "SELECT r.*, u.name as userName FROM Reviews r JOIN Users u ON r.userId = u.id WHERE r.noteId = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $noteId);
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = array();
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        $reviews[] = $row;
      }
    }
    echo json_encode($reviews);
    $stmt->close();
} else {
    echo json_encode([]);
}

$conn->close();
?>
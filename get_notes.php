<?php
header('Content-Type: application/json');
include 'db_connection.php';

$sql = "SELECT n.*, u.name as uploadedByName FROM Notes n JOIN Users u ON n.uploadedBy = u.id";
$result = $conn->query($sql);

$notes = array();
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    // The `uploadedBy` column in the database is just an ID.
    // The frontend expects an object with user details.
    // We've fetched the user's name, so let's create a basic object.
    $row['uploadedBy'] = ['id' => $row['uploadedBy'], 'name' => $row['uploadedByName']];
    unset($row['uploadedByName']); // Clean up the extra field

    // The frontend also expects a 'reviews' array for each note.
    // We'll fetch reviews separately for a given note when needed,
    // so for now, we'll just add an empty array.
    $row['reviews'] = [];

    // The frontend expects the date to be in a specific format,
    // let's rename 'date_uploaded' to 'date'.
    $row['date'] = $row['date_uploaded'];
    unset($row['date_uploaded']);


    $notes[] = $row;
  }
}

echo json_encode($notes);

$conn->close();
?>
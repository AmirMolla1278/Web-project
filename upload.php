<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log errors to a file (optional, if you can get it working)
ini_set('log_errors', 1);
ini_set('error_log', 'error_log.txt');


header('Content-Type: application/json');
include 'db_connection.php';

$response = ['success' => false, 'message' => 'An unknown error occurred.'];

if (isset($_POST['driveLink']) && isset($_POST['title'])) {
    $course = $_POST['course'];
    $title = $_POST['title'];
    $topic = $_POST['topic'];
    $date = $_POST['date'];
    $userId = (int)$_POST['userId'];
    $driveLink = $_POST['driveLink'];

    // Include userId in the response message for debugging
    $response['debug_userId'] = $userId;


    $sql = "INSERT INTO Notes (title, courseCode, topic, date_uploaded, uploadedBy, driveLink) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    // Note: The 's' for driveLink assumes VARCHAR in DB. If TEXT, it's still 's'.
    $stmt->bind_param("ssssis", $title, $course, $topic, $date, $userId, $driveLink);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Your note has been added successfully.";
    } else {
        $response['message'] = "Error inserting into database: " . $conn->error;
    }
    $stmt->close();
} else {
    $response['message'] = 'Required data not provided.';
}

echo json_encode($response);
$conn->close();
?>
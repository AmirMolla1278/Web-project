<?php
header('Content-Type: application/json');
include 'db_connection.php';

$response = ['success' => false, 'message' => 'An unknown error occurred.'];

if (isset($_POST['email']) && isset($_POST['name'])) {
    $email = $_POST['email'];
    $name = $_POST['name'];

    $sql = "INSERT INTO Users (name, email) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $name, $email);

    if ($stmt->execute()) {
        $new_user_id = $conn->insert_id;
        $sql = "SELECT * FROM Users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $new_user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $new_user = $result->fetch_assoc();

        $response['success'] = true;
        $response['message'] = "User registered successfully.";
        $response['user'] = $new_user;

    } else {
        $response['message'] = "Error registering user: " . $conn->error;
    }
    $stmt->close();
} else {
    $response['message'] = 'Required data not provided.';
}

echo json_encode($response);
$conn->close();
?>
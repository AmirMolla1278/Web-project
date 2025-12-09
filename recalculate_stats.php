<?php
include 'db_connection.php';

echo "Recalculating statistics...<br>";

// Recalculate notesCount for Courses
$sql = "UPDATE Courses c SET c.notesCount = (SELECT COUNT(*) FROM Notes n WHERE n.courseCode = c.code)";
if ($conn->query($sql) === TRUE) {
    echo "Courses notesCount updated successfully.<br>";
} else {
    echo "Error updating courses: " . $conn->error . "<br>";
}

// Recalculate totalUploads for Users
$sql = "UPDATE Users u SET u.totalUploads = (SELECT COUNT(*) FROM Notes n WHERE n.uploadedBy = u.id)";
if ($conn->query($sql) === TRUE) {
    echo "Users totalUploads updated successfully.<br>";
} else {
    echo "Error updating users: " . $conn->error . "<br>";
}

// Recalculate rating and totalRatings for Notes
$sql = "UPDATE Notes n SET n.totalRatings = (SELECT COUNT(*) FROM Reviews r WHERE r.noteId = n.id)";
if ($conn->query($sql) === TRUE) {
    echo "Notes totalRatings updated successfully.<br>";
} else {
    echo "Error updating notes totalRatings: " . $conn->error . "<br>";
}

$sql = "UPDATE Notes n SET n.rating = (SELECT AVG(r.rating) FROM Reviews r WHERE r.noteId = n.id) WHERE n.totalRatings > 0";
if ($conn->query($sql) === TRUE) {
    echo "Notes rating updated successfully.<br>";
} else {
    echo "Error updating notes rating: " . $conn->error . "<br>";
}

// Set rating to 0 where there are no ratings
$sql = "UPDATE Notes SET rating = 0 WHERE totalRatings = 0";
if ($conn->query($sql) === TRUE) {
    echo "Notes with no ratings set to 0.<br>";
} else {
    echo "Error updating notes with no ratings: " . $conn->error . "<br>";
}


echo "Statistics recalculation complete.";

$conn->close();
?>
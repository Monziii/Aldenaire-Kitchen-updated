<?php
require_once '../config.php';

// Helper function to send JSON response (using the one from main config)
function sendResponse($data, $status = 200) {
    send_json_response($data, $status);
}

// Helper function to send error response
function sendError($message, $status = 400) {
    send_json_response(['error' => $message], $status);
}
?> 
<?php
/**
 * Aldenaire Kitchen - Configuration File
 * 
 * This file contains all the configuration settings for the restaurant website.
 */

// Database Configuration
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'aldenaire_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// Application Configuration
define('APP_NAME', 'Aldenaire Kitchen');
define('APP_URL', 'http://localhost/Final_project');
define('APP_VERSION', '1.0.0');

// Restaurant Information
define('RESTAURANT_NAME', 'Aldenaire Kitchen');
define('RESTAURANT_ADDRESS', '123 Restaurant Street, Food City, FC 12345');
define('RESTAURANT_PHONE', '+1 (555) 123-4567');
define('RESTAURANT_EMAIL', 'info@aldenairekitchen.com');

// Business Hours
define('WEEKDAY_HOURS', 'Monday - Friday: 11:00 AM - 10:00 PM');
define('WEEKEND_HOURS', 'Saturday - Sunday: 12:00 PM - 11:00 PM');

// Tax Configuration (removed - not used in current implementation)

// API Configuration
define('API_BASE_URL', APP_URL . '/api');
define('API_TIMEOUT', 30); // seconds

// Security Configuration
define('CSRF_TOKEN_NAME', 'csrf_token');
define('SESSION_TIMEOUT', 3600); // 1 hour

// File Upload Configuration
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

// Pagination Configuration
define('ITEMS_PER_PAGE', 12);
define('REVIEWS_PER_PAGE', 10);

// Error Reporting (set to false in production)
define('DEBUG_MODE', true);

if (DEBUG_MODE) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(0);
}

// Timezone
date_default_timezone_set('America/New_York');

// Session Configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Helper Functions
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function generate_csrf_token() {
    if (!isset($_SESSION[CSRF_TOKEN_NAME])) {
        $_SESSION[CSRF_TOKEN_NAME] = bin2hex(random_bytes(32));
    }
    return $_SESSION[CSRF_TOKEN_NAME];
}

function verify_csrf_token($token) {
    return isset($_SESSION[CSRF_TOKEN_NAME]) && hash_equals($_SESSION[CSRF_TOKEN_NAME], $token);
}

function format_price($price) {
    return '$' . number_format($price, 2);
}

function format_date($date) {
    return date('F j, Y', strtotime($date));
}

function is_ajax_request() {
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
           strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function send_json_response($data, $status_code = 200) {
    // Enhanced CORS Configuration
    $allowed_origins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://localhost',
        'http://localhost/Final_project',
        'https://aldenaire.com',
        'https://www.aldenaire.com'
    ];

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header('Access-Control-Allow-Origin: *');
    }

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control');
    header('Access-Control-Max-Age: 86400');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
    
    http_response_code($status_code);
    header('Content-Type: application/json; charset=utf-8');
    
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function log_error($message, $context = []) {
    if (DEBUG_MODE) {
        error_log("[" . date('Y-m-d H:i:s') . "] ERROR: " . $message . " " . json_encode($context));
    }
}

function log_info($message, $context = []) {
    if (DEBUG_MODE) {
        error_log("[" . date('Y-m-d H:i:s') . "] INFO: " . $message . " " . json_encode($context));
    }
}
?> 
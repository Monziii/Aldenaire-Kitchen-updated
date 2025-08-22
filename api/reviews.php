<?php
/**
 * Reviews API Endpoint
 * 
 * Handles customer reviews CRUD operations
 */

require_once '../config.php';
require_once '../includes/db.php';

// Advanced CORS Configuration for Production and Development
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://localhost',
    'http://localhost/Final_project',
    'https://aldenaire.com', // Production domain
    'https://www.aldenaire.com'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control');
header('Access-Control-Max-Age: 86400'); // 24 hours cache for preflight
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get all reviews
        $sql = "
            SELECT 
                r.id,
                r.customer_name,
                r.rating,
                r.comment,
                r.created_at,
                r.is_approved,
                r.item_id,
                m.item_name
            FROM reviews r
            LEFT JOIN menu_items m ON r.item_id = m.item_id
            WHERE r.is_approved = 1
            ORDER BY r.created_at DESC
        ";
        
        $reviews = fetch_all($sql);
        
        // Format the response
        $response = [
            'success' => true,
            'message' => 'Reviews retrieved successfully',
            'reviews' => $reviews,
            'total_reviews' => count($reviews)
        ];
        
        send_json_response($response);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Add new review
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            throw new Exception('Invalid JSON input');
        }
        
        // Validate required fields
        $required_fields = ['customer_name', 'rating', 'comment'];
        foreach ($required_fields as $field) {
            if (empty($input[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }
        
        // Sanitize input
        $customer_name = sanitize_input($input['customer_name']);
        $rating = intval($input['rating']);
        $comment = sanitize_input($input['comment']);
        
        // Validate rating
        if ($rating < 1 || $rating > 5) {
            throw new Exception('Rating must be between 1 and 5');
        }
        
        // Validate item_id if provided
        $item_id = null;
        if (isset($input['item_id']) && !empty($input['item_id'])) {
            $item_id = intval($input['item_id']);
            // Verify the menu item exists
            $menu_item = fetch_one("SELECT item_id FROM menu_items WHERE item_id = ? AND is_available = 1", [$item_id]);
            if (!$menu_item) {
                throw new Exception("Menu item with ID $item_id not found or not available");
            }
        }
        
        // Insert new review
        $sql = "
            INSERT INTO reviews (customer_name, rating, comment, item_id)
            VALUES (?, ?, ?, ?)
        ";
        
        $review_id = insert_data($sql, [$customer_name, $rating, $comment, $item_id]);
        
        // Get the newly created review
        $new_review = fetch_one("
            SELECT 
                r.id,
                r.customer_name,
                r.rating,
                r.comment,
                r.created_at,
                r.is_approved,
                r.item_id,
                m.item_name
            FROM reviews r
            LEFT JOIN menu_items m ON r.item_id = m.item_id
            WHERE r.id = ?
        ", [$review_id]);
        
        $response = [
            'success' => true,
            'message' => 'Review submitted successfully',
            'review' => $new_review
        ];
        
        send_json_response($response, 201);
        
    } else {
        throw new Exception('Method not allowed');
    }
    
} catch (Exception $e) {
    log_error('Reviews API Error: ' . $e->getMessage());
    
    $response = [
        'success' => false,
        'error' => $e->getMessage()
    ];
    
    send_json_response($response, 400);
}
?> 
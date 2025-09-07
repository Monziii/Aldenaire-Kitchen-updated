<?php
/**
 * Mock Stripe Payment API for Testing
 * This creates a mock payment system for development/testing
 */

require_once '../config.php';

// Advanced CORS Configuration
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
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control');
header('Access-Control-Max-Age: 86400');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    send_json_response(['error' => 'Method not allowed'], 405);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid input data');
    }
    
    $amount = $input['amount'] ?? 0;
    $customer_name = $input['customer_name'] ?? '';
    $items = $input['items'] ?? [];
    
    if ($amount <= 0) {
        throw new Exception('Invalid amount');
    }
    
    if (empty($customer_name)) {
        throw new Exception('Customer name is required');
    }
    
    // Mock payment processing
    $payment_intent_id = 'pi_mock_' . uniqid();
    $client_secret = 'pi_mock_' . uniqid() . '_secret_' . bin2hex(random_bytes(16));
    
    // Simulate processing delay
    usleep(500000); // 0.5 seconds
    
    $response = [
        'client_secret' => $client_secret,
        'payment_intent_id' => $payment_intent_id,
        'status' => 'requires_payment_method',
        'amount' => $amount,
        'currency' => 'usd',
        'metadata' => [
            'customer_name' => $customer_name,
            'items_count' => count($items)
        ]
    ];
    
    send_json_response($response);
    
} catch (Exception $e) {
    log_error('Mock Stripe Payment Error: ' . $e->getMessage());
    send_json_response(['error' => $e->getMessage()], 400);
}
?> 
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// مفتاح Stripe السري - تم تحديثه
$stripe_secret_key = 'PlaceHolder';

require_once '../vendor/autoload.php';

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
    
    // تهيئة Stripe
    \Stripe\Stripe::setApiKey($stripe_secret_key);
    
    // إنشاء Payment Intent
    $payment_intent = \Stripe\PaymentIntent::create([
        'amount' => $amount,
        'currency' => 'usd',
        'metadata' => [
            'customer_name' => $customer_name,
            'items_count' => count($items)
        ],
        'description' => 'Food order from Aldenaire Kitchen'
    ]);
    
    echo json_encode([
        'client_secret' => $payment_intent->client_secret,
        'payment_intent_id' => $payment_intent->id
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
} catch (\Stripe\Exception\ApiErrorException $e) {
    http_response_code(400);
    echo json_encode(['error' => 'Payment processing error: ' . $e->getMessage()]);
}
?> 
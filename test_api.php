<?php
/**
 * API Test Script for Aldenaire Kitchen
 * 
 * This script tests all API endpoints to ensure they are working correctly.
 */

require_once 'config.php';

// Test configuration
$base_url = 'http://localhost/Final_project/api';
$test_results = [];

// Helper function to make API requests
function testApiEndpoint($url, $method = 'GET', $data = null) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return ['success' => false, 'error' => $error];
    }
    
    $response_data = json_decode($response, true);
    return [
        'success' => $http_code >= 200 && $http_code < 300,
        'http_code' => $http_code,
        'response' => $response_data,
        'raw_response' => $response
    ];
}

// Test 1: Menu API
echo "Testing Menu API...\n";
$menu_test = testApiEndpoint($base_url . '/menu.php');
$test_results['menu'] = $menu_test;

if ($menu_test['success']) {
    $menu_items = $menu_test['response']['menu_items'] ?? [];
    echo "✅ Menu API: " . count($menu_items) . " items found\n";
} else {
    echo "❌ Menu API failed: " . ($menu_test['error'] ?? 'Unknown error') . "\n";
}

// Test 2: Reviews API (GET)
echo "Testing Reviews API (GET)...\n";
$reviews_get_test = testApiEndpoint($base_url . '/reviews.php');
$test_results['reviews_get'] = $reviews_get_test;

if ($reviews_get_test['success']) {
    $reviews = $reviews_get_test['response']['reviews'] ?? [];
    echo "✅ Reviews API (GET): " . count($reviews) . " reviews found\n";
} else {
    echo "❌ Reviews API (GET) failed: " . ($reviews_get_test['error'] ?? 'Unknown error') . "\n";
}

// Test 3: Reviews API (POST)
echo "Testing Reviews API (POST)...\n";
$review_data = [
    'customer_name' => 'API Test User',
    'rating' => 5,
    'comment' => 'This is a test review from the API test script.',
    'item_id' => 1
];
$reviews_post_test = testApiEndpoint($base_url . '/reviews.php', 'POST', $review_data);
$test_results['reviews_post'] = $reviews_post_test;

if ($reviews_post_test['success']) {
    echo "✅ Reviews API (POST): Review submitted successfully\n";
} else {
    echo "❌ Reviews API (POST) failed: " . ($reviews_post_test['error'] ?? 'Unknown error') . "\n";
}

// Test 4: Contact API (POST)
echo "Testing Contact API (POST)...\n";
$contact_data = [
    'name' => 'API Test User',
    'email' => 'test@example.com',
    'subject' => 'API Test',
    'message' => 'This is a test contact message from the API test script.'
];
$contact_post_test = testApiEndpoint($base_url . '/contact.php', 'POST', $contact_data);
$test_results['contact_post'] = $contact_post_test;

if ($contact_post_test['success']) {
    echo "✅ Contact API (POST): Contact message submitted successfully\n";
} else {
    echo "❌ Contact API (POST) failed: " . ($contact_post_test['error'] ?? 'Unknown error') . "\n";
}

// Test 5: Orders API (POST)
echo "Testing Orders API (POST)...\n";
$order_data = [
    'customer_name' => 'API Test Customer',
    'customer_email' => 'customer@example.com',
    'customer_phone' => '123-456-7890',
    'delivery_address' => '123 Test Street, Test City',
    'items' => [
        [
            'item_id' => 1,
            'quantity' => 2,
            'price' => 12.99
        ],
        [
            'item_id' => 2,
            'quantity' => 1,
            'price' => 15.99
        ]
    ],
    'notes' => 'Test order from API test script'
];
$orders_post_test = testApiEndpoint($base_url . '/orders.php', 'POST', $order_data);
$test_results['orders_post'] = $orders_post_test;

if ($orders_post_test['success']) {
    echo "✅ Orders API (POST): Order submitted successfully\n";
} else {
    echo "❌ Orders API (POST) failed: " . ($orders_post_test['error'] ?? 'Unknown error') . "\n";
}

// Test 6: Orders API (GET)
echo "Testing Orders API (GET)...\n";
$orders_get_test = testApiEndpoint($base_url . '/orders.php');
$test_results['orders_get'] = $orders_get_test;

if ($orders_get_test['success']) {
    $orders = $orders_get_test['response']['orders'] ?? [];
    echo "✅ Orders API (GET): " . count($orders) . " orders found\n";
} else {
    echo "❌ Orders API (GET) failed: " . ($orders_get_test['error'] ?? 'Unknown error') . "\n";
}

// Summary
echo "\n" . str_repeat("=", 50) . "\n";
echo "API TEST SUMMARY\n";
echo str_repeat("=", 50) . "\n";

$passed_tests = 0;
$total_tests = count($test_results);

foreach ($test_results as $test_name => $result) {
    $status = $result['success'] ? '✅ PASS' : '❌ FAIL';
    echo sprintf("%-20s %s\n", $test_name, $status);
    if ($result['success']) {
        $passed_tests++;
    }
}

echo str_repeat("=", 50) . "\n";
echo "Results: $passed_tests/$total_tests tests passed\n";

if ($passed_tests === $total_tests) {
    echo "🎉 All API tests passed! The API is working correctly.\n";
} else {
    echo "⚠️  Some tests failed. Please check the API configuration.\n";
}

echo str_repeat("=", 50) . "\n";
?> 
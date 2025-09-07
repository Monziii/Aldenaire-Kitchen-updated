<?php
/**
 * Orders API
 * 
 * Handles order creation and management
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

// Security and CORS Headers
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
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Handle order creation
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            throw new Exception('Invalid JSON input');
        }
        
        // Validate required fields
        $required_fields = ['customer_name', 'items'];
        foreach ($required_fields as $field) {
            if (empty($input[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }
        
        // Validate items array
        if (!is_array($input['items']) || empty($input['items'])) {
            throw new Exception('Items must be a non-empty array');
        }
        
        // Sanitize input
        $customer_name = sanitize_input($input['customer_name']);
        $customer_email = isset($input['customer_email']) ? sanitize_input($input['customer_email']) : '';
        $customer_phone = isset($input['customer_phone']) ? sanitize_input($input['customer_phone']) : '';
        $delivery_address = isset($input['delivery_address']) ? sanitize_input($input['delivery_address']) : '';
        $notes = isset($input['notes']) ? sanitize_input($input['notes']) : '';
        
        // Set default values for required fields if not provided
        if (empty($customer_phone)) {
            $customer_phone = 'Not provided';
        }
        
        // Validate email if provided
        if ($customer_email && !filter_var($customer_email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email address');
        }
        
        // Calculate totals
        $total_amount = 0;
        $items_data = [];
        
        foreach ($input['items'] as $item) {
            if (empty($item['item_id']) || empty($item['quantity']) || empty($item['price'])) {
                throw new Exception('Invalid item data');
            }
            
            $item_id = intval($item['item_id']);
            $quantity = intval($item['quantity']);
            $price = floatval($item['price']);
            
            if ($quantity <= 0 || $price <= 0) {
                throw new Exception('Invalid quantity or price');
            }
            
            // Validate menu item exists
            $menu_item = fetch_one("SELECT item_id, item_name, price FROM menu_items WHERE item_id = ? AND is_available = 1", [$item_id]);
            if (!$menu_item) {
                throw new Exception("Menu item with ID $item_id not found or not available");
            }
            
            $item_total = $price * $quantity;
            $total_amount += $item_total;
            
            $items_data[] = [
                'item_id' => $item_id,
                'item_name' => $menu_item['item_name'],
                'quantity' => $quantity,
                'unit_price' => $price,
                'total_price' => $item_total
            ];
        }
        
        if ($total_amount <= 0) {
            throw new Exception('Order total must be greater than 0');
        }
        
        // Start transaction
        $conn->beginTransaction();
        
        try {
            // Insert order
            $order_sql = "
                INSERT INTO orders (
                    customer_name, customer_email, customer_phone, 
                    delivery_address, total_amount, notes
                ) VALUES (?, ?, ?, ?, ?, ?)
            ";
            
            $order_id = insert_data($order_sql, [
                $customer_name, $customer_email, $customer_phone,
                $delivery_address, $total_amount, $notes
            ]);
            
            // Insert order items
            foreach ($items_data as $item) {
                $item_sql = "
                    INSERT INTO order_items (
                        order_id, menu_item_id, quantity, unit_price, total_price
                    ) VALUES (?, ?, ?, ?, ?)
                ";
                
                insert_data($item_sql, [
                    $order_id,
                    $item['item_id'],
                    $item['quantity'],
                    $item['unit_price'],
                    $item['total_price']
                ]);
            }
            
            // Commit transaction
            $conn->commit();
            
            // Get the complete order
            $order = fetch_one("SELECT * FROM orders WHERE id = ?", [$order_id]);
            $order_items = fetch_all("SELECT * FROM order_items WHERE order_id = ?", [$order_id]);
            
            $response = [
                'success' => true,
                'message' => 'Order placed successfully!',
                'order' => [
                    'id' => $order_id,
                    'customer_name' => $customer_name,
                    'total_amount' => $total_amount,
                    'status' => 'pending',
                    'items' => $order_items
                ]
            ];
            
            send_json_response($response, 201);
            
        } catch (Exception $e) {
            // Rollback transaction on error
            $conn->rollBack();
            throw $e;
        }
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get orders (admin functionality)
        $sql = "
            SELECT 
                o.*,
                COUNT(oi.id) as item_count
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        ";
        
        $orders = fetch_all($sql);
        
        $response = [
            'success' => true,
            'message' => 'Orders retrieved successfully',
            'orders' => $orders,
            'total_orders' => count($orders)
        ];
        
        send_json_response($response);
        
    } else {
        throw new Exception('Method not allowed');
    }
    
} catch (Exception $e) {
    log_error('Orders API Error: ' . $e->getMessage());
    
    $response = [
        'success' => false,
        'error' => $e->getMessage()
    ];
    
    send_json_response($response, 400);
}
?> 
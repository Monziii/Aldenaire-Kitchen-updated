<?php
/**
 * Database Setup Script for Aldenaire Kitchen
 * 
 * This script creates the database and all necessary tables.
 * Run this script once to set up your database.
 */

// Database configuration
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$dbname = 'aldenaire_db';

try {
    // Connect to MySQL without specifying database
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to MySQL successfully!\n";
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database '$dbname' created or already exists.\n";
    
    // Select the database
    $pdo->exec("USE `$dbname`");
    echo "Using database '$dbname'.\n";
    
    // Create menu_items table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `menu_items` (
            `item_id` int(11) NOT NULL AUTO_INCREMENT,
            `item_name` varchar(255) NOT NULL,
            `description` text,
            `price` decimal(10,2) NOT NULL,
            `category` varchar(100) NOT NULL,
            `image_path` varchar(500),
            `is_available` tinyint(1) DEFAULT 1,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`item_id`),
            KEY `idx_category` (`category`),
            KEY `idx_available` (`is_available`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "Table 'menu_items' created.\n";
    
    // Create reviews table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `reviews` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `customer_name` varchar(255) NOT NULL,
            `rating` int(1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
            `comment` text,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            `is_approved` tinyint(1) DEFAULT 1,
            PRIMARY KEY (`id`),
            KEY `idx_rating` (`rating`),
            KEY `idx_approved` (`is_approved`),
            KEY `idx_created` (`created_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "Table 'reviews' created.\n";
    
    // Create contact_messages table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `contact_messages` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `name` varchar(255) NOT NULL,
            `email` varchar(255) NOT NULL,
            `subject` varchar(255) NOT NULL,
            `message` text NOT NULL,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            `is_read` tinyint(1) DEFAULT 0,
            PRIMARY KEY (`id`),
            KEY `idx_email` (`email`),
            KEY `idx_read` (`is_read`),
            KEY `idx_created` (`created_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "Table 'contact_messages' created.\n";
    
    // Create orders table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `orders` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `customer_name` varchar(255) NOT NULL,
            `customer_email` varchar(255) NOT NULL,
            `customer_phone` varchar(50) NOT NULL,
            `delivery_address` text,
            `total_amount` decimal(10,2) NOT NULL,
            `status` enum('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
            `notes` text,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
            `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_status` (`status`),
            KEY `idx_email` (`customer_email`),
            KEY `idx_created` (`created_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "Table 'orders' created.\n";
    
    // Create order_items table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `order_items` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `order_id` int(11) NOT NULL,
            `menu_item_id` int(11) NOT NULL,
            `quantity` int(11) NOT NULL DEFAULT 1,
            `unit_price` decimal(10,2) NOT NULL,
            `total_price` decimal(10,2) NOT NULL,
            `notes` text,
            PRIMARY KEY (`id`),
            KEY `idx_order` (`order_id`),
            KEY `idx_menu_item` (`menu_item_id`),
            FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
            FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`item_id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "Table 'order_items' created.\n";
    
    // Insert sample menu items
    $sampleMenuItems = [
        ['Grilled Chicken Salad', 'Fresh mixed greens with grilled chicken breast, cherry tomatoes, and balsamic vinaigrette', 12.99, 'Salads', 'grilled-chicken-skinless.png'],
        ['Beef Burger', 'Juicy beef patty with lettuce, tomato, cheese, and special sauce on a brioche bun', 15.99, 'Burgers', 'hd-sapid-chicken-burger-with-french-fries-on-wood-plate-png-701751710858563bp8ufljnki-removebg-preview.png'],
        ['Grilled Fish', 'Fresh grilled fish served with seasonal vegetables and lemon butter sauce', 18.99, 'Main Course', 'grilled-fish-fresh-salad-lemon.png'],
        ['Pasta Primavera', 'Al dente pasta with fresh vegetables in a light cream sauce', 14.99, 'Pasta', 'pngtree-deliciously-vibrant-pasta-dish-with-vegetables-png-image_15824694-removebg-preview.png'],
        ['Chicken Rice Bowl', 'Steamed rice topped with grilled chicken and vegetables', 13.99, 'Rice Dishes', '11.top-view-plate-rice-fried-meat-top-view-plate-rice-fried-meat-white-background-302886539-removebg-preview.png'],
        ['Calamari', 'Crispy fried calamari served with marinara sauce', 9.99, 'Appetizers', 'calamari.png'],
        ['Shrimp Scampi', 'Succulent shrimp in garlic butter sauce with pasta', 16.99, 'Seafood', 'sherimp.png'],
        ['Vegetable Salad', 'Fresh garden vegetables with house dressing', 8.99, 'Salads', 'chicken-salad-front-view-white-background_842983-25656-removebg-preview.png']
    ];
    
    $stmt = $pdo->prepare("
        INSERT IGNORE INTO menu_items (item_name, description, price, category, image_path) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    foreach ($sampleMenuItems as $item) {
        $stmt->execute($item);
    }
    echo "Sample menu items inserted.\n";
    
    // Insert sample reviews
    $sampleReviews = [
        ['Ahmed Hassan', 5, 'Amazing food and excellent service! The grilled chicken salad was perfect.'],
        ['Fatima Ali', 4, 'Great atmosphere and delicious food. Will definitely come back.'],
        ['Omar Khalil', 5, 'Best restaurant in the area. The pasta was cooked perfectly.'],
        ['Layla Ahmed', 4, 'Very good food and reasonable prices. Staff was friendly.'],
        ['Youssef Ibrahim', 5, 'Exceptional quality and taste. Highly recommended!']
    ];
    
    $stmt = $pdo->prepare("
        INSERT IGNORE INTO reviews (customer_name, rating, comment) 
        VALUES (?, ?, ?)
    ");
    
    foreach ($sampleReviews as $review) {
        $stmt->execute($review);
    }
    echo "Sample reviews inserted.\n";
    
    echo "\n✅ Database setup completed successfully!\n";
    echo "Database: $dbname\n";
    echo "Tables created: menu_items, reviews, contact_messages, orders, order_items\n";
    echo "Sample data inserted: menu items and reviews\n";
    
} catch (PDOException $e) {
    die("Database setup failed: " . $e->getMessage() . "\n");
}
?> 
<?php
/**
 * Database Cleanup Script for Aldenaire Kitchen
 * 
 * This script removes duplicate data from the database.
 */

require_once 'config.php';
require_once 'includes/db.php';

try {
    echo "Starting database cleanup...\n";
    
    // Remove duplicate menu items (keep the first occurrence)
    $sql = "
        DELETE m1 FROM menu_items m1
        INNER JOIN menu_items m2 
        WHERE m1.item_id > m2.item_id 
        AND m1.item_name = m2.item_name 
        AND m1.description = m2.description 
        AND m1.price = m2.price
    ";
    
    $affected = update_data($sql);
    echo "Removed $affected duplicate menu items.\n";
    
    // Remove duplicate reviews (keep the first occurrence)
    $sql = "
        DELETE r1 FROM reviews r1
        INNER JOIN reviews r2 
        WHERE r1.id > r2.id 
        AND r1.customer_name = r2.customer_name 
        AND r1.rating = r2.rating 
        AND r1.comment = r2.comment
    ";
    
    $affected = update_data($sql);
    echo "Removed $affected duplicate reviews.\n";
    
    // Reset auto-increment counters
    $conn->exec("ALTER TABLE menu_items AUTO_INCREMENT = 1");
    $conn->exec("ALTER TABLE reviews AUTO_INCREMENT = 1");
    $conn->exec("ALTER TABLE contact_messages AUTO_INCREMENT = 1");
    $conn->exec("ALTER TABLE orders AUTO_INCREMENT = 1");
    $conn->exec("ALTER TABLE order_items AUTO_INCREMENT = 1");
    
    echo "Reset auto-increment counters.\n";
    
    // Get final counts
    $menuCount = fetch_one("SELECT COUNT(*) as count FROM menu_items")['count'];
    $reviewCount = fetch_one("SELECT COUNT(*) as count FROM reviews")['count'];
    $contactCount = fetch_one("SELECT COUNT(*) as count FROM contact_messages")['count'];
    $orderCount = fetch_one("SELECT COUNT(*) as count FROM orders")['count'];
    
    echo "\n✅ Database cleanup completed successfully!\n";
    echo "Final counts:\n";
    echo "- Menu items: $menuCount\n";
    echo "- Reviews: $reviewCount\n";
    echo "- Contact messages: $contactCount\n";
    echo "- Orders: $orderCount\n";
    
} catch (Exception $e) {
    die("Database cleanup failed: " . $e->getMessage() . "\n");
}
?> 
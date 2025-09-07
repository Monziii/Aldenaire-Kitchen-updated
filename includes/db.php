<?php
/**
 * Database Connection File
 * 
 * This file handles the database connection for Aldenaire Kitchen.
 */

require_once __DIR__ . '/../config.php';

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $conn = new PDO($dsn, DB_USER, DB_PASS, $options);
    
    // Set timezone for database connection
    $conn->exec("SET time_zone = '+00:00'");
    
} catch (PDOException $e) {
    if (DEBUG_MODE) {
        die("Connection failed: " . $e->getMessage());
    } else {
        die("Database connection failed. Please try again later.");
    }
}

// Helper function to execute queries safely
function execute_query($sql, $params = []) {
    global $conn;
    
    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch (PDOException $e) {
        log_error("Database query failed: " . $e->getMessage(), [
            'sql' => $sql,
            'params' => $params
        ]);
        throw $e;
    }
}

// Helper function to fetch single row
function fetch_one($sql, $params = []) {
    $stmt = execute_query($sql, $params);
    return $stmt->fetch();
}

// Helper function to fetch all rows
function fetch_all($sql, $params = []) {
    $stmt = execute_query($sql, $params);
    return $stmt->fetchAll();
}

// Helper function to insert data and return last insert ID
function insert_data($sql, $params = []) {
    global $conn;
    
    $stmt = execute_query($sql, $params);
    return $conn->lastInsertId();
}

// Helper function to update data and return affected rows
function update_data($sql, $params = []) {
    $stmt = execute_query($sql, $params);
    return $stmt->rowCount();
}

// Helper function to delete data and return affected rows
function delete_data($sql, $params = []) {
    $stmt = execute_query($sql, $params);
    return $stmt->rowCount();
}
?>

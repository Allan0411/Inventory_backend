<?php
$productId = $_GET['id'] ?? null;

if (!$productId) {
    die("Invalid product ID.");
}

$apiUrl = "http://localhost:3000/api/v1/products/$productId";

$options = [
    'http' => [
        'header' => "Content-Type: application/json",
        'method' => 'DELETE',
    ]
];

$context = stream_context_create($options);
file_get_contents($apiUrl, false, $context);

header("Location: index.php");
exit;
?>

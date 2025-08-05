<?php
$productId = $_GET['id'] ?? null;

if (!$productId) {
    die("Invalid product ID.");
}

$productApi = "http://localhost:3000/api/v1/products/$productId";
$categoryApi = "http://localhost:3000/api/v1/categories";

// Fetch product
$productResponse = file_get_contents($productApi);
$product = $productResponse ? json_decode($productResponse, true) : null;

// Fetch categories
$categoryResponse = file_get_contents($categoryApi);
$categories = $categoryResponse ? json_decode($categoryResponse, true) : [];

if (!$product) {
    die("Product not found.");
}

// Handle update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        "name" => $_POST['name'],
        "category_id" => $_POST['category_id'],
        "description" => $_POST['description'],
        "price" => $_POST['price'],
        "life_time" => $_POST['life_time'],
        "additional_details" => json_decode($_POST['additional_details'], true),
        "is_clearance" => isset($_POST['is_clearance']) ? 1 : 0
    ];

    $options = [
        'http' => [
            'header' => "Content-Type: application/json",
            'method' => 'PUT',
            'content' => json_encode($data),
        ]
    ];
    $context = stream_context_create($options);
    file_get_contents($productApi, false, $context);

    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <title>Edit Product</title>
</head>
<body>
    <h1>Edit Product</h1>
    <form method="POST">
        <label>Name:</label><br>
        <input type="text" name="name" value="<?= htmlspecialchars($product['name']) ?>" required><br><br>

        <label>Category:</label><br>
        <select name="category_id" required>
            <option value="">-- Select Category --</option>
            <?php foreach ($categories as $cat): ?>
                <option value="<?= $cat['category_id'] ?>" <?= $cat['category_id'] == $product['category_id'] ? 'selected' : '' ?>>
                    <?= htmlspecialchars($cat['name']) ?>
                </option>
            <?php endforeach; ?>
        </select><br><br>

        <label>Description:</label><br>
        <input type="text" name="description" value="<?= htmlspecialchars($product['description']) ?>"><br><br>

        <label>Price:</label><br>
        <input type="number" name="price" value="<?= htmlspecialchars($product['price']) ?>" step="0.01"><br><br>

        <label>Lifetime (months):</label><br>
        <input type="number" name="life_time" value="<?= htmlspecialchars($product['life_time']) ?>"><br><br>

        <label>Additional Details (JSON):</label><br>
        <textarea name="additional_details"><?= htmlspecialchars(json_encode($product['additional_details'])) ?></textarea><br><br>

        <label>
            <input type="checkbox" name="is_clearance" <?= $product['is_clearance'] ? 'checked' : '' ?>> Clearance Item
        </label><br><br>

        <button type="submit">Update</button>
    </form>
</body>
</html>

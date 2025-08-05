<?php
$productId = $_GET['product_id'] ?? null;
$baseApiUrl = "http://localhost:3000/api/v1/products";

if ($productId) {
    // Fetch single product
    $response = file_get_contents("$baseApiUrl/$productId");
    $product = $response ? json_decode($response, true) : null;
    $products = $product ? [$product] : [];
} else {
    // Fetch all products
    $response = file_get_contents($baseApiUrl);
    $products = $response ? json_decode($response, true) : [];
}

if (!$products) {
    echo "<p style='color: red;'>Could not fetch products.</p>";
}
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <title>Product List</title>
</head>
<body>
    <h1>Product List</h1>

    <form method="GET" style="margin-bottom: 20px;">
        <input type="text" name="product_id" placeholder="Search by Product ID" value="<?= htmlspecialchars($productId ?? '') ?>">
        <button type="submit">Search</button>
        <a href="index.php" style="margin-left: 10px;">Clear</a>
    </form>

    <a href="create.php" class="button">Add Product</a>

    <table>
        <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Lifetime</th>
            <th>Actions</th>
        </tr>
        <?php foreach ($products as $product): ?>
        <tr>
            <td><?= htmlspecialchars($product['name']) ?></td>
            <td><?= htmlspecialchars($product['category_name']) ?></td>
            <td><?= htmlspecialchars($product['price']) ?></td>
            <td><?= htmlspecialchars($product['life_time']) ?></td>
            <td>
                <a href="edit.php?id=<?= $product['product_id'] ?>" class="button">Edit</a>
                <a href="delete.php?id=<?= $product['product_id'] ?>" class="button" onclick="return confirm('Are you sure?')">Delete</a>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>

<?php
// Fetch categories from the API
$categoryApi = "http://localhost:3000/api/v1/categories";
$categoryResponse = file_get_contents($categoryApi);
$categories = $categoryResponse ? json_decode($categoryResponse, true) : [];

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
            'header'  => "Content-Type: application/json",
            'method'  => 'POST',
            'content' => json_encode($data),
        ]
    ];
    $context = stream_context_create($options);
    file_get_contents("http://localhost:3000/api/v1/products", false, $context);

    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <title>Add Product</title>
</head>
<body>
    <h1>Add Product</h1>
    <form method="POST">
        <label>Name:</label><br>
        <input type="text" name="name" placeholder="Product Name" required><br><br>

        <label>Category:</label><br>
        <select name="category_id" required>
            <option value="">-- Select Category --</option>
            <?php foreach ($categories as $cat): ?>
                <option value="<?= htmlspecialchars($cat['category_id']) ?>">
                    <?= htmlspecialchars($cat['name']) ?>
                </option>
            <?php endforeach; ?>
        </select><br><br>

        <label>Description:</label><br>
        <input type="text" name="description" placeholder="Description"><br><br>

        <label>Price:</label><br>
        <input type="number" name="price" placeholder="0.00" step="0.01"><br><br>

        <label>Lifetime (in months):</label><br>
        <input type="number" name="life_time" placeholder="12"><br><br>

        <label>Additional Details (JSON format):</label><br>
        <textarea name="additional_details" placeholder='{"color":"red","warranty":"1 year"}'></textarea><br><br>

        <label>
            <input type="checkbox" name="is_clearance"> Clearance Item
        </label><br><br>

        <button type="submit">Submit</button>
    </form>
</body>
</html>

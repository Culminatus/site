<?php
$projectName = $_POST['projectName'];
$targetDir = __DIR__ . "/" . $projectName . "/";

if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

$response = ["coverImagePath" => "", "galleryPaths" => []];

// Kapak görseli yükleme
if(isset($_FILES['coverImage'])) {
    $path = $targetDir . basename($_FILES['coverImage']['name']);
    move_uploaded_file($_FILES['coverImage']['tmp_name'], $path);
    $response["coverImagePath"] = "assets/images/" . $projectName . "/" . $_FILES['coverImage']['name'];
}

// Galeri yükleme
if(isset($_FILES['gallery'])) {
    foreach($_FILES['gallery']['name'] as $key => $name) {
        $path = $targetDir . basename($name);
        move_uploaded_file($_FILES['gallery']['tmp_name'][$key], $path);
        $response["galleryPaths"][] = "assets/images/" . $projectName . "/" . $name;
    }
}

echo json_encode($response);
?>

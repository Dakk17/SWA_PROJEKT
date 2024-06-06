<?php
header('Content-Type: application/json');

// Cesta k JSON souboru
$jsonFilePath = 'tasks.json';

// Funkce pro načtení dat z JSON souboru
function loadData($filePath) {
    if (!file_exists($filePath)) {
        return [];
    }
    $jsonData = file_get_contents($filePath);
    if ($jsonData === false) {
        error_log("Error reading JSON file");
        return [];
    }
    return json_decode($jsonData, true);
}

// Funkce pro uložení dat do JSON souboru
function saveData($filePath, $data) {
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);
    if (file_put_contents($filePath, $jsonData) === false) {
        error_log("Error writing to JSON file");
    }
}

// Zpracování GET požadavku
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tasks = loadData($jsonFilePath);
    echo json_encode($tasks);
    exit;
}

// Zpracování POST požadavku
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $taskContent = $_POST['taskContent'];
    $isCompleted = isset($_POST['isCompleted']) ? filter_var($_POST['isCompleted'], FILTER_VALIDATE_BOOLEAN) : false;
    $isImportant = isset($_POST['isImportant']) ? filter_var($_POST['isImportant'], FILTER_VALIDATE_BOOLEAN) : false;

    $tasks = loadData($jsonFilePath);
    $tasks[] = [
        'taskContent' => $taskContent,
        'isCompleted' => $isCompleted,
        'isImportant' => $isImportant
    ];
    saveData($jsonFilePath, $tasks);

    echo json_encode(['status' => 'success']);
    exit;
}

// Neplatný požadavek
echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
exit;
?>

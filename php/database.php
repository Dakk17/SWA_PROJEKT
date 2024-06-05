<?php
header('Content-Type: application/json');

$jsonFilePath = 'tasks.json';

function loadData($filePath) {
    if (!file_exists($filePath)) {
        return [];
    }
    $jsonData = file_get_contents($filePath);
    return json_decode($jsonData, true);
}

function saveData($filePath, $data) {
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($filePath, $jsonData);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tasks = loadData($jsonFilePath);
    echo json_encode($tasks);
    exit;
}

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
    exit;
}
// Pokud je požadavek neplatný, vrátíme chybu
echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
exit;
?>

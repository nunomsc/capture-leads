<?php
// Simple endpoint to accept lead data (name, email) and save to leads.json
// Returns JSON responses and supports simple CORS for local testing.

// Allow requests from any origin for local testing (remove in production)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

// Handle preflight requests (useful if you test cross-origin)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$lang = trim($_POST['lang'] ?? '');

// Support two modes:
// 1) legacy: name + email
// 2) new: choices[] (multiple selected options from form)
$choices = $_POST['choices'] ?? null; // when sent as choices[] PHP will populate as array

if ($choices !== null) {
    // ensure it's an array
    if (!is_array($choices)) {
        // single value -> wrap
        $choices = [$choices];
    }

    if (count($choices) === 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "No choices selected"]);
        exit;
    }

    $lead = [
        "id" => uniqid('lead_', true),
        "choices" => array_values($choices),
        "date" => date("Y-m-d H:i:s")
    ];
    if ($lang !== '') $lead['lang'] = $lang;
} else {
    // legacy flow: require name and email
    if ($name === '' || $email === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Missing fields"]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Invalid email"]);
        exit;
    }

    $lead = [
        "id" => uniqid('lead_', true),
        "name" => $name,
        "email" => $email,
        "date" => date("Y-m-d H:i:s")
    ];
    if ($lang !== '') $lead['lang'] = $lang;
}

$filename = __DIR__ . DIRECTORY_SEPARATOR . "leads.json";

// Ensure the file exists and is a JSON array; create if missing
if (!file_exists($filename)) {
    file_put_contents($filename, json_encode([]), LOCK_EX);
}

// Read, append, and write back with file locking to reduce race conditions
$fp = fopen($filename, 'c+');
if ($fp === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Unable to open storage file"]);
    exit;
}

flock($fp, LOCK_EX);
$contents = stream_get_contents($fp);
rewind($fp);

$data = json_decode($contents, true);
if (!is_array($data)) {
    $data = [];
}

$data[] = $lead;

$written = fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
ftruncate($fp, ftell($fp));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

if ($written === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to save lead"]);
    exit;
}

echo json_encode(["success" => true, "id" => $lead['id']]);
?>

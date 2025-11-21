<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

$lead_id = trim($_GET['lead_id'] ?? '');
if ($lead_id === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing lead_id"]);
    exit;
}

$filename = __DIR__ . DIRECTORY_SEPARATOR . "leads.json";
if (!file_exists($filename)) {
    http_response_code(404);
    echo json_encode(["success" => false, "error" => "No leads found"]);
    exit;
}

$contents = file_get_contents($filename);
$data = json_decode($contents, true);
if (!is_array($data)) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Storage corrupted"]);
    exit;
}

foreach ($data as $lead) {
    if (isset($lead['id']) && $lead['id'] === $lead_id) {
        // attempt to enrich lead with localized content from locales/{lang}.json
        $content = null;
        $langToUse = $lead['lang'] ?? null;
        if ($langToUse) {
            $localeFile = __DIR__ . DIRECTORY_SEPARATOR . 'locales' . DIRECTORY_SEPARATOR . $langToUse . '.json';
            if (file_exists($localeFile)) {
                $loc = json_decode(file_get_contents($localeFile), true);
                if (isset($loc['page2']['options']) && isset($lead['choices'][0])) {
                    $key = $lead['choices'][0];
                    if (isset($loc['page2']['options'][$key])) {
                        $content = $loc['page2']['options'][$key];
                    }
                }
            }
        }

        // fallback to strings.json (legacy) or default locale if no content found yet
        if ($content === null) {
            // try strings.json (legacy)
            $stringsFile = __DIR__ . DIRECTORY_SEPARATOR . 'strings.json';
            if (file_exists($stringsFile)) {
                $s = json_decode(file_get_contents($stringsFile), true);
                if (isset($s['page2']['options']) && isset($lead['choices'][0])) {
                    $key = $lead['choices'][0];
                    if (isset($s['page2']['options'][$key])) {
                        $content = $s['page2']['options'][$key];
                    }
                }
            }

            // final fallback: default to Portuguese locale file
            if ($content === null) {
                $defaultLocale = __DIR__ . DIRECTORY_SEPARATOR . 'locales' . DIRECTORY_SEPARATOR . 'pt.json';
                if (file_exists($defaultLocale)) {
                    $d = json_decode(file_get_contents($defaultLocale), true);
                    if (isset($d['page2']['options']) && isset($lead['choices'][0])) {
                        $key = $lead['choices'][0];
                        if (isset($d['page2']['options'][$key])) {
                            $content = $d['page2']['options'][$key];
                        }
                    }
                }
            }
        }

        $response = ["success" => true, "lead" => $lead];
        if ($content !== null) $response['content'] = $content;
        echo json_encode($response);
        exit;
    }
}

http_response_code(404);
echo json_encode(["success" => false, "error" => "Lead not found"]);
?>
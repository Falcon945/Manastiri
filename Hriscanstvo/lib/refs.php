<?php
declare(strict_types=1);

function refs_load(string $path): array {
  if (!is_file($path)) return ["global" => [], "monasteries" => []];
  $json = file_get_contents($path);
  $data = json_decode($json, true);
  if (!is_array($data)) return ["global" => [], "monasteries" => []];
  $data["global"] = $data["global"] ?? [];
  $data["monasteries"] = $data["monasteries"] ?? [];
  return $data;
}

/**
 * Ispiše listu izvora u <ul>.
 * @param array $refs => [ ["title"=>..., "url"=>..., "note"=>...], ... ]
 */
function refs_render_list(array $refs): string {
  if (!$refs) return '<p class="text-gray-500">Nema unetih referenci.</p>';

  $out = '<ul class="list-disc pl-6 space-y-1">';
  foreach ($refs as $r) {
    $title = htmlspecialchars($r["title"] ?? "Izvor");
    $url   = htmlspecialchars($r["url"] ?? "#");
    $note  = htmlspecialchars($r["note"] ?? "");
    $noteHtml = $note ? ' <span class="text-gray-500 text-sm">— '. $note .'</span>' : '';

    // neutralni link sa hover akcentom (klasa se stilizuje u header.php)
    $out .= '<li><a class="ref-link" href="'. $url .'" target="_blank" rel="noopener noreferrer">'. $title .'</a>'. $noteHtml .'</li>';
  }
  $out .= '</ul>';
  return $out;
}

/**
 * Vrati izvore za dati slug manastira (iz references.json).
 */
function refs_for_monastery(array $refsData, string $slug): array {
  $all = $refsData["monasteries"] ?? [];
  return $all[$slug] ?? [];
}

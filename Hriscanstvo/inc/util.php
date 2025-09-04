<?php
declare(strict_types=1);

function load_monasteries(string $path): array {
  if (!is_file($path)) return [];
  $json = file_get_contents($path);
  $data = json_decode($json, true);
  return is_array($data) ? $data : [];
}

function find_by_slug(array $items, string $slug): ?array {
  foreach ($items as $it) {
    if (($it['slug'] ?? '') === $slug) return $it;
  }
  return null;
}

function e(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

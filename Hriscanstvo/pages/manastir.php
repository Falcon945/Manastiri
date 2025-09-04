<?php
declare(strict_types=1);

$theme = 'gold';
$pageTitle = "Manastir – detalj";

require_once __DIR__ . "/../lib/refs.php";
include __DIR__ . "/../inc/header.php";

/* 1) Uzimamo slug iz URL-a */
$slug = trim((string)($_GET['slug'] ?? ''));

/* 2) Učitavamo JSON + guard */
$dataPath = __DIR__ . "/../data/manastiri.json";
$raw = @file_get_contents($dataPath);
$list = json_decode($raw, true);
if (!is_array($list)) {
  echo '<div class="bg-red-50 text-red-800 border border-red-200 rounded p-4 mb-6">';
  echo '⚠ Greška u <code>data/manastiri.json</code> – proveri zagrade, zareze i da nema komentara.';
  echo '</div>';
  $list = [];
}

/* 3) TRAŽIMO STAVKU – tolerantno (trim + case-insensitive) */
$item = null;
$needle = mb_strtolower($slug, 'UTF-8');
foreach ($list as $m) {
  $s = mb_strtolower(trim((string)($m['slug'] ?? '')), 'UTF-8');
  if ($s === $needle) { $item = $m; break; }
}

if (!$item) {
  echo '<h1 class="text-2xl font-bold accent-text mb-4">Manastir nije pronađen</h1>';
  echo '<p class="text-gray-600 mb-4">Traženi zapis ne postoji ili je uklonjen.</p>';
  echo '<p><a class="accent-text hover:underline" href="/Hriscanstvo/pages/manastiri.php">← Nazad na listu</a></p>';
  include __DIR__ . "/../inc/footer.php"; exit;
}

/* 4) Reference (po manastiru) */
$refsData  = refs_load(__DIR__ . "/../data/references.json");
$localRefs = refs_for_monastery($refsData, (string)$item['slug']);

/* 5) HERO: prvo pokušaj direktni 'hero', ako ga nema koristi region fallback, ako ni to – univerzalni */
$naziv  = htmlspecialchars($item['naziv'] ?? '');
$region = mb_strtolower((string)($item['region'] ?? ''), 'UTF-8');
$hero   = trim((string)($item['hero'] ?? ''));

$fallbacks = [
    'fruška gora' => '/Hriscanstvo/pictures/hero-fruska.jpg',
    'raška'       => '/Hriscanstvo/pictures/hero-raska.jpg',
    'braničevo'   => '/Hriscanstvo/pictures/hero-branicevo.jpg',
    'sveta gora'  => '/Hriscanstvo/pictures/hero-aton.jpg',
    'aton'        => '/Hriscanstvo/pictures/hero-aton.jpg',
  ];
  
$universal = '/Hriscanstvo/pictures/hero-fallback.jpg';
$heroSrc   = $hero !== '' ? $hero : ($fallbacks[$region] ?? $universal);
?>

<img src="<?= htmlspecialchars($heroSrc) ?>" alt="<?= $naziv ?>"
     class="w-full h-56 md:h-72 object-cover rounded-xl shadow mb-6">

<h1 class="text-3xl font-bold accent-text mb-2"><?= $naziv ?></h1>
<p class="text-gray-500 mb-6">
  <?= htmlspecialchars($item['mesto'] ?? '') ?>
  <?php if (!empty($item['region'])): ?> • <?= htmlspecialchars($item['region']) ?><?php endif; ?>
</p>

<article class="bg-white rounded-xl shadow p-6 leading-relaxed">
  <p class="text-gray-800 whitespace-pre-line">
    <?= nl2br(htmlspecialchars($item['sadrzaj'] ?? ($item['opis'] ?? ''))) ?>
  </p>

  <?php if (!empty($localRefs)): ?>
    <div class="mt-6">
      <h2 class="text-lg font-semibold mb-2">Reference</h2>
      <?= refs_render_list($localRefs) ?>
    </div>
  <?php endif; ?>

  <?php if (!empty($item['official_url'])): ?>
    <div class="mt-4 text-sm">
      <a class="accent-text hover:underline"
         href="<?= htmlspecialchars($item['official_url']) ?>" target="_blank" rel="noopener">
        Zvanični sajt manastira →
      </a>
    </div>
  <?php endif; ?>
</article>

<?php if (!empty($item['galerija']) && is_array($item['galerija'])): ?>
  <section class="mt-6">
    <h2 class="text-lg font-semibold mb-3">Galerija</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <?php foreach ($item['galerija'] as $img): ?>
        <img src="<?= htmlspecialchars($img) ?>" alt="" class="w-full h-32 object-cover rounded-lg shadow">
      <?php endforeach; ?>
    </div>
  </section>
<?php endif; ?>

<p class="mt-8">
  <a class="accent-text hover:underline" href="/Hriscanstvo/pages/manastiri.php">← Nazad na listu</a>
</p>

<?php include __DIR__ . "/../inc/footer.php"; ?>

<?php
declare(strict_types=1);
$theme = 'gold';
$pageTitle = "Manastiri";

require_once __DIR__ . "/../lib/refs.php";
$refsData = refs_load(__DIR__ . "/../data/references.json");

include __DIR__ . "/../inc/header.php";

/* Učitaj JSON + guard */
$raw = @file_get_contents(__DIR__ . "/../data/manastiri.json");
$all = json_decode($raw, true);
if (!is_array($all)) {
  echo '<div class="bg-red-50 text-red-800 border border-red-200 rounded p-4 mb-6">';
  echo '⚠ Greška u <code>data/manastiri.json</code> – proveri zagrade, zareze i da nema komentara.';
  echo '</div>';
  $all = [];
}

/* Pretraga */
$q = trim($_GET['q'] ?? '');
if ($q !== '') {
  $needle = mb_strtolower($q, 'UTF-8');
  $all = array_values(array_filter($all, function($m) use ($needle){
    $hay = mb_strtolower(($m['naziv'] ?? '').' '.($m['mesto'] ?? '').' '.($m['region'] ?? ''), 'UTF-8');
    return strpos($hay, $needle) !== false;
  }));
}

/* Paginacija */
$perPage = 10;
$total   = count($all);
$page    = max(1, (int)($_GET['page'] ?? 1));
$pages   = max(1, (int)ceil($total / $perPage));
$page    = min($page, $pages);
$offset  = ($page - 1) * $perPage;
$items   = array_slice($all, $offset, $perPage);
?>

<h1 class="text-3xl font-bold text-white mb-6 inline-block px-4 py-2 rounded accent-bg">Manastiri</h1>


<div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
<form method="get" class="flex items-center gap-3 w-full md:w-auto flex-grow">
        <input name="q" value="<?= htmlspecialchars($q) ?>" placeholder="Pretraži po nazivu, mestu ili regionu..."
        class="w-full md:w-1/2 border rounded px-3 py-2" />
        <?php if ($q !== ''): ?>
            <a href="/Hriscanstvo/pages/manastiri.php" class="text-sm text-gray-600 hover:underline">Reset</a>
        <?php endif; ?>
    </form>
    
    <?php if ($pages > 1): ?>
    <nav class="mt-6 flex items-center gap-2">
        <?php for ($p=1; $p<=$pages; $p++): ?>
        <?php
            $params = ['page'=>$p];
            if ($q !== '') $params['q'] = $q;
            $href = '/Hriscanstvo/pages/manastiri.php?' . http_build_query($params);
        ?>
        <a href="<?= $href ?>"
            class="px-3 py-1 rounded border <?= $p===$page ? 'accent-bg text-white' : 'hover:underline' ?>">
            <?= $p ?>
        </a>
    <?php endfor; ?>
    </nav>
    <?php endif; ?>
</div>
<p class="text-sm text-gray-500 mb-3">
  Prikazano <?= $total ? ($offset+1) : 0 ?>–<?= min($offset + count($items), $total) ?> od <?= $total ?> manastira
  <?php if ($q !== ''): ?> za upit „<?= htmlspecialchars($q) ?>”<?php endif; ?>
</p>

<div class="space-y-3">
<?php foreach ($items as $i => $m): ?>
  <?php
    $slug = (string)($m['slug'] ?? '');
    // reference NE prikazujemo u listi radi estetike; ostavljamo samo na detalju
  ?>
  <div class="bg-white rounded-xl shadow p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="<?= htmlspecialchars((string)($m['ikon'] ?? 'https://via.placeholder.com/48')) ?>"
             alt="<?= htmlspecialchars((string)($m['naziv'] ?? '')) ?>"
             class="w-12 h-12 rounded object-cover">
        <div>
          <div class="font-semibold text-lg"><?= htmlspecialchars((string)($m['naziv'] ?? '')) ?></div>
          <div class="text-sm text-gray-500">
            <?= htmlspecialchars((string)($m['mesto'] ?? '')) ?>
            <?php if (!empty($m['region'])): ?>
              • <span class="text-gray-400"><?= htmlspecialchars((string)$m['region']) ?></span>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <!-- Dugmad desno: VIŠE — + Detaljnije -->
      <div class="flex items-center gap-3">
        <?php if ($slug !== ''): ?>
            
          <a
            href="/Hriscanstvo/pages/manastir.php?slug=<?= urlencode($slug) ?>"
            class="inline-flex items-center px-3 py-1.5 rounded-md border accent-border text-[13px] font-medium
                   accent-text hover:accent-bg hover:text-white transition"
          >
            Detaljnije
          </a>

          <button
          class="accent-text font-semibold hover:underline hover:opacity-80 transition-opacity"
          data-toggle="desc-<?= $offset + $i ?>">
          VIŠE —
        </button>
        <?php endif; ?>
      </div>
    </div>

    <div id="desc-<?= $offset + $i ?>" class="mt-3 hidden">
      <p class="text-gray-700 leading-relaxed"><?= htmlspecialchars((string)($m['opis'] ?? '')) ?></p>

      <div class="mt-2">
        <a class="text-gray-500 hover:underline text-sm" href="/Hriscanstvo/pages/izvori.php">Svi izvori →</a>
      </div>
    </div>
  </div>
<?php endforeach; ?>

<?php if (!$items): ?>
  <div class="text-gray-500">Nema rezultata.</div>
<?php endif; ?>
</div>

<?php if ($pages > 1): ?>
  <nav class="mt-6 flex items-center gap-2">
    <?php for ($p=1; $p<=$pages; $p++): ?>
      <?php
        $params = ['page'=>$p];
        if ($q !== '') $params['q'] = $q;
        $href = '/Hriscanstvo/pages/manastiri.php?' . http_build_query($params);
      ?>
      <a href="<?= $href ?>"
         class="px-3 py-1 rounded border <?= $p===$page ? 'accent-bg text-white' : 'hover:underline' ?>">
        <?= $p ?>
      </a>
    <?php endfor; ?>
  </nav>
<?php endif; ?>

<script>
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-toggle');
      const box = document.getElementById(id);
      if (!box) return;
      box.classList.toggle('hidden');
      btn.textContent = box.classList.contains('hidden') ? 'VIŠE —' : 'MANJE —';
    });
  });
</script>

<?php include __DIR__ . "/../inc/footer.php"; ?>

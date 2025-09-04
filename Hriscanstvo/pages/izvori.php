<?php
declare(strict_types=1);

$theme = 'bordo';                 // akcenat za ovu stranicu
$pageTitle = "Izvori i reference";

require_once __DIR__ . "/../lib/refs.php";
$refs = refs_load(__DIR__ . "/../data/references.json");

include __DIR__ . "/../inc/header.php";
?>

<h1 class="text-3xl font-bold text-white inline-block px-4 py-2 rounded accent-bg mb-6">
  Izvori i reference
</h1>

<section class="bg-white rounded-xl shadow p-6 mb-8">
  <h2 class="text-xl font-semibold mb-3">Globalni izvori</h2>
  <?= refs_render_list($refs["global"] ?? []) ?>
</section>

<section class="bg-white rounded-xl shadow p-6">
  <h2 class="text-xl font-semibold mb-3">Izvori po manastirima</h2>
  <p class="text-gray-600 mb-4">
    Ovo su posebne reference koje koristimo pri pisanju tekstova o pojedinačnim manastirima.
  </p>

  <?php
    $monk = $refs["monasteries"] ?? [];
    if (!$monk) {
      echo '<p class="text-gray-500">Još uvek nismo dodali pojedinačne izvore po manastirima.</p>';
    } else {
      foreach ($monk as $slug => $list) {
        echo '<div class="border-t pt-4 mt-4">';
        echo '<h3 class="font-semibold accent-text mb-2">'. htmlspecialchars(ucfirst($slug)) .'</h3>';
        echo refs_render_list($list);
        echo '</div>';
      }
    }
  ?>
</section>

<section class="mt-10 text-sm text-gray-600">
  <h2 class="text-base font-semibold mb-2">Napomena o autorskim pravima</h2>
  <p>
    Tekstovi na ovom sajtu nastaju kao autorski sadržaj na osnovu javno dostupnih izvora, uz jasno navođenje
    referenci. Ako smatrate da neki materijal krši autorska prava, molimo vas da nas kontaktirate kako bismo
    izvršili ispravke ili uklonili sadržaj.
  </p>
  <p class="mt-3">
    Fotografije su ili sopstvene ili preuzete sa platformi koje omogućavaju korišćenje pod otvorenim licencama
    (npr. <a class="accent-text hover:underline" href="https://commons.wikimedia.org" target="_blank" rel="noopener">Wikimedia Commons</a>, Unsplash),
    uz navođenje autora i licence kada je primenljivo.
  </p>
</section>

<?php include __DIR__ . "/../inc/footer.php"; ?>

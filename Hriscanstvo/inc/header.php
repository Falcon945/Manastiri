<?php
  // $pageTitle i $theme se podešavaju u svakoj stranici pre include-a
  $pageTitle = $pageTitle ?? 'Hrišćanstvo';
  $theme     = $theme ?? 'green'; // 'green' | 'gold' | 'bordo'
  // osiguraj vrednost
  if (!in_array($theme, ['green','gold','bordo'], true)) $theme = 'green';
?>
<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?= htmlspecialchars($pageTitle) ?></title>
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    :root{
      --bg-paper:#F8F5E7; /* svetla pozadina */
      --bg-dark:#0F172A;  /* header/footer */
      --accent:#2F5233;   /* default */
    }
    /* Tema je JEDINO na body preko data-theme */
    body[data-theme="green"] { --accent:#2F5233; } /* vizant. zeleno */
    body[data-theme="gold"]  { --accent:#D4AF37; } /* zlato */
    body[data-theme="bordo"] { --accent:#7A1F2B; } /* bordo */

    .paper-bg   { background:var(--bg-paper); }
    .dark-bg    { background:var(--bg-dark); }
    .accent-text   { color:var(--accent); }
    .accent-bg     { background:var(--accent); }
    .accent-border { border-color:var(--accent); }

    a.ref-link {
  color: #374151; /* neutralna siva (text-gray-700) */
  text-decoration: none;
  transition: color 0.2s, text-decoration 0.2s;
}

a.ref-link:hover {
  color: var(--accent);   /* koristi accent boju sa stranice */
  text-decoration: underline;
}

  </style>
</head>

<body class="paper-bg text-gray-800" data-theme="<?= htmlspecialchars($theme) ?>">
  <header class="dark-bg text-gray-200">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/Hriscanstvo/" class="font-bold text-xl">Pravoslavni Manastiri</a>
      <nav class="flex gap-6">
        <a class="hover:text-white" href="/Hriscanstvo/">Početna</a>
        <a class="hover:text-white" href="/Hriscanstvo/pages/manastiri.php">Manastiri</a>
        <a class="hover:text-white" href="/Hriscanstvo/pages/izvori.php">Izvori</a>
      </nav>
    </div>
  </header>
  <main class="max-w-6xl mx-auto px-4 py-8">

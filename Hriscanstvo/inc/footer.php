</main>

<footer class="bg-gray-900 text-gray-300 w-full border-t border-white/10" role="contentinfo">
  <div class="mx-auto max-w-6xl px-4 py-6 text-sm grid grid-cols-1 md:grid-cols-3 items-center gap-4">
    <!-- Levo: watermark + godina -->
    <div class="flex items-center justify-center md:justify-start gap-3">
      <img
        src="/Hriscanstvo/pictures/watermark.png"
        alt="Pravoslavni Manastiri – logotip"
        class="h-8 md:h-10 w-auto opacity-70 select-none pointer-events-none"
        loading="lazy"
      />
      <time datetime="<?= date('Y') ?>" class="text-gray-400"><?= date('Y') ?></time>
    </div>

    <!-- Sredina: copyright -->
    <p class="text-center">© Pravoslavni Manastiri</p>

    <!-- Desno: navigacija -->
    <nav class="flex items-center justify-center md:justify-end gap-6">
      <a href="/Hriscanstvo/pages/izvori.php" class="hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded">
        Izvori i reference
      </a>
      <a href="/Hriscanstvo/pages/manastiri.php" class="hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 rounded">
        Manastiri
      </a>
    </nav>
  </div>
</footer>

</body>
</html>

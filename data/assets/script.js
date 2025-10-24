document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  function toggleBtn() {
    // koliko smo skrolovali
    const scrolled =
      document.documentElement.scrollTop || document.body.scrollTop;

    if (scrolled > 200) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  }

  // kada skroluješ – proveri da li treba da se pojavi
  window.addEventListener("scroll", toggleBtn);

  // klik na dugme – vrati na vrh
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // odmah uradi prvi check kad se stranica učita
  toggleBtn();
});

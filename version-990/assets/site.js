function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  var slides = Array.from(document.querySelectorAll(".hero-slide"));
  var dots = Array.from(document.querySelectorAll(".hero-dots button"));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var filterRoot = document.querySelector("[data-filter-root]");

  if (filterRoot) {
    var queryInput = filterRoot.querySelector("[data-filter-query]");
    var yearSelect = filterRoot.querySelector("[data-filter-year]");
    var regionSelect = filterRoot.querySelector("[data-filter-region]");
    var genreSelect = filterRoot.querySelector("[data-filter-genre]");
    var items = Array.from(filterRoot.querySelectorAll("[data-title]"));

    function filterItems() {
      var query = queryInput ? queryInput.value.trim().toLowerCase() : "";
      var year = yearSelect ? yearSelect.value : "";
      var region = regionSelect ? regionSelect.value : "";
      var genre = genreSelect ? genreSelect.value : "";

      items.forEach(function (item) {
        var text = [
          item.dataset.title,
          item.dataset.region,
          item.dataset.genre,
          item.dataset.tags
        ].join(" ").toLowerCase();
        var matchQuery = !query || text.indexOf(query) >= 0;
        var matchYear = !year || item.dataset.year === year;
        var matchRegion = !region || item.dataset.region.indexOf(region) >= 0;
        var matchGenre = !genre || item.dataset.genre.indexOf(genre) >= 0 || item.dataset.tags.indexOf(genre) >= 0;
        item.style.display = matchQuery && matchYear && matchRegion && matchGenre ? "" : "none";
      });
    }

    [queryInput, yearSelect, regionSelect, genreSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", filterItems);
        control.addEventListener("change", filterItems);
      }
    });
  }

  var quickForm = document.querySelector(".quick-search");

  if (quickForm) {
    quickForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = quickForm.querySelector("input").value.trim();
      var params = query ? "?q=" + encodeURIComponent(query) : "";
      window.location.href = "./search.html" + params;
    });
  }

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get("q");
  var searchInput = document.querySelector("[data-filter-query]");

  if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
    searchInput.dispatchEvent(new Event("input"));
  }
});

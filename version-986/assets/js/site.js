(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    var showSlide = function (index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide((current + 1) % slides.length);
      }, 5000);
    }
  }

  var filterPage = document.querySelector('[data-filter-page]');

  if (filterPage) {
    var searchInput = filterPage.querySelector('[data-filter-search]');
    var yearSelect = filterPage.querySelector('[data-filter-year]');
    var typeSelect = filterPage.querySelector('[data-filter-type]');
    var countLabel = filterPage.querySelector('[data-filter-count]');
    var cards = Array.prototype.slice.call(filterPage.querySelectorAll('.movie-card'));
    var regionButtons = Array.prototype.slice.call(filterPage.querySelectorAll('[data-region-chip]'));
    var activeRegion = '';

    var fillOptions = function (select, attr) {
      if (!select || select.options.length > 1) {
        return;
      }
      var values = [];
      cards.forEach(function (card) {
        var value = card.getAttribute(attr) || '';
        if (value && values.indexOf(value) === -1) {
          values.push(value);
        }
      });
      values.sort(function (a, b) {
        return String(b).localeCompare(String(a), 'zh-Hans-CN');
      });
      values.forEach(function (value) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    };

    var applyFilter = function () {
      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var cardRegion = card.getAttribute('data-region') || '';
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        if (type && cardType !== type) {
          matched = false;
        }
        if (activeRegion && cardRegion.indexOf(activeRegion) === -1) {
          matched = false;
        }

        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (countLabel) {
        countLabel.textContent = visible;
      }
    };

    fillOptions(yearSelect, 'data-year');
    fillOptions(typeSelect, 'data-type');

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', applyFilter);
    }
    if (typeSelect) {
      typeSelect.addEventListener('change', applyFilter);
    }

    regionButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-region-chip') || '';
        activeRegion = activeRegion === value ? '' : value;
        regionButtons.forEach(function (item) {
          item.classList.toggle('active', item === button && activeRegion === value);
        });
        applyFilter();
      });
    });

    applyFilter();
  }
})();

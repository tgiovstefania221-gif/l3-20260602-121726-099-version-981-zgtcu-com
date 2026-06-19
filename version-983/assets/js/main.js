(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var featureTitle = document.querySelector('[data-hero-title]');
  var featureText = document.querySelector('[data-hero-text]');
  var featureLink = document.querySelector('[data-hero-link]');
  var featureImg = document.querySelector('[data-hero-img]');
  var current = 0;

  function setHero(index) {
    if (!slides.length) {
      return;
    }

    current = index % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });

    var active = slides[current];

    if (active && featureTitle && featureText && featureLink && featureImg) {
      featureTitle.textContent = active.getAttribute('data-title') || '';
      featureText.textContent = active.getAttribute('data-text') || '';
      featureLink.setAttribute('href', active.getAttribute('data-link') || './index.html');
      featureImg.setAttribute('src', active.getAttribute('data-img') || './1.jpg');
      featureImg.setAttribute('alt', active.getAttribute('data-title') || '');
    }
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      setHero(index);
    });
  });

  if (slides.length) {
    setHero(0);
    setInterval(function () {
      setHero(current + 1);
    }, 5200);
  }

  var pageSearchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));

  pageSearchInputs.forEach(function (input) {
    var scope = input.closest('[data-filter-scope]') || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var typeSelect = scope.querySelector('[data-filter-type]');
    var regionSelect = scope.querySelector('[data-filter-region]');
    var yearSelect = scope.querySelector('[data-filter-year]');

    function applyFilter() {
      var keyword = input.value.trim().toLowerCase();
      var typeValue = typeSelect ? typeSelect.value : '';
      var regionValue = regionSelect ? regionSelect.value : '';
      var yearValue = yearSelect ? yearSelect.value : '';

      cards.forEach(function (card) {
        var title = (card.getAttribute('data-title') || '').toLowerCase();
        var type = card.getAttribute('data-type') || '';
        var region = card.getAttribute('data-region') || '';
        var year = card.getAttribute('data-year') || '';
        var visible = true;

        if (keyword && title.indexOf(keyword) === -1) {
          visible = false;
        }

        if (typeValue && type !== typeValue) {
          visible = false;
        }

        if (regionValue && region !== regionValue) {
          visible = false;
        }

        if (yearValue && year !== yearValue) {
          visible = false;
        }

        card.style.display = visible ? '' : 'none';
      });
    }

    input.addEventListener('input', applyFilter);

    [typeSelect, regionSelect, yearSelect].forEach(function (select) {
      if (select) {
        select.addEventListener('change', applyFilter);
      }
    });
  });

  var globalInput = document.querySelector('[data-global-search]');
  var globalResults = document.querySelector('[data-global-results]');

  if (globalInput && globalResults && Array.isArray(window.MovieSearchIndex)) {
    globalInput.addEventListener('input', function () {
      var keyword = globalInput.value.trim().toLowerCase();
      globalResults.innerHTML = '';

      if (!keyword) {
        globalResults.classList.remove('open');
        return;
      }

      var matches = window.MovieSearchIndex.filter(function (item) {
        return item.searchText.indexOf(keyword) !== -1;
      }).slice(0, 12);

      if (!matches.length) {
        globalResults.classList.remove('open');
        return;
      }

      matches.forEach(function (item) {
        var link = document.createElement('a');
        var img = document.createElement('img');
        var body = document.createElement('span');
        var title = document.createElement('strong');
        var meta = document.createElement('span');
        var arrow = document.createElement('b');

        link.className = 'search-result-item';
        link.href = item.link;
        img.src = item.cover;
        img.alt = item.title;
        title.textContent = item.title;
        meta.textContent = item.year + ' · ' + item.region + ' · ' + item.type;
        arrow.textContent = '观看';

        body.appendChild(title);
        body.appendChild(meta);
        link.appendChild(img);
        link.appendChild(body);
        link.appendChild(arrow);
        globalResults.appendChild(link);
      });

      globalResults.classList.add('open');
    });
  }
})();

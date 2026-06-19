(function () {
  var navToggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dotsBox = hero.querySelector('[data-hero-dots]');
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function drawDots() {
      if (!dotsBox) {
        return;
      }
      dotsBox.innerHTML = '';
      slides.forEach(function (_, dotIndex) {
        var dot = document.createElement('button');
        dot.type = 'button';
        if (dotIndex === index) {
          dot.className = 'active';
        }
        dot.addEventListener('click', function () {
          show(dotIndex);
        });
        dotsBox.appendChild(dot);
      });
    }

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      drawDots();
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    show(0);
    start();
  }

  var filterRoot = document.querySelector('[data-filter-root]');
  var cardContainer = document.querySelector('[data-card-container]');

  if (filterRoot && cardContainer) {
    var input = filterRoot.querySelector('[data-filter-search]');
    var typeSelect = filterRoot.querySelector('[data-filter-type]');
    var yearSelect = filterRoot.querySelector('[data-filter-year]');
    var sortSelect = filterRoot.querySelector('[data-filter-sort]');
    var emptyState = document.querySelector('[data-empty-state]');
    var cards = Array.prototype.slice.call(cardContainer.querySelectorAll('[data-card]'));
    var params = new URLSearchParams(window.location.search);

    if (params.get('q') && input) {
      input.value = params.get('q');
    }

    function cardText(card) {
      return [
        card.dataset.title,
        card.dataset.year,
        card.dataset.type,
        card.dataset.region,
        card.dataset.category,
        card.dataset.genre,
        card.dataset.tags
      ].join(' ').toLowerCase();
    }

    function applyFilter() {
      var q = input ? input.value.trim().toLowerCase() : '';
      var type = typeSelect ? typeSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var ok = true;
        if (q && cardText(card).indexOf(q) === -1) {
          ok = false;
        }
        if (type && card.dataset.type.indexOf(type) === -1) {
          ok = false;
        }
        if (year && card.dataset.year !== year) {
          ok = false;
        }
        card.classList.toggle('hidden', !ok);
        if (ok) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('visible', visible === 0);
      }
    }

    function sortCards() {
      var mode = sortSelect ? sortSelect.value : 'year-desc';
      var sorted = cards.slice().sort(function (a, b) {
        if (mode === 'year-asc') {
          return Number(a.dataset.year) - Number(b.dataset.year);
        }
        if (mode === 'title-asc') {
          return a.dataset.title.localeCompare(b.dataset.title, 'zh-Hans-CN');
        }
        return Number(b.dataset.year) - Number(a.dataset.year);
      });
      sorted.forEach(function (card) {
        cardContainer.appendChild(card);
      });
    }

    [input, typeSelect, yearSelect].forEach(function (item) {
      if (item) {
        item.addEventListener('input', applyFilter);
        item.addEventListener('change', applyFilter);
      }
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        sortCards();
        applyFilter();
      });
    }

    sortCards();
    applyFilter();
  }

  function attachPlayer(player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var hls = null;

    if (!video) {
      return;
    }

    function play() {
      var stream = video.dataset.stream;
      if (!stream) {
        return;
      }

      player.classList.add('playing');

      if (!video.dataset.ready) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
        video.dataset.ready = '1';
      }

      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      player.classList.add('playing');
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(attachPlayer);
})();

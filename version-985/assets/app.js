(function () {
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[match];
    });
  }

  function initMenu() {
    var button = $('[data-menu-toggle]');
    var nav = $('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function initHero() {
    var root = $('[data-hero]');
    if (!root) {
      return;
    }
    var slides = $all('[data-hero-slide]', root);
    var dots = $all('[data-hero-dot]', root);
    var prev = $('[data-hero-prev]', root);
    var next = $('[data-hero-next]', root);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      start();
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot') || 0));
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    start();
  }

  function initFilters() {
    var panel = $('[data-filter-panel]');
    if (!panel) {
      return;
    }
    var state = {
      year: '',
      region: '',
      type: ''
    };
    var grid = $('.filter-grid');
    var cards = $all('.movie-card', grid);

    function apply() {
      cards.forEach(function (card) {
        var okYear = !state.year || card.getAttribute('data-year') === state.year;
        var okRegion = !state.region || card.getAttribute('data-region') === state.region;
        var okType = !state.type || card.getAttribute('data-type') === state.type;
        card.classList.toggle('hidden-card', !(okYear && okRegion && okType));
      });
    }

    ['year', 'region', 'type'].forEach(function (key) {
      $all('[data-filter-' + key + ']', panel).forEach(function (button) {
        button.addEventListener('click', function () {
          state[key] = button.getAttribute('data-filter-' + key) || '';
          $all('[data-filter-' + key + ']', panel).forEach(function (item) {
            item.classList.toggle('active', item === button);
          });
          apply();
        });
      });
    });
  }

  function loadHls(callback) {
    if (window.Hls) {
      callback();
      return;
    }
    var existing = document.querySelector('script[data-hls-lib]');
    if (existing) {
      existing.addEventListener('load', callback, { once: true });
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.async = true;
    script.setAttribute('data-hls-lib', '1');
    script.onload = callback;
    document.head.appendChild(script);
  }

  function initPlayer() {
    var player = $('.player[data-stream]');
    if (!player) {
      return;
    }
    var video = $('video', player);
    var playButton = $('[data-play]', player);
    var stream = player.getAttribute('data-stream');
    var attached = false;
    var hls = null;

    function attach() {
      if (!video || !stream) {
        return;
      }
      if (attached) {
        video.play().catch(function () {});
        return;
      }
      attached = true;
      player.classList.add('is-playing');

      function nativePlay() {
        video.src = stream;
        video.play().catch(function () {});
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        nativePlay();
        return;
      }

      loadHls(function () {
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          nativePlay();
        }
      });
    }

    if (playButton) {
      playButton.addEventListener('click', attach);
    }

    player.addEventListener('click', function (event) {
      if (event.target !== video) {
        attach();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  function initSearch() {
    var form = $('[data-search-form]');
    var results = $('[data-search-results]');
    var status = $('[data-search-status]');
    var loadMore = $('[data-load-more]');
    if (!form || !results || !window.MOVIE_SEARCH_DATA) {
      return;
    }

    var shown = 0;
    var pageSize = 60;
    var current = [];
    var params = new URLSearchParams(window.location.search);

    var queryInput = form.elements.q;
    var categoryInput = form.elements.category;
    var yearInput = form.elements.year;

    var years = Array.from(new Set(window.MOVIE_SEARCH_DATA.map(function (item) {
      return item.year;
    }).filter(Boolean))).sort().reverse();

    years.forEach(function (year) {
      var option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearInput.appendChild(option);
    });

    queryInput.value = params.get('q') || '';
    categoryInput.value = params.get('category') || '';
    yearInput.value = params.get('year') || '';

    function buildCard(movie) {
      var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      return [
        '<article class="movie-card">',
        '<a class="poster-link" href="' + escapeHtml(movie.url) + '">',
        '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '<span class="quality-badge">HD</span>',
        '<span class="year-badge">' + escapeHtml(movie.year) + '</span>',
        '<span class="poster-play">▶</span>',
        '</a>',
        '<div class="movie-card-body">',
        '<a class="movie-title" href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a>',
        '<p class="movie-meta">' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + '</p>',
        '<p class="movie-line">' + escapeHtml(movie.oneLine) + '</p>',
        '<div class="tag-row">' + tags + '</div>',
        '</div>',
        '</article>'
      ].join('');
    }

    function apply(reset) {
      if (reset) {
        shown = 0;
      }
      var q = queryInput.value.trim().toLowerCase();
      var category = categoryInput.value;
      var year = yearInput.value;
      current = window.MOVIE_SEARCH_DATA.filter(function (movie) {
        var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.oneLine, (movie.tags || []).join(' ')].join(' ').toLowerCase();
        var okQuery = !q || text.indexOf(q) !== -1;
        var okCategory = !category || movie.categorySlug === category;
        var okYear = !year || movie.year === year;
        return okQuery && okCategory && okYear;
      });
      shown += pageSize;
      results.innerHTML = current.slice(0, shown).map(buildCard).join('');
      status.textContent = current.length ? '已匹配到相关影片。' : '未找到匹配影片。';
      loadMore.classList.toggle('show', shown < current.length);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var nextParams = new URLSearchParams();
      if (queryInput.value.trim()) {
        nextParams.set('q', queryInput.value.trim());
      }
      if (categoryInput.value) {
        nextParams.set('category', categoryInput.value);
      }
      if (yearInput.value) {
        nextParams.set('year', yearInput.value);
      }
      var qs = nextParams.toString();
      history.replaceState(null, '', qs ? '?' + qs : location.pathname);
      apply(true);
    });

    [queryInput, categoryInput, yearInput].forEach(function (field) {
      field.addEventListener('change', function () {
        apply(true);
      });
    });

    queryInput.addEventListener('input', function () {
      apply(true);
    });

    loadMore.addEventListener('click', function () {
      apply(false);
    });

    apply(true);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
    initSearch();
  });
})();

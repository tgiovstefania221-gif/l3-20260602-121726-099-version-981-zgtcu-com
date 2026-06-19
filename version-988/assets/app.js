(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var activeIndex = 0;

        function showSlide(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle('active', current === activeIndex);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle('active', current === activeIndex);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5200);
        }
    }

    var searchInput = document.querySelector('[data-page-search]');

    if (searchInput) {
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (query) {
            searchInput.value = query;
        }

        function filterCards() {
            var value = searchInput.value.trim().toLowerCase();

            cards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-tags') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-region') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();

                card.classList.toggle('filtered-out', value && text.indexOf(value) === -1);
            });
        }

        searchInput.addEventListener('input', filterCards);
        filterCards();
    }
}());

function initMoviePlayer(sourceUrl) {
    var video = document.querySelector('.movie-video');
    var trigger = document.querySelector('[data-play-trigger]');

    if (!video || !sourceUrl) {
        return;
    }

    function attachWithHls() {
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(sourceUrl);
            hls.attachMedia(video);
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
        }
    }

    function loadHlsScript(callback) {
        if (window.Hls) {
            callback();
            return;
        }

        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    function startVideo() {
        if (trigger) {
            trigger.classList.add('hidden');
        }

        if (!video.src && !(window.Hls && window.Hls.isSupported())) {
            loadHlsScript(function () {
                attachWithHls();
                video.play().catch(function () {});
            });
            return;
        }

        attachWithHls();
        video.play().catch(function () {});
    }

    if (trigger) {
        trigger.addEventListener('click', startVideo);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            startVideo();
        }
    });
}

(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-button]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-hero]").forEach(function (hero) {
            var track = hero.querySelector("[data-hero-track]");
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var index = 0;
            var timer = null;

            function setSlide(nextIndex) {
                if (!track || slides.length === 0) {
                    return;
                }

                index = (nextIndex + slides.length) % slides.length;
                track.style.transform = "translateX(-" + index * 100 + "%)";

                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === index);
                });

                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === index);
                });
            }

            function startTimer() {
                if (slides.length < 2) {
                    return;
                }

                timer = window.setInterval(function () {
                    setSlide(index + 1);
                }, 5200);
            }

            function restartTimer() {
                if (timer) {
                    window.clearInterval(timer);
                }
                startTimer();
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    setSlide(index - 1);
                    restartTimer();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    setSlide(index + 1);
                    restartTimer();
                });
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    var dotIndex = Number(dot.getAttribute("data-hero-dot"));
                    setSlide(dotIndex);
                    restartTimer();
                });
            });

            setSlide(0);
            startTimer();
        });

        document.querySelectorAll(".filter-panel").forEach(function (panel) {
            var input = panel.querySelector("[data-filter-input]");
            var yearSelect = panel.querySelector("[data-year-filter]");
            var section = panel.closest("section") || document;
            var cards = Array.prototype.slice.call(section.querySelectorAll("[data-movie-card]"));

            function applyFilter() {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                var year = yearSelect ? yearSelect.value : "";

                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-region") || "",
                        card.getAttribute("data-genre") || ""
                    ].join(" ").toLowerCase();
                    var cardYear = card.getAttribute("data-year") || "";
                    var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
                    var yearMatch = !year || cardYear === year;
                    card.style.display = keywordMatch && yearMatch ? "" : "none";
                });
            }

            if (input) {
                input.addEventListener("input", applyFilter);
            }

            if (yearSelect) {
                yearSelect.addEventListener("change", applyFilter);
            }
        });

        document.querySelectorAll("[data-player]").forEach(function (player) {
            var video = player.querySelector("video");
            var button = player.querySelector("[data-player-start]");

            if (!video || !button) {
                return;
            }

            var streamUrl = video.getAttribute("data-hls");
            var started = false;
            var hlsInstance = null;

            function begin() {
                if (!streamUrl) {
                    return;
                }

                button.classList.add("is-hidden");

                if (started) {
                    video.play();
                    return;
                }

                started = true;

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = streamUrl;
                    video.play();
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls();
                    hlsInstance.loadSource(streamUrl);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play();
                    });
                    return;
                }

                video.src = streamUrl;
                video.play();
            }

            button.addEventListener("click", begin);
            video.addEventListener("click", function () {
                if (!started) {
                    begin();
                }
            });
        });
    });
})();

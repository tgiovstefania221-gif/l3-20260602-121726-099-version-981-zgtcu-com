document.addEventListener("DOMContentLoaded", function () {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var mainNav = document.querySelector("[data-main-nav]");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", function () {
            mainNav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                showSlide(dotIndex);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        }
    }

    var filterPanel = document.querySelector("[data-filter-panel]");
    if (filterPanel) {
        var input = filterPanel.querySelector("[data-filter-input]");
        var buttons = Array.prototype.slice.call(filterPanel.querySelectorAll("[data-filter-year]"));
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card-container] .movie-card"));
        var selectedYear = "全部";

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applyFilters() {
            var keyword = normalize(input ? input.value : "");
            cards.forEach(function (card) {
                var yearMatched = selectedYear === "全部" || card.getAttribute("data-year") === selectedYear;
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-tags")
                ].join(" "));
                var keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;
                card.style.display = yearMatched && keywordMatched ? "block" : "none";
            });
        }

        if (input) {
            input.addEventListener("input", applyFilters);
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                selectedYear = button.getAttribute("data-filter-year");
                buttons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                applyFilters();
            });
        });
    }

    var scrollPlayer = document.querySelector("[data-scroll-player]");
    if (scrollPlayer) {
        scrollPlayer.addEventListener("click", function (event) {
            event.preventDefault();
            var player = document.querySelector(".movie-player");
            if (player) {
                player.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(function () {
                    player.play().catch(function () {});
                }, 420);
            }
        });
    }
});

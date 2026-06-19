document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById("site-search-input");
    var typeSelect = document.getElementById("site-search-type");
    var results = document.getElementById("search-results");
    var count = document.getElementById("search-result-count");
    var data = window.MOVIE_DATA || [];

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function card(movie) {
        return [
            '<a class="movie-card" href="' + escapeHtml(movie.url) + '">',
            '    <span class="poster-wrap">',
            '        <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <span class="poster-shade"></span>',
            '        <span class="hot-badge">播放</span>',
            '        <span class="play-hover" aria-hidden="true">▶</span>',
            '    </span>',
            '    <span class="movie-title">' + escapeHtml(movie.title) + '</span>',
            '    <span class="movie-meta">' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + '</span>',
            '</a>'
        ].join("\n");
    }

    function render() {
        var keyword = normalize(input ? input.value : "");
        var selectedType = typeSelect ? typeSelect.value : "全部";
        var filtered = data.filter(function (movie) {
            var typeMatched = selectedType === "全部" || movie.type === selectedType;
            var haystack = normalize([
                movie.title,
                movie.year,
                movie.region,
                movie.type,
                movie.genre,
                (movie.tags || []).join(" "),
                movie.oneLine
            ].join(" "));
            return typeMatched && (!keyword || haystack.indexOf(keyword) !== -1);
        }).slice(0, 120);

        results.innerHTML = filtered.map(card).join("\n");
        count.textContent = "已显示 " + filtered.length + " 条结果";
    }

    var params = new URLSearchParams(window.location.search);
    if (input && params.get("q")) {
        input.value = params.get("q");
    }

    if (input) {
        input.addEventListener("input", render);
    }

    if (typeSelect) {
        typeSelect.addEventListener("change", render);
    }

    render();
});

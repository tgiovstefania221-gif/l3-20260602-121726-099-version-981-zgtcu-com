document.addEventListener("DOMContentLoaded", function () {
    var video = document.querySelector(".movie-player");
    var button = document.querySelector("[data-player-toggle]");

    if (!video) {
        return;
    }

    var source = video.getAttribute("data-hls-src");

    function hideButton() {
        if (button) {
            button.classList.add("is-hidden");
        }
    }

    function showButton() {
        if (button) {
            button.classList.remove("is-hidden");
        }
    }

    function attachSource() {
        if (!source) {
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });

            hls.loadSource(source);
            hls.attachMedia(video);
            window.__currentHls = hls;
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else {
            video.src = source;
        }
    }

    attachSource();

    if (button) {
        button.addEventListener("click", function () {
            video.play().then(hideButton).catch(function () {
                showButton();
            });
        });
    }

    video.addEventListener("play", hideButton);
    video.addEventListener("pause", showButton);
    video.addEventListener("ended", showButton);
});

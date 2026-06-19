export function initMoviePlayer(source) {
  var video = document.querySelector("[data-player]");
  var start = document.querySelector("[data-player-start]");

  if (!video) {
    return;
  }

  function loadWithGlobalHls() {
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, function (_, data) {
        if (data.fatal) {
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else {
      video.src = source;
    }
  }

  function playVideo() {
    if (start) {
      start.classList.add("hidden");
    }
    video.play().catch(function () {
      video.controls = true;
    });
  }

  loadWithGlobalHls();
  video.controls = true;

  if (start) {
    start.addEventListener("click", playVideo);
  }

  video.addEventListener("play", function () {
    if (start) {
      start.classList.add("hidden");
    }
  });
}

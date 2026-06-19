(function () {
  function initializePlayer(box) {
    var video = box.querySelector('video');
    var trigger = box.querySelector('.play-layer');
    var stream = video ? video.getAttribute('data-stream') : '';
    var started = false;
    var hls = null;

    if (!video || !trigger || !stream) {
      return;
    }

    function play() {
      if (started) {
        video.play().catch(function () {});
        return;
      }

      started = true;
      box.classList.add('is-playing');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        video.play().catch(function () {});
        return;
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

      video.src = stream;
      video.play().catch(function () {});
    }

    trigger.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (!started) {
        play();
      }
    });
    video.addEventListener('ended', function () {
      if (hls) {
        hls.stopLoad();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(initializePlayer);
  });
})();

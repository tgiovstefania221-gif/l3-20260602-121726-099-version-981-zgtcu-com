(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  var attachSource = function (player) {
    if (player.getAttribute('data-loaded') === 'true') {
      return;
    }

    var video = player.querySelector('video');
    var source = player.getAttribute('data-source');

    if (!video || !source) {
      return;
    }

    player.setAttribute('data-loaded', 'true');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.play();
      player.classList.add('playing');
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
        player.classList.add('playing');
      });
      return;
    }

    video.src = source;
    video.play();
    player.classList.add('playing');
  };

  players.forEach(function (player) {
    var button = player.querySelector('[data-player-button]');
    var video = player.querySelector('video');

    if (button) {
      button.addEventListener('click', function () {
        attachSource(player);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        attachSource(player);
      });
    }
  });
})();

// Variáveis globais utilizadas pelo código
var alturaDivVideo;
var videoPausado  = false;
var btnSomClicado = false;
$(document).ready(function () {
    $(document).trigger('player.video.play');
    $('.wistia-video-container').click(function () {
        var that = $(this);
        fullScreenVideo(that);
    });
    $(' .continue-text, .yt-thumbnail').on('click', function () {
        var video = $('.wistia-video-container video');
        video.prop('muted', false);
        if (typeof player !== 'undefined') {
            player.unMute();
            player.setShowInfo(false);
            player.playVideo();
        }
        $('body').addClass('full-body-video');
        countWrapperHeight();
    });
    $(document).on("player.video.loaded", function () {
        alturaDivVideo = $('.wistia-video-container').height();
        player.seekTo(0.1, true);
    });
    $(document).on("player.video.started", function () {
        $('#play-button-video').css('background', 'none');
        $('.continue-text').hide();
        videoPausado  = false;
    });
    $(document).on("player.video.paused", function () {
        videoPausado  = true;
        $('.video-paused-btn').show();
        $('.ytp-pause-overlay-container').hide();
        $('#play-button-video').css('background', 'linear-gradient(to top, #000000 35%, transparent)');
        var videoOffsetBottom = $('.video-absolute').offset().top + $('.video-absolute').outerHeight() - $(window).scrollTop();
        if (videoOffsetBottom > 0)
            $('.continue-text').show();
        $('body').removeClass('full-body-video');
        countWrapperHeight();
    });
    function fullScreenVideo(that) {
        if (typeof player !== 'undefined') {
            player.playVideo().then(function () {
                var iframe = that.find('iframe').get(0);
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                } else if (iframe.mozRequestFullScreen) {
                    iframe.mozRequestFullScreen();
                } else if (iframe.webkitRequestFullscreen) {
                    iframe.webkitRequestFullscreen();
                } else if (iframe.msRequestFullscreen) {
                    iframe.msRequestFullscreen();
                }
            });
        }
    }
    function countWrapperHeight() {
        if ($('body').hasClass('full-body-video')) {
            var videoHei = $('.wistia-video-container').height() - $('#video-box .wrapper').offset().top;
            $('#video-box .wrapper').height(videoHei);
        } else {
            $('#video-box .wrapper').height('auto');
        }
    }
});



//Meu codigo

$(document).ready(function() {
    var isVideoFullScreen = false;

    // Função para colocar o vídeo em tela cheia ao clicar no botão ou na overlay
    $('#fullscreen-button, #play-button-video').on('click', function() {
        var iframe = $('#video')[0];
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { /* Firefox */
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { /* IE/Edge */
            iframe.msRequestFullscreen();
        }
        isVideoFullScreen = true; // Marca o vídeo como em tela cheia
    });

    // Função para sair do modo de tela cheia quando o vídeo é pausado
    $(document).on("player.video.paused", function () {
        if (isVideoFullScreen) {
            exitFullScreen();
            isVideoFullScreen = false; // Atualiza o status do vídeo para não estar mais em tela cheia
        }
    });

    function exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
});

  

// Configuração final

var player;
    var firstTimePlaying = true;
    var isVideoLoaded = false;
    var playerState;

    (function () {
        $('#video').load(function () {
            player = new YT.Player('video', {
                width: '100%',
                //videoId: '_pu9wCjLXlw',

                events: {
                    'onReady': function (event) {
                        $(document).trigger('player.video.loaded');
                        isVideoLoaded = true;

                        console.log('Ativar-o-som');
                        player.unMute();
                        $('.video-paused-btn').hide();
                    },
                    'onStateChange': function (event) {
                        playerState = event;
                        if (event.data === YT.PlayerState.PLAYING) {
                            $(document).trigger('player.video.started');
                            $('.youtube-overlay').attr('style', 'display:block!important');

                            $('.play-text').fadeOut(200);
                            

                            if ($('body, html').width() > 1000 && firstTimePlaying === false) {
                                $('.new-video-container').addClass('new-video-fullscreen');
                            }

                            // Fix iOS YT player muted
                        }
                        if (event.data === YT.PlayerState.PAUSED) {
                            $(document).trigger('player.video.paused');
                            $('.video-pause').show();

                            $('.new-video-container').removeClass('new-video-fullscreen');

                            $('.new-video-container .video-border').height('auto');
                            $('.new-video-container .video-border, .new-video-container, .new-video-container .video, .new-video-container iframe').attr('style', '');

                            console.log('paused');
                        }
                    }
                }
            });

            $(document).on('player.video.loaded', function () {
                var playButton = document.getElementById("play-button-video");
                var videoStarted = false;

                //autoPlay
                if (playButton) {
                    $("#play-button-video").css('background', 'none');

                }
                videoStarted = true;
                player.playVideo();

                // play button
                if (playButton) {
                    playButton.addEventListener("click", function () {
                        if (!videoStarted) {
                            $("#play-button-video").css('background', 'none');
                            videoStarted = true;
                        }

                        if (player.getPlayerState() === 1 && firstTimePlaying === false) {
                            player.pauseVideo();
                            $('.video-paused-btn, .continue-text, .pageBox').fadeIn(400);
                        } else {
                            player.unMute();
                            player.playVideo();
                            $('.pageBox').hide();
                            $('.video-paused-btn, .continue-text').fadeOut(400);
                        }

                        firstTimePlaying = false;
                    });
                }
                // every second fire the playing event
                setInterval(function () {
                    // broadcast the event
                    $(document).trigger('player.video.playing', [{
                        playbackTime: player.getCurrentTime(),
                        videoLength: player.getDuration()
                    }]);
                }, 1000);
            });
        })
    })();
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

    // Adiciona estilos CSS dinamicamente usando JavaScript
function adicionarEstilosDinamicos() {
    const estilos = `
        /* Configuração de vídeo Início */
        .wistia_responsive_wrapper > div {
            padding: 0 !important;
            position: static !important;
        }
        @media screen and (min-width: 650px) {
            .wistia_responsive_wrapper > div {
                padding: 56.25% 0 0 0;
                position: relative;
            }
        }
        #play-button-video {
            cursor: pointer !important;
        }
        .mobile .wistia_responsive_wrapper #play-button-video {
            display: block !important;
        }
        .video-absolute {
            height: 100% !important;
            border: 1px #ffffff solid;
            border-radius: 10px;
        }
        .semt {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 102;
            text-align: center;
        }
        .youtube-overlay {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: 100;
            width: 36%;
            height: 30%;
        }
        .edge-to-edge #content .wrapper {
            overflow: hidden;
        }
        .edge-to-edge .video-box {
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            height: auto;
            display: block;
            border: 5px solid #ffffff;
            border-radius: 10px;
        }
        .mobile .video-wrapper {
            overflow: hidden;
        }
        .mobile .video-box {
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            height: auto;
            display: block;
            border: 5px solid #ffffff;
            border-radius: 10px;
        }
        .bigThumbnail {
            min-height: 50vh;
            position: relative;
        }
        .bigThumbnail .yt-thumbnail {
            background-size: contain;
            background-position: center;
        }
        @media screen and (orientation: landscape) {
            .bigThumbnail {
                height: 100%;
            }
            .bigThumbnail--video {
                padding: 56.25% 0 0 0;
                position: relative;
            }
            .bigThumbnail .yt-thumbnail {
                background-size: cover;
            }
        }
        .video-paused-btn {
            position: absolute;
            left: 50%;
            top: 50%;
            filter: hue-rotate(150deg) invert(100%);
            transform: translate(-50%, -50%);
            cursor: pointer;
            border-radius: 50px;
            animation: pulse-xy 2s infinite;
        }
        .video-paused-btn img {
            width: 120px !important;
            height: 120px !important;
        }
        .play-text,
        .continue-text {
            position: absolute;
            left: 50%;
            top: 5%;
            font-size: 20px;
            color: white;
            z-index: 999;
            transform: translateX(-50%);
            font-weight: bold;
            cursor: pointer;
            animation: pulse-x 2s infinite;
            -webkit-text-stroke: 1px black;
            font-family: sans-serif;
        }
        .play-text--bottom,
        .continue-text--bottom {
            top: 90%;
        }
        .mobile #play-button-video,
        .mobile .youtube-overlay {
            display: none !important;
        }
        .full-body-video .video-absolute {
            position: static;
        }
        .full-body-video .wistia-video-container {
            box-shadow: none !important;
            border: none !important;
            position: absolute !important;
            left: 0 !important;
            top: -5px !important;
            right: 0 !important;
            bottom: 0 !important;
            max-height: 100vh !important;
            width: 100% !important;
            height: 100vh !important;
            margin: 5px auto !important;
            background-color: black !important;
            border-radius: 0 !important;
            z-index: 999;
        }
        .full-body-video .wistia-video-container #video {
            height: 100% !important;
            width: 100vw !important;
            max-height: 100%;
            max-width: 100%;
        }
        .full-body-video .wistia_responsive_padding {
            height: 100% !important;
            padding: 0 !important;
        }
        @media screen and (min-width: 1320px) {
            .videobox-ext {
                padding-right: 15% !important;
                padding-left: 15% !important;
            }
        }
        @media screen and (max-width: 525px) {
            .video-paused-btn img {
                width: 100px !important;
                height: 100px !important;
            }
            .continue-text,
            .play-text {
                font-size: 14px;
            }
        }
        @media screen and (max-width: 375px) {
            .video-paused-btn img {
                width: 80px !important;
                height: 80px !important;
            }
            .continue-text,
            .play-text {
                font-size: 12px;
            }
        }
        @media screen and (max-width: 320px) {
            .video-paused-btn img {
                width: 60px !important;
                height: 60px !important;
            }
            .continue-text,
            .play-text {
                font-size: 10px;
            }
        }
        @keyframes pulse-xy {
            0% {
                transform: translate(-50%, -50%) scale(1);
            }
            50% {
                transform: translate(-50%, -50%) scale(1.2);
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
            }
        }
        @keyframes pulse-x {
            0% {
                transform: translateX(-50%) scale(1);
            }
            50% {
                transform: translateX(-50%) scale(1.2);
            }
            100% {
                transform: translateX(-50%) scale(1);
            }
        }
        /* Configuração Geral Início */
        .pai {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 56vw;
            background: black;
            overflow: hidden;
        }
        * {
            border: 1px;
            box-sizing: border-box;
            margin: 0%;
            padding: 0%;
            overflow: hidden;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = estilos;
    document.head.appendChild(styleSheet);
}

// Chama a função para aplicar os estilos
adicionarEstilosDinamicos();

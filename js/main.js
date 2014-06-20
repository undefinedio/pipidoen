var currentURl = function () {
    var url = window.location.href;
    var loc = window.location;
    if (loc.port != undefined) {
        var url = loc.protocol + '//' + loc.hostname + ':' + loc.port;
    } else {
        var url = loc.protocol + '//' + loc.hostname;
    }
    return url;
};
var queryParam = function (name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) return "";
    else return results[1];
};

var hashCode = function (str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};
var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var intToARGB = function (i) {
    return ((i >> 24) & 0xFF).toString(16) +
        ((i >> 16) & 0xFF).toString(16) +
        ((i >> 8) & 0xFF).toString(16) +
        (i & 0xFF).toString(16);
};

$(function () {
    document.body.style.webkitTouchCallout = 'none';

    var userName = decodeURIComponent(queryParam('uid')).replace("+", " ");
    var userSound = queryParam('sound');
    var userColor = intToARGB(hashCode(userName)).substring(0, 6);
    $('.dick-name').html(userName);
    readyForPissing();
    var plas = $("#plas")[0];




    document.getElementById('plas').addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);


    function playSounds(sound) {
        sound.pause();

        sound.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);

        sound.play();
    }

    function endSounds(sound) {
        sound.pause();
        sound.currentTime = 0;
    }

    function readyForPissing() {
        if (userName.toUpperCase() == "BLACK PYTHON") {
            $("#black-penis").show();

        } else {
            $("#white-penis").show();
        }
        $('body').css('background-color', '#' + userColor);

        //init eventlisteners
        $('.penis').on({
            touchstart: function (e) {
                $('.druppels').addClass('topTobottom');
                $('.penis').addClass('shake');
                e.preventDefault();
                playSounds(plas);
            },
            touchend: function () {
                $('.druppels').removeClass('topTobottom');
                $('.penis').removeClass('shake');
                endSounds(plas);
            },
            mouseenter: function () {
                $('.druppels').addClass('topTobottom');
                $('.penis').addClass('shake');
                playSounds(plas);
            },
            mouseleave: function () {
                $('.penis').removeClass('bounceInUp');
                $('.penis').removeClass('shake');
                $('.druppels').removeClass('topTobottom');
                endSounds(plas);
            }
        });
    };
});

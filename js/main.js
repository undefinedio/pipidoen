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
    var userColor = intToARGB(hashCode(userName)).substring(0, 6);
    var userSound = '../assets/audio/plas' + getRandomInt(1, 3) + '.mp3';
    $('.dick-name').html(userName);
    var $counter = $(".litersOfPee");
    var liters = 0;
    readyForPissing();
    var plas = $("#plas")[0];
    var litercounter;
    var litersOfPeeInLocalStorage;


// Put the object into storage
    function setInLocalStorage(liters) {
        litersOfPeeInLocalStorage = { 'liters': liters, 'dicksNick' : userName };
        localStorage.setItem('litersOfPeeInLocalStorage', JSON.stringify(litersOfPeeInLocalStorage));
    }

// Retrieve the object from storage
    var retrievedObject = localStorage.getItem('litersOfPeeInLocalStorage');

    if (retrievedObject == null) {

        litersOfPeeInLocalStorage = { 'liters': 0 };
        localStorage.setItem('litersOfPeeInLocalStorage', JSON.stringify(litersOfPeeInLocalStorage));

    } else {
        litersOfPeeInLocalStorage = JSON.parse(retrievedObject);
        liters = litersOfPeeInLocalStorage.liters;
        $counter.html(liters / 100 + " L");
        console.log('retrievedObject: ', litersOfPeeInLocalStorage);
    }


    var sound = new Howl({
        urls: [userSound],
        autoplay: false,
        loop: true
    });


    function playSounds() {
        sound.play();
    }

    function endSounds() {
        sound.pause();
    }

    function startLiters() {

        litercounter = setInterval(function () {
            liters++;
            $counter.html(liters / 100 + " L");
            console.log(liters / 100 + " L");

        }, 200);

    }

    function stopLiters() {
        clearInterval(litercounter);
        setInLocalStorage(liters);
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
                playSounds();
                startLiters();
            },
            touchend: function () {
                $('.druppels').removeClass('topTobottom');
                $('.penis').removeClass('shake');
                endSounds();
                stopLiters();
            },
            mouseenter: function () {
                $('.druppels').addClass('topTobottom');
                $('.penis').addClass('shake');
                playSounds();
                startLiters();
            },
            mouseleave: function () {
                $('.penis').removeClass('bounceInUp');
                $('.penis').removeClass('shake');
                $('.druppels').removeClass('topTobottom');
                endSounds();
                stopLiters();
            }
        });
    };
});

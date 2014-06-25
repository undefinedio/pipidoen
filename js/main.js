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
    var milliliters = 0;
    readyForPissing();
    var plas = $("#plas")[0];
    var litercounter;
    var litersOfPeeInLocalStorage;

    if (("standalone" in window.navigator) && window.navigator.standalone) {
        $("body").addClass('fullscreen');
    }


// Put the object into storage
    function setInLocalStorage(milliliters, userName) {
        litersOfPeeInLocalStorage = {
            'milliliters': milliliters
        };
        localStorage.setItem("dick:" + userName, JSON.stringify(litersOfPeeInLocalStorage));
        localStorage.setItem("latestUserName", userName);

        var userNames = localStorage.getItem("userNames");
        if (userNames) {
            userNames = JSON.parse(userNames);
            userNames.forEach(function (user, index) {
                if (user.userName == userName) {
                    userNames.splice(index, 1);
                }
            });
            var newItem = {"userName": userName, "milliliters": milliliters};
            userNames.push(newItem);
            localStorage.setItem("userNames", JSON.stringify(userNames));
        } else {
            userNames = [
                {"userName": userName, "milliliters": milliliters}
            ];
            localStorage.setItem("userNames", JSON.stringify(userNames));
        }
    }


// Retrieve the object from storage
    var retrievedObject = localStorage.getItem("dick:" + userName);


    if (retrievedObject !== null && JSON.parse(retrievedObject)) {
        litersOfPeeInLocalStorage = JSON.parse(retrievedObject);
        milliliters = litersOfPeeInLocalStorage.milliliters;
        $counter.html(milliliters / 100 + " L");
        console.log('retrievedObject: ', litersOfPeeInLocalStorage);
    } else {
        litersOfPeeInLocalStorage = {
            'milliliters': 0
        };
        localStorage.setItem('litersOfPeeInLocalStorage', JSON.stringify(litersOfPeeInLocalStorage));

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
            milliliters++;
            $counter.html(milliliters / 100 + " L");
            console.log(milliliters / 100 + " L");

        }, 200);

    }

    function stopLiters() {
        clearInterval(litercounter);
        setInLocalStorage(milliliters, userName);
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

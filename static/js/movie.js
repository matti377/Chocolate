const createObjectFromString = (str) => {
	return eval(`(function () { return ${str}; })()`);
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

window.onload = function() {
    let lastPush = 0
    let options;
    let allSourceId = document.getElementById("allSourceId")
    let allSourcesId = []
    for (let i = 0; i < allSourceId.children.length; i++) {
        allSourcesId.push(allSourceId.children[i].id)
    }

    var path = window.location.pathname
    movieID = window.location.href.split("/")[4]


    options = {
        controls: true,
        preload: 'none',
        techOrder: ['chromecast', 'html5'],
        html5: {
            vhs: {
                overrideNative: !videojs.browser.IS_SAFARI,
            },
            nativeAudioTracks: false,
            nativeVideoTracks: false
        },
        plugins: {
            chromecast: {}
        },
        controlBar: {
            children: [
               'playToggle',
               'volumePanel',
               'currentTimeDisplay',
               'progressControl',
               'remainingTimeDisplay',
               'captionsButton',
               'audioTrackButton',
               'chromecastButton',
               'airPlayButton',
               'pictureInPictureToggle',
               'fullscreenToggle',
            ],
        }, 
    }

    //add the quality selector
    var player = videojs('movie', options);

    player.hlsQualitySelector({
        displayCurrentQuality: true,
        placementIndex : 7
    });

    var cc = new Castjs();
    var player = videojs('movie');

    $(document).on("click", ".vjs-chromecast-button", () => {
        if (cc.available && !cc.session) {
          var vd = $("#my-video");
          cc.cast(vd.find("Source:first").attr("src"), {
            poster: vd.attr("data-poster"),
            title: vd.attr("data-title"),
            time: player.currentTime(),
            muted: false,
            paused: false
          });
        } else {
          cc.disconnect();
          $(".cc-remote").hide(200);
          $(".cc-state")
            .find("use")
            .attr("xlink:href", "#cc-inactive");
        }
      });
      
      cc.on("available", () => {
        $(
          '<div class="vjs-chromecast-selector vjs-menu-button vjs-menu-button-popup vjs-control vjs-button"><button class="vjs-menu-button vjs-menu-button-popup vjs-chromecast-button vjs-button" type="button" aria-disabled="false" aria-haspopup="true" aria-expanded="false" title="Chromecast"><span aria-hidden="true" class="vjs-icon-placeholder"><a class="cc-state"><svg class="icon" viewBox="0 0 36 36"><use id="target" xlink:href="#cc-inactive"></use></svg></a></span></button></div>'
        ).insertAfter(
          $(".vjs-control-bar")
            .children()
            .last()
        );
      });
      
      cc.on("session", () => {
        $(".cc-remote").show(200);
        $(".cc-state")
          .find("use")
          .attr("xlink:href", "#cc-active");
        $(".cc-remote-display-status-text").text("Casting to " + cc.device);
      });
      
      //
      player.on("pause", () => {
        if (cc.session) cc.pause();
      });
      
      player.on("play", () => {
        if (cc.session){
          player.pause();
          cc.play();
        } 
      });
      
      player.on("seeking", () => {
        if (cc.session) cc.seek(player.currentTime());
      });
      
      player.on("volumechange", () => {
        if (cc.session) {
          if (player.muted()) {
            cc.volume(0);
          } else {
            cc.volume(player.volume());
          }
        }
      });

    value = {false: "is not", true: "is"}

    console.log(`User ${value[videojs.browser.IS_IOS]} on IOS\nUser ${value[videojs.browser.IS_SAFARI]} on Safari\nUser ${value[videojs.browser.IS_ANDROID]} on Android\nUser ${value[videojs.browser.IS_CHROME]} on Chrome`)
    /*
    if (videojs.browser.IS_IOS || videojs.browser.IS_SAFARI) {
        player.airPlay();
        let airPlayButton = getElementByXpath("//*[@id='movie']/div[4]/button[3]")
        airPlayButton.classList.remove("vjs-hidden")
    } else {
        player.chromecast();
        let chromecastButton = getElementByXpath("//*[@id='movie']/div[4]/button[2]")
        chromecastButton.classList.remove("vjs-hidden")
    }*/
    

    var video = document.getElementById("movie_html5_api")
    video.addEventListener("timeupdate", function() {
        let href = window.location.href
        movieID = href.split("/")[4]
        let currentTime = video.currentTime
        currentTime = parseInt(currentTime)
        if (currentTime == lastPush+1) {
            fetch(`/setVuesTimeCode/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //set the form
                body: JSON.stringify({
                    movieID: movieID,
                    timeCode: currentTime
                })
            })
            lastPush = currentTime
        }
    })


    let username = ""
    fetch("/whoami").then(function(response) {
        return response.json()
    }).then(function(data) {
        username = data.name
    }).then(function() {
        fetch(`/getMovieData/${movieID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
        .then(data => {
            vues = data.vues
            //vues is a string representing an array convert it to an array
            vues = createObjectFromString(vues)
            if (vues[username] !== undefined){
                timeCode = vues[username]
                timeCode = parseInt(timeCode)
                var popup = document.getElementById("popup")
                popup.style.display = "block"

                buttonYes = document.getElementById("buttonYes")
                buttonYes.addEventListener("click", function() {
                    popup.style.display = "none"
                    document.body.style.overflow = "auto"
                    video = document.getElementById("movie_html5_api")
                    video.currentTime = timeCode
                    lastPush = timeCode
                })

                buttonNo = document.getElementById("buttonNo")
                buttonNo.addEventListener("click", function() {
                    popup.style.display = "none"
                    document.body.style.overflow = "auto"
                    video = document.getElementById("movie_html5_api")
                })
            }
        })
    })

    var path = window.location.pathname
    var slug = path.split("/")
    slug = slug[2]

}
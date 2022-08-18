var closePopup = document.getElementById("crossPopup")
closePopup.addEventListener("click", function() {
    popup = document.getElementById("popup")
    popup.style.display = "none"

    document.body.style.overflow = "auto"

    var imagePopup = document.getElementsByClassName("coverPopup")[0]
    imagePopup.setAttribute("src", "");
    imagePopup.setAttribute("alt", "");
    imagePopup.setAttribute("title", "");

    var titlePopup = document.getElementsByClassName("titlePopup")[0]
    titlePopup.innerHTML = "";

    var descriptionPopup = document.getElementsByClassName("descriptionPopup")[0]
    descriptionPopup.innerHTML = "";

    var notePopup = document.getElementsByClassName("notePopup")[0]
    notePopup.innerHTML = "";

    var yearPopup = document.getElementsByClassName("yearPopup")[0]
    yearPopup.innerHTML = "";

    var genrePopup = document.getElementsByClassName("genrePopup")[0]
    genrePopup.innerHTML = "";

    var durationPopup = document.getElementsByClassName("durationPopup")[0]
    durationPopup.innerHTML = "";

    castPopup = document.getElementById("castPopup")
    castDivs = document.getElementsByClassName("castMember")
    image = document.getElementsByClassName("castImage")[0]
    while (castDivs.length > 0) {
        image.setAttribute("src", "")
        castPopup.removeChild(castDivs[0])
    }
    childs = document.getElementsByClassName("serie")
    while (childs.length > 0) {
        childs[0].remove()
    }
    var similar = document.getElementsByClassName("containerSimilar")[0]
    similar.style.gridTemplateColumns = "repeat(0, 1fr)"
    containerSeasons = document.getElementsByClassName("containerSeasons")[0]
    while (containerSeasons.firstChild) {
        containerSeasons.removeChild(containerSeasons.firstChild)
    }

    var trailerVideo = document.getElementById("trailerVideo")
    trailerVideo.setAttribute("src", "")
    trailerVideo.remove()
})

function goToSeason(title, id) {
    href = "/serie/" + title + "/" + id
    window.location.href = href
}

function setPopup() {
    covers = document.getElementsByClassName("cover")
    for (var i = 0; i < covers.length; i++) {
        covers[i].addEventListener("click", function() {

            popup = document.getElementById("popup")
            popup.style.display = "block"

            document.body.style.overflow = "hidden"

            var image = this.children[0].children[0]
            var serieTitle = image.getAttribute("title");

            fetch("/getSerieData/" + serieTitle).then(function(response) {
                return response.json()
            }).then(function(data) {
                var serieTitle = data.name

                var serieCast = data.cast
                var serieDescription = data.description
                var serieDuration = data.duration
                var serieGenre = data.genre
                var serieNote = data.note
                var seriePoster = data.serieCoverPath
                var serieUrl = data.slug
                var serieYear = data.date
                var serieTrailer = data.bandeAnnonce
                var serieSimilar = data.similarSeries
                var serieSeasons = data.seasons
                containerSimilar = document.getElementsByClassName("containerSimilar")[0]
                containerSeasons = document.getElementsByClassName("containerSeasons")[0]

                if (serieSimilar.length === 0) {
                    containerSimilar.style.display = "none"

                } else {
                    containerSimilar.style.display = "inline-grid"
                }
                console.log(serieSeasons)
                for (var i = 0; i < serieSeasons.length; i++) {
                    season = serieSeasons[i]
                    seasonCover = season.seasonCoverPath
                    seasonDescription = season.seasonDescription
                    seasonName = season.seasonName
                    seasonEpisodesNumber = season.episodesNumber
                    seasonNumber = season.seasonNumber
                    seasonUrl = "/serie/" + serieTitle + "/" + seasonNumber
                    seasonRelease = season.release

                    var seasonDiv = document.createElement("div")
                    seasonDiv.className = "season"
                    seasonDiv.setAttribute("id", seasonNumber)
                    seasonDiv.setAttribute("onclick", `goToSeason("${serieTitle}", "S${seasonNumber}")`)

                    var seasonCoverImage = document.createElement("img")
                    seasonCoverImage.className = "seasonCoverImage"
                    seasonCoverImage.setAttribute("src", seasonCover)
                    seasonCoverImage.setAttribute("alt", seasonName)
                    seasonCoverImage.setAttribute("title", seasonName)
                    seasonCoverImage.setAttribute("onclick", `goToSeason("${serieTitle}", "S${seasonNumber}")`)

                    var seasonNameP = document.createElement("p")
                    seasonNameP.className = "seasonTitle"
                    seasonNameP.innerHTML = seasonName
                    seasonNameP.setAttribute("onclick", `goToSeason("${serieTitle}", "S${seasonNumber}")`)

                    seasonDiv.appendChild(seasonCoverImage)
                    seasonDiv.appendChild(seasonNameP)
                    containerSeasons.appendChild(seasonDiv)
                }

                for (var i = 0; i < serieSimilar.length; i++) {
                    if (i < 4) {
                        var serie = serieSimilar[i]
                        imageUrl = serie.cover
                        serieName = serie.realTitle
                        var similar = document.getElementsByClassName("containerSimilar")[0]
                        var serie = document.createElement("div")
                        serie.setAttribute("class", "serie")
                        var image = document.createElement("img")
                        image.setAttribute("class", "serieImage")
                        image.setAttribute("src", imageUrl)
                        image.setAttribute("alt", serieName)
                        image.setAttribute("title", serieName)
                        var title = document.createElement("p")
                        title.setAttribute("class", "serieTitle")
                        title.innerHTML = serieName

                        serie.appendChild(image)
                        serie.appendChild(title)
                        similar.appendChild(serie)
                    }
                }

                var childs = document.getElementsByClassName("serie")
                var childsLength = childs.length
                var similar = document.getElementsByClassName("containerSimilar")[0]
                similar.style.gridTemplateColumns = "repeat(" + childsLength + ", 1fr)"


                var imagePopup = document.getElementsByClassName("coverPopup")[0]
                imagePopup.setAttribute("src", seriePoster);
                if (imagePopup.src == "https://image.tmdb.org/t/p/originalNone") {
                    imagePopup.src = brokenPath
                }
                imagePopup.setAttribute("alt", serieTitle);
                imagePopup.setAttribute("title", serieTitle);

                var titlePopup = document.getElementsByClassName("titlePopup")[0]
                titlePopup.innerHTML = serieTitle;

                var descriptionPopup = document.getElementsByClassName("descriptionPopup")[0]
                descriptionPopup.innerHTML = serieDescription;

                var notePopup = document.getElementsByClassName("notePopup")[0]
                notePopup.innerHTML = `Note : ${serieNote}/10`;

                var yearPopup = document.getElementsByClassName("yearPopup")[0]
                yearPopup.innerHTML = `Date : ${serieYear}`;

                var genrePopup = document.getElementsByClassName("genrePopup")[0]
                var genreList = serieGenre
                var genreString = ""
                for (var i = 0; i < genreList.length; i++) {
                    genreString += genreList[i]
                    if (i != genreList.length - 1) {
                        genreString += ", "
                    }
                }
                genrePopup.innerHTML = `Genre : ${genreString}`;

                var durationPopup = document.getElementsByClassName("durationPopup")[0]
                durationPopup.innerHTML = `Durée : ${serieDuration}`;
                for (var i = 0; i < serieCast.length; i++) {
                    cast = serieCast[i]
                    castMember = document.createElement("div")
                    castMember.className = "castMember"
                    castImage = document.createElement("img")
                    castImage.className = "castImage"
                    castImageUrl = cast["profile_path"]
                    castImageUrl = "https://image.tmdb.org/t/p/original" + castImageUrl
                    castRealName = cast["name"]
                    castCharacterName = cast["character"]
                    castImage.setAttribute("src", castImageUrl)
                    castImage.setAttribute("alt", castRealName)
                    castImage.setAttribute("title", castRealName)
                    castMember.appendChild(castImage)
                    castName = document.createElement("p")
                    castName.className = "castName"
                    castName.innerHTML = castRealName
                    castMember.appendChild(castName)
                    castCharacter = document.createElement("p")
                    castCharacter.className = "castCharacter"
                    castCharacter.innerHTML = castCharacterName
                    castMember.appendChild(castCharacter)
                    castPopup.appendChild(castMember)
                }

                castMembers = document.getElementsByClassName("castMember")
                for (var i = 0; i < castMembers.length; i++) {
                    castMembers[i].addEventListener("click", function() {
                        var castImage = this.children[0]
                        var castRealName = castImage.getAttribute("alt")
                        var castUrl = "/actor/" + castRealName
                        window.location.href = castUrl
                    })
                }

                var trailer = document.getElementsByClassName("containerTrailer")[0]
                if (serieTrailer == "") {
                    trailer.style.display = "none"
                } else {
                    trailer.style.display = "block"
                    trailerVideo = document.createElement("iframe")
                    regex = /^(http|https):\/\//g
                    if (regex.test(serieTrailer)) {
                        serieTrailer.replace(regex, "")
                    }
                    trailerVideo.setAttribute("src", serieTrailer)
                    trailerVideo.setAttribute("class", "trailerVideo")
                    trailerVideo.setAttribute("id", "trailerVideo")
                    trailer.appendChild(trailerVideo)
                }

                var playButton = document.getElementsByClassName("playPopup")[0]
                playButton.setAttribute("href", serieUrl);
            })
        })
    }
}


function getSeasonData() {
    series = document.getElementsByClassName("series")[0]
    routeToUse = series.getAttribute("id")
    series.id = "series"
    url = window.location.href
    urlArray = url.split("/")
    serieName = urlArray[urlArray.length - 2]
    id = urlArray[urlArray.length - 1]

    fetch(`/getSeasonData/${serieName}/${id}`).then(function(response) {
        return response.json()
    }).then(function(data) {
        data = Object.entries(data)
        for (var i = 0; i < data.length; i++) {
            series = document.getElementsByClassName("series")[0]
            var serie = data[i]
            var cover = document.createElement("div")
            cover.className = "cover"
            var content = document.createElement("div")
            content.className = "content"
            var image = document.createElement("img")
            image.className = "cover_serie"
            if (serie[1][1]['serieCoverPath'] == "https://image.tmdb.org/t/p/originalNone" || serie[1][1]['serieCoverPath'] == undefined || serie[1][1]['serieCoverPath'] == "undefined") {
                image.src = brokenPath
            } else {
                image.src = serie[1][1]['serieCoverPath']
            }
            image.title = serie[1][0]
            image.alt = serie[1][0]

            content.appendChild(image)
            cover.appendChild(content)
            series.appendChild(cover)
        }

        setPopup()
    })
}

window.onload = function() {
    getSeasonData()
}
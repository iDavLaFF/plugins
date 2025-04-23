!function() {
    "use strict";

    window.logoplugin || (window.logoplugin = !0, Lampa.Listener.follow("full", function(a) {
        if ("complite" == a.type) {
            var e = a.data.movie,
                mediaType = e.first_air_date ? "tv" : "movie",
                cacheKey = 'logo_' + mediaType + '_' + e.id,
                currentLang = Lampa.Storage.get("language"),
                cachedLogo = localStorage.getItem(cacheKey);
            if (cachedLogo) {
                cachedLogo = JSON.parse(cachedLogo);
                if (cachedLogo.timestamp > Date.now() - 30 * 24 * 60 * 60 * 1000) {
                    insertLogo(a.object.activity.render(), cachedLogo.path, true);
                    return;
                }
            }
            var mainRequest = Lampa.TMDB.api(mediaType + "/" + e.id + "/images?api_key=" + Lampa.TMDB.key() + "&language=" + currentLang);
            $.get(mainRequest, function(mainData) {
                if (mainData.logos && mainData.logos[0] && mainData.logos[0].file_path) {
                    var logoPath = mainData.logos[0].file_path;
                    cacheLogo(logoPath, cacheKey);
                    insertLogo(a.object.activity.render(), logoPath, false);
                } else if (currentLang !== 'en') {
                    var enRequest = Lampa.TMDB.api(mediaType + "/" + e.id + "/images?api_key=" + Lampa.TMDB.key() + "&language=en");
                    $.get(enRequest, function(enData) {
                        if (enData.logos && enData.logos[0] && enData.logos[0].file_path) {
                            var logoPath = enData.logos[0].file_path;
                            cacheLogo(logoPath, cacheKey);
                            insertLogo(a.object.activity.render(), logoPath, false);
                        }
                    });
                }
            });
        }
    }));
    function cacheLogo(path, key) {
        var logoData = {
            path: path,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(logoData));
    }
    function insertLogo(renderElement, logoPath, fromCache) {
        var logoBlock = renderElement.find(".full-start-new__logo-block");
        var titleElement = logoBlock.find(".full-start-new__title");
        var logoImg = $(`<img class="logo-img" style="display: block; max-height: 11em; width: auto; margin-top: -1em; margin-bottom: 1em; align-self: center; transform: translateY(20px); transition: all 0.5s ease;" src="${Lampa.TMDB.image("/t/p/w500" + logoPath)}">`);
        titleElement.remove();
        if (fromCache) {
            logoBlock.append(logoImg);
        } else {
            logoImg.css({'transform': 'translateY(20px)', 'opacity': '0', 'transition': 'all 0.5s ease'});
            logoBlock.append(logoImg);
            setTimeout(function() {
                logoImg.css({'transform': 'translateY(0)', 'opacity': '1'});
            }, 50);
        }
    }
}();
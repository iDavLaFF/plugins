!function() {
    "use strict";

    window.logoplugin || (window.logoplugin = !0, Lampa.Listener.follow("full", function(a) {
        if ("complite" == a.type) {
            var e = a.data.movie,
                t = Lampa.TMDB.api((e.first_air_date ? "tv" : "movie") + "/" + e.id + "/images?api_key=" + Lampa.TMDB.key() + "&language=" + Lampa.Storage.get("language"));
            
            console.log(t);
            
            $.get(t, function(e) {
                if (e.logos && e.logos[0]) {
                    var t = e.logos[0].file_path;
                    if ("" != t) {
                        var logoBlock = a.object.activity.render().find(".full-start-new__logo-block");
                        var titleElement = logoBlock.find(".full-start-new__title");
                        var logoImg = $(`<img class="logo-img" style="display: block; max-height: 13em; width: auto; margin-top: 0; align-self: center; transform: translateY(20px); opacity: 0; transition: all 0.5s ease; visibility: hidden;" src="${Lampa.TMDB.image("/t/p/w500" + t.replace(".svg", ".png"))}">`);
                        logoBlock.append(logoImg);
                        titleElement.css({'transition': 'all 0.5s ease', 'transform': 'translateY(-20px)', 'opacity': '0'});
                        setTimeout(function() {
                            titleElement.remove();
                            logoImg.css('visibility', 'visible');
                            setTimeout(function() {
                                logoImg.css({'transform': 'translateY(0%)', 'opacity': '1'});
                            }, 50);
                        }, 500);
                    }
                }
            });
        }
    }));
}();
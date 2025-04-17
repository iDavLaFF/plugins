!function() {
    "use strict";
    
    Lampa.SettingsApi.addParam({
        component: "interface",
        param: {
            name: "logo_glav",
            type: "select",
            values: {
                1: "Скрыть",
                0: "Отображать"
            },
            default: "0"
        },
        field: {
            name: "Логотипы вместо названий",
            description: "Отображает логотипы фильмов вместо текста"
        }
    });

    window.logoplugin || (window.logoplugin = !0, Lampa.Listener.follow("full", function(a) {
        if ("complite" == a.type && "1" != Lampa.Storage.get("logo_glav")) {
            var e = a.data.movie,
                t = Lampa.TMDB.api((e.first_air_date ? "tv" : "movie") + "/" + e.id + "/images?api_key=" + Lampa.TMDB.key() + "&language=" + Lampa.Storage.get("language"));
            
            console.log(t);
            
            $.get(t, function(e) {
                if (e.logos && e.logos[0]) {
                    var t = e.logos[0].file_path;
                    if ("" != t) {
                        var titleElement = a.object.activity.render().find(".full-start-new__title");
                        var originalContent = titleElement.html();
                        $('<style>').text(`
                            .title-fade-up { opacity: 1; transform: translateY(0); transition: all 0.5s ease; }
                            .title-fade-up.hide { opacity: 0; transform: translateY(20px); }
                            .logo-animation { position: absolute; width: 100%; bottom: 0; transform: translateY(20px); opacity: 0; transition: all 0.5s ease; }
                            .logo-animation.show { transform: translateY(0); opacity: 1; }
                        `).appendTo('head');
                        titleElement.after(`
                        <div class="logo-container" style="overflow: hidden; height: 15em; position: relative; display: none; margin-bottom: 2em;">
                        <div class="logo-animation">
                            <img style="display: block; max-width: 80%; height: auto;" src="${Lampa.TMDB.image("/t/p/w500" + t.replace(".svg", ".png"))}"></div></div>`);
                        var logoContainer = titleElement.next(".logo-container");
                        titleElement.addClass('title-fade-up');
                        setTimeout(function() {
                            logoContainer.show();
                            titleElement.addClass('hide');
                            setTimeout(function() {
                                logoContainer.find(".logo-animation").addClass('show');
                                setTimeout(function() {
                                    titleElement.remove();
                                }, 500);
                            }, 50);
                        }, 500);
                    }
                }
            });
        }
    }));
}();
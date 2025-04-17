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

                            titleElement.after('<div class="logo-container" style="overflow: hidden; height: 1.8em; position: relative; display: none;">' + 
                                '<div class="logo-animation" style="position: absolute; width: 100%; transform: translateY(20px); opacity: 0; transition: all 0.5s ease;">' + 
                                '<img style="margin-top: 0.3em; margin-bottom: 0.4em; max-height: 1.8em; display: block;" src="' + 
                                Lampa.TMDB.image("/t/p/w500" + t.replace(".svg", ".png")) + '" />' + '</div>' + '</div>');

                            var logoContainer = titleElement.next(".logo-container");

                            titleElement.css({'transition': 'all 0.5s ease', 'transform': 'translateY(-20px)', 'opacity': '0'});

                            setTimeout(function() {
                                logoContainer.show();

                                setTimeout(function() {
                                    logoContainer.find(".logo-animation").css({'transform': 'translateY(0)', 'opacity': '1'});

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
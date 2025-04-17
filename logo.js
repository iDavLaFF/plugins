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
                        // Добавляем стили для эффекта Таноса
                        $('<style>').text(`
                            @keyframes thanos-snap {
                                0% { 
                                    opacity: 1; 
                                    transform: scale(1) translateY(0); 
                                    filter: blur(0);
                                }
                                50% { 
                                    opacity: 0.8; 
                                    transform: scale(1.05) translateY(-10px); 
                                    filter: blur(1px);
                                }
                                100% { 
                                    opacity: 0; 
                                    transform: scale(0.3) translateY(20px); 
                                    filter: blur(8px);
                                }
                            }
                            .thanos-snap {
                                animation: thanos-snap 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                            }
                        `).appendTo('head');
                        titleElement.after(`
                        <div class="logo-container" style="overflow: hidden; height: 15em; position: relative; display: none; margin-bottom: 2em;">
                        <div class="logo-animation" style="position: absolute; width: 100%; bottom: 0; transform: translateY(20px); opacity: 0; transition: all 0.5s ease;">
                            <img style="display: block; max-width: 100%; height: auto;" src="${Lampa.TMDB.image("/t/p/w500" + t.replace(".svg", ".png"))}"></div></div>`);
                        var logoContainer = titleElement.next(".logo-container");
                        // Применяем эффект Таноса к тексту
                        titleElement.css({'transform-origin': 'center', 'animation': 'thanos-snap 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards'});
                        setTimeout(function() {
                            logoContainer.show();
                            setTimeout(function() {
                                logoContainer.find(".logo-animation").css({'transform': 'translateY(0)', 'opacity': '1'});
                                setTimeout(function() {
                                    titleElement.remove();
                                }, 700);
                            }, 50);
                        }, 700);
                    }
                }
            });
        }
    }));
}();
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

    // Кэш логотипов
    window.__logo_cache = window.__logo_cache || {};

    // Предзагрузка логотипа при наведении
    $('body').on('mouseenter', '.card', function() {
        if (Lampa.Storage.get("logo_glav") === "1") return;

        var cardData = $(this).data('card-data');
        if (!cardData || !cardData.id) return;

        var mediaType = cardData.first_air_date ? "tv" : "movie";
        var id = cardData.id;
        if (window.__logo_cache[id]) return; // Уже загружено

        var url = Lampa.TMDB.api(`${mediaType}/${id}/images?api_key=${Lampa.TMDB.key()}&language=${Lampa.Storage.get("language")}`);
        
        $.get(url, function(response) {
            if (response.logos && response.logos[0]) {
                window.__logo_cache[id] = response.logos[0].file_path;
            } else {
                window.__logo_cache[id] = null;
            }
        });
    });

    // Подстановка логотипа при открытии карточки
    window.logoplugin || (window.logoplugin = !0, Lampa.Listener.follow("full", function(a) {
        if (a.type !== "complite" || Lampa.Storage.get("logo_glav") === "1") return;

        var movie = a.data.movie;
        var mediaType = movie.first_air_date ? "tv" : "movie";
        var id = movie.id;
        var logoPath = window.__logo_cache[id];

        var $title = a.object.activity.render().find(".full-start-new__title");

        if (logoPath) {
            // Используем кэш
            $title.css({ visibility: "hidden", opacity: 0 });
            $title.html(
                '<img style="margin-top: 0.3em; margin-bottom: 0.4em; max-height: 1.8em;" src="' + 
                Lampa.TMDB.image("/t/p/w500" + logoPath.replace(".svg", ".png")) + 
                '" />'
            );
            $title.css("visibility", "visible").animate({ opacity: 1 }, 300);
        }
    }));
}();
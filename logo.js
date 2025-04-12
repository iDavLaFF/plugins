(function () {
    'use strict';

    // Добавление настройки в интерфейс
    Lampa.SettingsApi.addParam({
        component: 'interface',
        param: {
            name: 'logo_card',
            type: 'boolean',
            default: true
        },
        field: {
            name: 'Логотип вместо названия'
        },
        onRender: function () {
            setTimeout(() => {
                $('div[data-name="logo_card"]').insertAfter('div[data-name="card_interfice_cover"]');
            }, 0);
        }
    });

    // Основной триггер на выбор карточки (фильма или сериала)
    Lampa.Listener.follow('card_interfice_type', function (event) {
        if (event.type === 'movie' && Lampa.Storage.get('logo_card') !== false) {
            const item = event.object;
            const type = item.name ? 'tv' : 'movie';

            const apiKey = '890cec001f63b935c6bd4538ac1d146d';
            const tmdbUrl = Lampa.Utils.protocol() + `tmdbapi.rootu.top/3/${type}/${item.id}/images?api_key=${apiKey}&language=${Lampa.Storage.get('language')}`;

            $.get(tmdbUrl, function (data) {
                if (data.logos && data.logos[0]) {
                    const filePath = data.logos[0].file_path;
                    if (filePath !== '') {
                        const container = event.card.full().render();
                        let logoImg = '';

                        const imgBase = 'http://tmdbimg.rootu.top/t/p/w500';
                        const proxy = Lampa.Utils.protocol() + 'tmdbimg.rootu.top/';
                        const proxySvg = Lampa.Utils.protocol() + 'tmdbapi.rootu.top/3/';

                        if (window.innerWidth > 585) {
                            const mode = Lampa.Storage.get('logo_card');

                            if (mode === 'new' && !$('.full-start-new.cardify').length) {
                                logoImg = `<img style="margin-top: 0.3em; margin-bottom: 0.4em; max-height: 1.8em;" src="${proxy}${imgBase}${filePath.replace('.svg', '.png')}" />`;
                                $('.full-start-new__tagline', container).remove();
                                $('.full-start-new__title', container).html(logoImg);
                            } else if (mode === 'full' && $('.full-start-new.cardify').length) {
                                logoImg = `<img style="margin-top: 0.6em; margin-bottom: 0.4em; max-height: 2.8em; max-width: 6.8em;" src="${proxySvg}${filePath.replace('.svg', '.png')}" />`;
                                $('.full-start__title-original', container).remove();
                                $('.full-start__title', container).html(logoImg);
                            } else if (mode === 'old' && !$('.full-start-new.cardify').length) {
                                logoImg = `<img style="margin-top: 0.3em; margin-bottom: 0.1em; max-height: 1.8em;" src="${proxySvg}${filePath.replace('.svg', '.png')}" />`;
                                $('.full-start__title-original', container).remove();
                                $('.full-start__title', container).html(logoImg);
                            }
                        } else {
                            if (Lampa.Storage.get('logo_card') === 'full') {
                                logoImg = `<img style="margin-top: 0.6em; margin-bottom: 0.4em; max-height: 2.8em; max-width: 6.8em;" src="${proxySvg}${imgBase}${filePath.replace('.svg', '.png')}" />`;
                                $('.full-start-new__tagline', container).remove();
                                $('.full-start-new__title', container).html(logoImg);
                            } else {
                                logoImg = `<img style="margin-top: 0.3em; margin-bottom: 0.4em; max-height: 2.2em;" src="${proxySvg}${filePath.replace('.svg', '.png')}" />`;
                                $('.full-start__title-original', container).remove();
                                $('.full-start__title', container).html(logoImg);
                            }
                        }
                    }
                }
            });
        }
    });

    // Запуск, когда приложение готово
    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('appready', function (event) {
            if (event.type == 'ready') init();
        });
    }

})();

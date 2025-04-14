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

            const apiKey = Lampa.TMDB.key();
            const tmdbUrl = Lampa.TMDB.api(`${type}/${item.id}/images?api_key=${apiKey}&language=${Lampa.Storage.get('language')}`);

            $.get(tmdbUrl, function (data) {
                if (data.logos && data.logos[0]) {
                    const filePath = data.logos[0].file_path;
                    if (filePath !== '') {
                        const container = event.card.full().render();
                        let logoImg = '';

                        const getLogoUrl = (path) => {
                            return Lampa.TMDB.image(`t/p/w500${path.replace('.svg', '.png')}`);
                        };

                        if (window.innerWidth > 585) {
                            const mode = Lampa.Storage.get('logo_card');

                            if (mode === 'new' && !$('.full-start-new.cardify').length) {
                                logoImg = `<img style="margin-top: 0.3em; margin-bottom: 0.4em; max-height: 1.8em;" src="${getLogoUrl(filePath)}" />`;
                                $('.full-start-new__tagline', container).remove();
                                $('.full-start-new__title', container).html(logoImg);
                            } else if (mode === 'full' && $('.full-start-new.cardify').length) {
                                logoImg = `<img style="margin-top: 0.6em; margin-bottom: 0.4em; max-height: 2.8em; max-width: 6.8em;" src="${getLogoUrl(filePath)}" />`;
                                $('.full-start__title-original', container).remove();
                                $('.full-start__title', container).html(logoImg);
                            } else if (mode === 'old' && !$('.full-start-new.cardify').length) {
                                logoImg = `<img style="margin-top: 0.3em; margin-bottom: 0.1em; max-height: 1.8em;" src="${getLogoUrl(filePath)}" />`;
                                $('.full-start__title-original', container).remove();
                                $('.full-start__title', container).html(logoImg);
                            }
                        } else {
                            if (Lampa.Storage.get('logo_card') === 'full') {
                                logoImg = `<img style="margin-top: 0.6em; margin-bottom: 0.4em; max-height: 2.8em; max-width: 6.8em;" src="${getLogoUrl(filePath)}" />`;
                                $('.full-start-new__tagline', container).remove();
                                $('.full-start-new__title', container).html(logoImg);
                            } else {
                                logoImg = `<img style="margin-top: 0.3em; margin-bottom: 0.4em; max-height: 2.2em;" src="${getLogoUrl(filePath)}" />`;
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

    function init() {
        // Переопределяет методы консоли — защита от отладки
        const overrideConsole = function () {
            const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
            methods.forEach((method) => {
                const original = console[method];
                console[method] = function () {
                    original.apply(console, arguments);
                };
            });
        };
        overrideConsole();
    }
})();
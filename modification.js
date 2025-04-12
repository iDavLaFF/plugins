    // Проверяем, существует ли объект lampa_settings
    if (typeof window.lampa_settings !== 'undefined') {
      // Обновляем настройки
      Object.assign(window.lampa_settings, {
        socket_use: false,
        socket_methods: false,
        account_use: true,
        account_sync: false,
        plugins_use: false,
        plugins_store: false,
        torrents_use: true,
        white_use: false,
        lang_use: false,
        read_only: false,
        dcma: false,
        push_state: false,
        iptv: false,
        feed: false,
        disable_features: {
          dmca: true,
          reactions: true,
          discuss: true,
          ai: true,
          install_proxy: true,
          subscribe: true,
          blacklist: true,
          persons: true,
          ads: true,
          trailers: true
        }
      });

      // Логируем изменения для отладки
      console.log('Настройки Lampa были изменены:', window.lampa_settings);
    }

    // Добавляем плагины
    const plugins = [
      'https://plugin.rootu.top/tmdb.js', // @ROOTU thanks. TMDB Proxy v1.1.1
      'https://idavlaff.github.io/plugins/tracks.js', // @CUB tracks plugin backup
      'https://idavlaff.github.io/plugins/beautify.js', // @CUB thanks, !'but pay for a big background, seriously?' Combine 'interface' & 'cardify' plugins => 'beautify'. @BYLAMPA thanks, for fix rating issue on card
//      'https://idavlaff.github.io/plugins/logo.js', //
      'https://lampame.github.io/main/pubtorr/pubtorr.js', // @LME thanks. Public parsers
//      'https://skaz.tv/export.js', //@SKAZ thanks. Bookmarks & History backup plugin
      'https://skaztv.online/export.js', //@SKAZ thanks. Bookmarks & History backup plugin
      'https://bwa.to/rc', // @LAMPAC thanks. Online balansers plugin
      'https://bwa.to/re' // @LAMPAC thanks. 18+ plugin
//      'https://ab2024.ru/sisi.js' // @LAMPAC thanks. 18+ balansers plugin. @AB thanks for more stable version of plugin
    ];

    Lampa.Utils.putScriptAsync(plugins, function (success){
      if (!success) {
        console.error('Ошибка загрузки плагинов');
      }
    });

    // Проверяем наличие Lampa и запускаем настройки
    const timer = setInterval(() => {
      if (typeof Lampa !== 'undefined') {
        clearInterval(timer);
        if (!Lampa.Storage.get('set', 'false')) startSet();
      }
    }, 200);

    function startSet() {
      const settings = {
        set: 'true',
        language: 'ru',
        interface_size: 'small',
        glass_style: 'true',
        advanced_animation: 'false',
        player_timecode: 'continue',
        video_quality_default: '2160',
        tmdb_lang: 'ru',
        poster_size: 'w500',
        parser_use: 'true',
        lme_url_two: 'jacred_xyz',
        source: 'cub',
        protocol: 'http',
        screensaver_time: '10',
        helper: 'false',
        pages_save_total: '3',
        keyboard_type: 'integrate',
        sisi_preview: 'false'
      };

      Object.keys(settings).forEach(key => Lampa.Storage.set(key, settings[key]));
      location.reload();
    }

    // Удаляем элементы из меню настроек
    const removeElements = (selector, context) => $(selector, context).remove();

    Lampa.Settings.listener.follow('open', (e) => {
      const components = ['account', 'tmdb', 'parental_control', 'sisi'];
      const params = ['light_version', 'background', 'background_type', 'black_style', 'card_interfice_type', 'card_interfice_poster', 'card_interfice_cover', 'glass_style', 'glass_opacity', 'card_interfice_reactions', 'interface_sound_play', 'interface_sound_level', 'scroll_type', 'card_views_type', 'hide_outside_the_screen', 'player_normalization', 'playlist_next', 'player_timecode', 'player_scale_method', 'player_hls_method', 'player_rewind', 'subtitles_start', 'subtitles_size', 'subtitles_stroke', 'subtitles_backdrop', 'video_quality_default', 'jackett_interview', 'parse_lang', 'parse_timeout', 'parse_in_search', 'torrserver_savedb', 'torrserver_preload', 'cache_images', 'screensaver', 'screensaver_type', 'screensaver_time', 'helper', 'helper--start-again', 'pages_save_total', 'time_offset', 'navigation_type', 'keyboard_type', 'card_quality', 'card_episodes', 'device_name', 'export'];
      const titles = ['Фон', 'Карточка', 'Стекло', 'Системные звуки', 'Субтитры', 'Дополнительно', 'Скринсейвер', 'Подсказки', 'Еще'];

      removeElements(components.map(c => `[data-component="${c}"]`).join(','), e.body);
      removeElements(params.map(p => `[data-name="${p}"]`).join(','), e.body);
      titles.forEach(text => removeElements(`.settings-param-title:has(span:contains("${text}"))`, e.body));
      removeElements('.settings-param:has(.settings-param__name:contains("Показать подсказки снова"))', e.body);
    });

    // Удаляем элементы из шапки и бокового меню
    Lampa.Listener.follow('app', (e) => {
      if (e.type === 'ready') {
        // Определяем, является ли устройство мобильным
        const isMobile = Lampa.Platform.screen('mobile');

        // Список элементов для удаления из бокового меню в зависимости от платформы
        const menuElements = isMobile
        ? ['[data-action=filter]', '[data-action=relise]', '[data-action=timetable]', '[data-action=about]', '[data-action=console]'] // Сокращенный список для мобильных
        : ['[data-action=filter]', '[data-action=relise]', '[data-action=timetable]', '.menu__split', '[data-action=settings]', '[data-action=about]', '[data-action=console]']; // Полный список для десктопов
        // Список элементов для удаления из шапки
        const headerElements = ['.head__logo-icon', '.head__logo-halloween', '.head__menu-icon', '.head__title', '.processing', '.open--broadcast', '.open--premium', '.open--feed', '.open--notice', '.notice--icon', '.open--profile', '.full-screen', '.head__split', '.head__time'];

        headerElements.forEach(selector => removeElements(selector));
        menuElements.forEach(selector => removeElements(selector));

        // Скрываем элемент "Клубничка" из верхней панели
        if (!isMobile) {
          const hideSisiButton = (element) => {
            if (element.classList.contains('head__action') && element.classList.contains('open--sisi')) {
              element.style.display = 'none'; // Скрываем элемент
              window.sisiButton = element; // Сохраняем ссылку на элемент
            }
          };

          // Проверяем, есть ли элемент уже в DOM
          const existingElement = document.querySelector('.head__action.open--sisi');
          if (existingElement) {
            hideSisiButton(existingElement);
          }

          // Наблюдаем за изменениями в DOM
          const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
              mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Проверяем, что это элемент
                  hideSisiButton(node);

                  // Если элемент содержит вложенные элементы, проверяем их тоже
                  if (node.querySelector) {
                  const nestedElement = node.querySelector('.head__action.open--sisi');
                    if (nestedElement) {
                      hideSisiButton(nestedElement);
                    }
                  }
                }
              });
            });
          });
          observer.observe(document.body, { childList: true, subtree: true });
        }
      }
    });

    // Отслеживание комбинации клавиш
    const keySequence = [38, 38, 39, 39, 40, 40];
    let keyIndex = 0;
    let lastKeyTime = 0; // Для отслеживания времени между нажатиями

    $(document).on('keydown', function (e) {
      const now = Date.now();

      // Сброс комбинации, если между клавишами прошло больше 2 секунд
      if (now - lastKeyTime > 2000) {
        keyIndex = 0;
      }
      lastKeyTime = now;

      // Проверяем, совпадает ли текущая клавиша с ожидаемой в последовательности
      if (e.keyCode === keySequence[keyIndex]) {
        keyIndex++;

        // Если вся комбинация введена
        if (keyIndex === keySequence.length) {
          keyIndex = 0;

          // Пытаемся найти кнопку "Клубнички" и эмулируем нажатие
          const sisiButton = $('.open--sisi');

          if (sisiButton.length) {
            sisiButton.trigger('hover:enter');
            console.log('Комбинация введена — открываем "Клубничку"!');
          } else {
            console.error('Элемент .open--sisi не найден!');
          }
        }
      } else {
        keyIndex = 0; // Сброс при ошибке
      }
    });

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
            const tmdbUrl = Lampa.Utils.protocol() + `api.themoviedb.org/3/${type}/${item.id}/images?api_key=${apiKey}&language=${Lampa.Storage.get('language')}`;

            $.get(tmdbUrl, function (data) {
                if (data.logos && data.logos[0]) {
                    const filePath = data.logos[0].file_path;
                    if (filePath !== '') {
                        const container = event.card.full().render();
                        let logoImg = '';

                        const imgBase = Lampa.Utils.protocol() + 'image.tmdb.org/t/p/w500';
                        const proxy = Lampa.Utils.protocol() + '212.113.103.137:9118/proxy';
                        const proxySvg = Lampa.Utils.protocol() + '212.113.103.137:9118/proxyimg';

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

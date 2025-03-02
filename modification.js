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
//      'https://cub.red/plugin/tracks', // @CUB thanks.
      'https://idavlaff.github.io/plugins/tracks.js', // @CUB tracks plugin backup
      'https://idavlaff.github.io/plugins/timecode.js', // @LAMPAC thanks. !NB Timecode work only in torrents
      'https://idavlaff.github.io/plugins/beautify.js', // @CUB thanks, !'but pay for a big background, seriously?' Combine 'interface' & 'cardify' plugins => 'beautify'. @BYLAMPA thanks, for fix rating issue on card
      'https://lampame.github.io/main/pubtorr/pubtorr.js', // @LME thanks. Public parsers
      'https://skaz.tv/export.js', //@SKAZ thanks. Bookmarks & History backup plugin
      'https://bwa.to/rc', // @LAMPAC thanks. Online balansers plugin
      'https://bwa.to/re', // @LAMPAC thanks. 18+ plugin
//      'https://ab2024.ru/sisi.js', // @LAMPAC thanks. 18+ balansers plugin. @AB thanks for more stable version of plugin
      'https://idavlaff.github.io/plugins/mult.js' // Add new category "Cartoons"
/*      'https://lampame.github.io/main/nc/nc.js', // @LME thanks. new categories & collection button for 'franchises'
      'https://lampame.github.io/main/its/its.js', // @LME thanks. torrents to Infuse saver (iOS/macOS). !NB 'Save all' need 'shortcut': https://www.icloud.com/shortcuts/406d7f6bdfcf466da153a38dea6bb663
      'https://idavlaff.github.io/lampa-plugins/new4k.js', // Add new category "4K releases"
      'https://idavlaff.github.io/lampa-plugins/doc.js', // Add new category "Documentary"*/
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
        advanced_animation: 'false',
        player_timecode: 'ask',
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
      const params = ['light_version', 'background', 'background_type', 'black_style', 'card_interfice_type', 'card_interfice_poster', 'card_interfice_cover', 'glass_style', 'glass_opacity', 'card_interfice_reactions', 'interface_sound_play', 'interface_sound_level', 'scroll_type', 'card_views_type', 'hide_outside_the_screen', 'player_normalization', 'playlist_next', 'player_timecode', 'player_scale_method', 'player_hls_method', 'player_rewind', 'subtitles_start', 'subtitles_size', 'subtitles_stroke', 'subtitles_backdrop', 'video_quality_default', 'jackett_interview', 'parse_lang', 'parse_timeout', 'parse_in_search', 'torrserver_savedb', 'torrserver_preload', 'cache_images', 'screensaver', 'screensaver_type', 'screensaver_time', 'helper', 'helper--start-again', 'pages_save_total', 'time_offset', 'navigation_type', 'keyboard_type', 'card_quality', 'card_episodes', 'device_name'];
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
        const headerElements = ['.open--notice', '.full-screen', '.head__split', '.head__time'];

        headerElements.forEach(selector => removeElements(selector));
        menuElements.forEach(selector => removeElements(selector));

        // Удаление элементов внутри items-line
        removeElements('.items-line:has(.items-line__head:has(.items-line__title:contains("Показать подсказки снова")))', e.body);

        // Скрываем элемент "Клубничка" из бокового меню
        if (!isMobile) {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
              mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains('menu__item')) {
                  const menuText = node.querySelector('.menu__text');
                  if (menuText && menuText.textContent === 'Клубничка') {
                    node.style.display = 'none';
                    window.strawberryButton = node;
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

    $(document).on('keydown', function (e) {
      if (e.keyCode === keySequence[keyIndex]) {
        keyIndex++;
        if (keyIndex === keySequence.length) {
          keyIndex = 0;
          if (window.strawberryButton) {
            const strawberryButton = window.strawberryButton;
            strawberryButton.style.display = (strawberryButton.style.display === 'none') ? '' : 'none';
            console.log(strawberryButton.style.display === 'none' ? 'Элемент "Клубничка" снова скрыт!' : 'Элемент "Клубничка" теперь видим!');
          }
        }
      } else {
        keyIndex = 0;
      }
    });
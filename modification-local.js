    // Добавляем плагины
    const plugins = [
      './plugins/tmdb.js', // @ROOTU thanks. TMDB Proxy v1.1.1
//      './plugins/tracks.js', // @CUB tracks plugin
//      './plugins/beautify.js', // @CUB thanks, !'but pay for a big background, seriously?' Combine 'interface' & 'cardify' plugins => 'beautify'. @BYLAMPA thanks, for fix rating issue on card
      './plugins/logo.js', // @ELENATV1 thanks. Movie & TV Show logo add. (#fix)
//      'https://lampaplugins.github.io/store/logo.js', // @ELENATV1 thanks. Movie & TV Show logo add.
      'https://skaz.tv/export.js', //@SKAZ thanks. Bookmarks & History backup plugin
//      'https://skaztv.online/export.js', //@SKAZ thanks. Bookmarks & History backup plugin
//      'https://bwa.to/rc', // @LAMPAC thanks. Online balansers plugin
      'https://bwa.to/re' // @LAMPAC thanks. 18+ plugin
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
    }, 1000);

    function startSet() {
      const settings = {
        set: 'true',
        language: 'ru',
        interface_size: 'small',
        background: 'false',
        black_style: 'true',
        glass_style: 'false',
        advanced_animation: 'false',
        card_views_type: 'preload',
        player_timecode: 'continue',
        video_quality_default: '2160',
        parser_use: 'true',
        parser_torrent_type: 'jackett',
        jackett_url: 'jacred.xyz',
        jackett_interview: 'all',
        tmdb_lang: 'ru',
        poster_size: 'w300',
        proxy_tmdb_auto: 'true',
        proxy_tmdb: 'true',
        source: 'tmdb',
        protocol: 'http',
        screensaver_time: '10',
        helper: 'false',
        pages_save_total: '1',
        cache_images: 'true',
        keyboard_type: 'integrate',
        sisi_preview: 'false',
        torrents_filter: JSON.stringify({
            quality: ['4k', '1080p']
        })
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
        const headerElements = ['.head__logo-icon', '.head__logo-halloween', '.head__menu-icon', '.head__title', '.processing', '.open--broadcast', '.open--premium', '.open--notice', '.notice--icon', '.open--profile', '.full-screen', '.head__split', '.head__time'];

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
// Добавляем плагины
const plugins = [
//	'https://plugin.rootu.top/tmdb.js', // @ROOTU thanks. TMDB Proxy v1.1.1
	'https://idavlaff.github.io/plugins/tracks', // @CUB thanks for all of your work
	'https://idavlaff.github.io/plugins/beautify.js', // @CUB thanks, !'but pay for a big background, seriously?' Combine 'interface' & 'cardify' plugins => 'beautify'. @BYLAMPA thanks, for fix rating issue on card
	'https://idavlaff.github.io/plugins/timecode.js', // @LAMPAC thanks. !NB Timecode work only in torrents
	'https://lampame.github.io/main/pubtorr/pubtorr.js', // @LME thanks. Public parsers
	'https://skaz.tv/export.js', //@SKAZ thanks. Bookmarks & History backup plugin
	'https://bwa.ro/rc', // @LAMPAC thanks. Online balansers plugin
	'https://ab2024.ru/sisi.js', // @LAMPAC thanks. 18+ balansers plugin. @AB thanks for more stable version of plugin
	'https://idavlaff.github.io/plugins/mult.js' // Add new category "Cartoons"
/*	'https://lampame.github.io/main/nc/nc.js', // @LME thanks. new categories & collection button for 'franchises'
	'https://lampame.github.io/main/its/its.js', // @LME thanks. torrents to Infuse saver (iOS/macOS). !NB 'Save all' need 'shortcut': https://www.icloud.com/shortcuts/406d7f6bdfcf466da153a38dea6bb663
	'https://idavlaff.github.io/lampa-plugins/new4k.js', // Add new category "4K releases"
	'https://idavlaff.github.io/lampa-plugins/doc.js', // Add new category "Documentary"*/
];

Lampa.Utils.putScriptAsync(plugins, function () {});

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
//		cub_domain: 'standby.cub.red',
        interface_size: 'small',
        advanced_animation: 'false',
        player_timecode: 'ask',
        video_quality_default: '2160',
        tmdb_lang: 'ru',
        poster_size: 'w500',
        parser_use: 'true',
        lme_url_two: 'jacred_xyz',
        source: 'cub',
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
	const components = ['account', 'player', 'server', 'tmdb', 'plugins', 'parental_control', 'sisi'];
	const params = ['light_version', 'background', 'background_type', 'black_style', 'card_interfice_type', 'card_interfice_poster', 'card_interfice_cover', 'glass_style', 'glass_opacity', 'card_interfice_reactions', 'interface_sound_play', 'interface_sound_level', 'scroll_type', 'card_views_type', 'hide_outside_the_screen', 'jackett_interview', 'parse_lang', 'parse_timeout', 'parse_in_search', 'cache_images', 'screensaver', 'screensaver_type', 'screensaver_time', 'helper', 'helper--start-again', 'pages_save_total', 'time_offset', 'navigation_type', 'keyboard_type', 'card_quality', 'card_episodes', 'device_name'];
	const titles = ['Фон', 'Карточка', 'Стекло', 'Системные звуки', 'Скринсейвер', 'Подсказки', 'Еще'];

	removeElements(components.map(c => `[data-component="${c}"]`).join(','), e.body);
	removeElements(params.map(p => `[data-name="${p}"]`).join(','), e.body);
	titles.forEach(text => removeElements(`.settings-param-title:has(span:contains("${text}"))`, e.body));
	removeElements('.settings-param:has(.settings-param__name:contains("Показать подсказки снова"))', e.body);
});

// Удаляем элементы из шапки и бокового меню
Lampa.Listener.follow('app', (e) => {
	if (e.type === 'ready') {
		const headerElements = ['open--premium', 'open--feed', '.open--notice', '.full-screen', '.head__split', '.head__time'];
		const menuElements = ['[data-action="feed"]', '[data-action="myperson"]', '[data-action=filter]', '[data-action=relise]', '[data-action="subscribes"]', '[data-action=timetable]', '.menu__split', '[data-action=settings]', '[data-action=about]', '[data-action=console]'];

		headerElements.forEach(selector => removeElements(selector));
		menuElements.forEach(selector => removeElements(selector));
	}
});

// Скрываем элемент "Клубничка" из бокового меню
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
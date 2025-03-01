(function () {
    'use strict';

    // Конфигурация плагина
    const PLUGIN_NAME = 'github_gist_sync';
    const GITHUB_API_URL = 'https://api.github.com/gists';
    const GITHUB_TOKEN = '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'; // Замените на ваш токен GitHub

    // Функция для получения данных из Lampa
    function getData() {
        return {
            history: Lampa.Storage.get('history') || [],
            favorites: Lampa.Storage.get('favorites') || []
        };
    }

    // Функция для сохранения данных в Lampa
    function setData(data) {
        if (data.history) Lampa.Storage.set('history', data.history);
        if (data.favorites) Lampa.Storage.set('favorites', data.favorites);
        Lampa.Notify.show('Данные успешно загружены');
    }

    // Функция для экспорта данных в GitHub Gist
    async function exportData() {
        const data = getData();
        const gistData = {
            files: {
                'lampa_data.json': {
                    content: JSON.stringify(data, null, 2)
                }
            },
            public: false // Сделать Gist приватным
        };

        try {
            const response = await fetch(GITHUB_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gistData)
            });

            const result = await response.json();
            if (response.ok) {
                Lampa.Notify.show('Данные успешно экспортированы');
                return result.id; // Возвращает ID Gist
            } else {
                throw new Error(result.message || 'Ошибка при экспорте данных');
            }
        } catch (error) {
            Lampa.Notify.show('Ошибка: ' + error.message);
            console.error(error);
        }
    }

    // Функция для импорта данных из GitHub Gist
    async function importData(gistId) {
        try {
            const response = await fetch(`${GITHUB_API_URL}/${gistId}`, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`
                }
            });

            const result = await response.json();
            if (response.ok) {
                const content = result.files['lampa_data.json'].content;
                const data = JSON.parse(content);
                setData(data);
            } else {
                throw new Error(result.message || 'Ошибка при загрузке данных');
            }
        } catch (error) {
            Lampa.Notify.show('Ошибка: ' + error.message);
            console.error(error);
        }
    }

    // Добавляем плагин в интерфейс Lampa
    function startPlugin() {
        Lampa.UI.addComponent({
            component: PLUGIN_NAME,
            icon: 'icon.png',
            name: 'Синхронизация через GitHub Gist'
        });

        // Кнопка экспорта
        Lampa.UI.addParam({
            component: PLUGIN_NAME,
            param: {
                name: 'Экспорт данных',
                type: 'button',
                values: '',
                default: ''
            },
            field: {
                name: 'Экспорт',
                description: 'Экспорт истории и закладок в GitHub Gist'
            },
            onChange: async function () {
                const gistId = await exportData();
                if (gistId) {
                    Lampa.Notify.show(`Gist ID: ${gistId}`);
                }
            }
        });

        // Поле для импорта
        Lampa.UI.addParam({
            component: PLUGIN_NAME,
            param: {
                name: 'Импорт данных',
                type: 'input',
                placeholder: 'Введите Gist ID',
                values: '',
                default: ''
            },
            field: {
                name: 'Импорт',
                description: 'Импорт истории и закладок из GitHub Gist'
            },
            onChange: function (value) {
                if (value) {
                    importData(value);
                }
            }
        });

        // Устанавливаем флаг, что плагин запущен
        window.github_gist_sync_initialized = true;
    }

    // Запускаем плагин, если он еще не инициализирован
    if (!window.github_gist_sync_initialized) {
        startPlugin();
    }
})();
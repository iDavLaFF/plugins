(function () {
    'use strict';

    const GIST_FILENAME = "lampa_backup.json"; // Файл, где хранятся данные
    const API_URL = "https://api.github.com/gists"; // URL GitHub Gist API
    const GITHUB_TOKEN = "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"; // Вставь сюда свой токен

    function exportData() {
        let favorite = Lampa.Storage.get('favorite') || {};
        let history = Lampa.Storage.get('history') || {};

        let backupData = {
            favorite: favorite,
            history: history
        };

        let gistPayload = {
            description: "Lampa Backup",
            public: false, // Приватный Gist
            files: {
                [GIST_FILENAME]: {
                    content: JSON.stringify(backupData, null, 2)
                }
            }
        };

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `token ${GITHUB_TOKEN}`, // Добавляем токен
                "User-Agent": "Lampa-Backup" // GitHub требует User-Agent
            },
            body: JSON.stringify(gistPayload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                Lampa.Storage.set("gist_id", data.id);
                Lampa.Noty.show("✅ Резервная копия создана! Gist ID: " + data.id);
            } else {
                console.error("Ошибка создания Gist", data);
                Lampa.Noty.show("❌ Ошибка создания Gist");
            }
        })
        .catch(error => {
            console.error("Ошибка:", error);
            Lampa.Noty.show("❌ Ошибка сети");
        });
    }

    function importData(gistId) {
        if (!gistId) {
            Lampa.Noty.show("⚠️ Введите Gist ID для загрузки данных!");
            return;
        }

        fetch(`${API_URL}/${gistId}`)
        .then(response => response.json())
        .then(data => {
            if (data.files[GIST_FILENAME]) {
                let backupData = JSON.parse(data.files[GIST_FILENAME].content);

                Lampa.Storage.set('favorite', backupData.favorite || {});
                Lampa.Storage.set('history', backupData.history || {});

                Lampa.Noty.show("✅ Данные успешно загружены!");
            } else {
                Lampa.Noty.show("❌ Ошибка: файл данных не найден в Gist");
            }
        })
        .catch(error => {
            console.error("Ошибка:", error);
            Lampa.Noty.show("❌ Ошибка загрузки Gist");
        });
    }

    function setupUI() {
        Lampa.SettingsApi.addComponent({
            component: "gist_sync",
            name: "Синхронизация через GitHub Gist",
            icon: "🔄"
        });

        Lampa.SettingsApi.addParam({
            component: "gist_sync",
            param: {
                name: "export",
                type: "button",
                values: "",
                default: ""
            },
            field: {
                name: "Экспорт данных",
                description: "Сохранить избранное и историю в Gist"
            },
            onChange: () => exportData()
        });

        Lampa.SettingsApi.addParam({
            component: "gist_sync",
            param: {
                name: "gist_id",
                type: "string",
                values: "",
                default: ""
            },
            field: {
                name: "Gist ID",
                description: "Введите ID для загрузки данных"
            },
            onChange: (value) => importData(value)
        });
    }

    if (!window.gistSyncLoaded) {
        setupUI();
        window.gistSyncLoaded = true;
    }
})();

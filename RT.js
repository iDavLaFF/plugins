(function () {
    'use strict';

        // Add ratings listener
        Lampa.Listener.follow("full", function (e) {
            var cardData = e.object;
            if (e.type == "complite") {
                var settings = {
                    url: "https://api.mdblist.com/tmdb/".concat(cardData.method == 'tv' ? 'show' : cardData.method, "/").concat(cardData.id, "?apikey=7vl42a1fn8uv03qk78ffz7rce"),
//                    url: `https://api.mdblist.com/tmdb/${cardData.method == 'tv' ? 'show' : cardData.method}/${cardData.id}?apikey=7vl42a1fn8uv03qk78ffz7rce`,
                    method: "GET",
                    timeout: 0
                };
                $.ajax(settings).done(function (response) {
                    var ratings = response.ratings;
                        if (ratings) {
                            // Фильтруем только рейтинг "tomatoes"
                            var tomatoRating = ratings.find(function (rating) {
                                return rating.source === 'tomatoes' && rating.value !== null;
                            });

                        if (tomatoRating && parseFloat(tomatoRating.value) > 0) {
                            html.find('.rate--rt').removeClass('hide').find('> div').eq(0).text(parseFloat(tomatoRating.value) >= 100 ? 100 : Math.round(tomatoRating.value) + '% 🍅');
                        }
                    }
                });
            }
        });

})();
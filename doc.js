(function () {
  'use strict';

  function add() {
    var button = $('<li class="menu__item selector" data-action="doc"></li>');
    var icon = $('<div class="menu__ico"></div>');
    var svg = $('<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><g data-name="Layer 2" id="Layer_2"> <g data-name="E425, History, log, manuscript" id="E425_History_log_manuscript"> <path class="cls-1" d="M75.11,117h0A21.34,21.34,0,0,1,53.83,95.57V31.39A21.34,21.34,0,0,1,75.11,10h0A21.34,21.34,0,0,1,96.39,31.39V95.57A21.34,21.34,0,0,1,75.11,117Z"></path> <rect class="cls-1" height="64.17" width="319.22" x="96.39" y="31.39"></rect> <rect class="cls-1" height="320.87" width="319.22" x="96.39" y="95.57"></rect> <path class="cls-1" d="M34.34,39.08H53.83a0,0,0,0,1,0,0v48.8a0,0,0,0,1,0,0H34.34A24.34,24.34,0,0,1,10,63.54v-.13A24.34,24.34,0,0,1,34.34,39.08Z"></path> <path class="cls-1" d="M436.89,117h0a21.34,21.34,0,0,0,21.28-21.39V31.39A21.34,21.34,0,0,0,436.89,10h0a21.34,21.34,0,0,0-21.28,21.39V95.57A21.34,21.34,0,0,0,436.89,117Z"></path> <path class="cls-1" d="M482.51,39.08H502a0,0,0,0,1,0,0v48.8a0,0,0,0,1,0,0H482.51a24.34,24.34,0,0,1-24.34-24.34v-.13a24.34,24.34,0,0,1,24.34-24.34Z" transform="translate(960.17 126.96) rotate(-180)"></path> <path class="cls-1" d="M75.11,395h0a21.34,21.34,0,0,0-21.28,21.39v64.18A21.34,21.34,0,0,0,75.11,502h0a21.34,21.34,0,0,0,21.28-21.39V416.43A21.34,21.34,0,0,0,75.11,395Z"></path> <rect class="cls-1" height="64.17" width="319.22" x="96.39" y="416.43"></rect> <path class="cls-1" d="M34.34,424.12H53.83a0,0,0,0,1,0,0v48.8a0,0,0,0,1,0,0H34.34A24.34,24.34,0,0,1,10,448.58v-.13A24.34,24.34,0,0,1,34.34,424.12Z"></path> <path class="cls-1" d="M436.89,395h0a21.34,21.34,0,0,1,21.28,21.39v64.18A21.34,21.34,0,0,1,436.89,502h0a21.34,21.34,0,0,1-21.28-21.39V416.43A21.34,21.34,0,0,1,436.89,395Z"></path> <path class="cls-1" d="M482.51,424.12H502a0,0,0,0,1,0,0v48.8a0,0,0,0,1,0,0H482.51a24.34,24.34,0,0,1-24.34-24.34v-.13a24.34,24.34,0,0,1,24.34-24.34Z" transform="translate(960.17 897.04) rotate(-180)"></path> <line class="cls-1" x1="143.41" x2="256" y1="140.11" y2="140.11"></line> <line class="cls-1" x1="143.41" x2="371.26" y1="186.47" y2="186.47"></line> <line class="cls-1" x1="143.41" x2="371.26" y1="232.82" y2="232.82"></line> <line class="cls-1" x1="143.41" x2="371.26" y1="279.18" y2="279.18"></line> <line class="cls-1" x1="143.41" x2="371.26" y1="325.53" y2="325.53"></line> <line class="cls-1" x1="256" x2="371.26" y1="371.89" y2="371.89"></line> </g> </g> </g></svg>');
    var text = $('<div class="menu__text">Документальное</div>');

    icon.append(svg);
    button.append(icon);
    button.append(text);

    button.on('hover:enter', function () {
      Lampa.Activity.push({
        url: '',
        title: 'Документальное - CUB',
        component: 'category',
        genres: 99,
        id: 99,
        source: 'cub',
        card_type: true,
        page: 1
      });
    });
      $('.menu .menu__list').eq(0).append(button);
    setTimeout(function () {
      $('[data-action=doc]').insertAfter($('[data-action=movie]'));
    }, 2000);
  }

  if (window.appready) add();
    else {
      Lampa.Listener.follow('app', function (event) {
      if (event.type == 'ready') {
        add();
      }
      });
    }
})();

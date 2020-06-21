'use strict';
(function () {
  var URL_GET = 'https://javascript.pages.academy/keksobooking/data';
  var STATUS_SUCCES = 200;
  var TIMEOUT = 10000;

  // Функция, получающая данные с сервера
  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCES) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT; // 10 секунд

    xhr.open('GET', URL_GET);
    xhr.send();
  };

  window.backend = {
    load: load
  };
})();

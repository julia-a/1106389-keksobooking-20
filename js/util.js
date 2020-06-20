'use strict';
(function () {
  // Вспомогательная функция, возвращающая случайный элемент из массива
  var getRandomValueFromArr = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // Вспомогательная функция, возвращающая случайное число из заданного диапазона
  var getRandomValueFromRange = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // Вспомогательная функция, создающая массив строк
  var getRandomStringsFromArr = function (arr, min, max) {
    var newStringsArr = arr.slice();
    newStringsArr.length = getRandomValueFromRange(min, max);
    return newStringsArr;
  };

  window.util = {
    getRandomValueFromArr: getRandomValueFromArr,
    getRandomValueFromRange: getRandomValueFromRange,
    getRandomStringsFromArr: getRandomStringsFromArr
  };
})();

'use strict';
(function () {
  window.util = {
    getRandomAvatar = function (index) {
      return 'img/avatars/user0' + (index + 1) + '.png';
    },
    translateTypeOfPlace = function (englishType) {
      var translate = {
        palace: 'Дворец',
        flat: 'Квартира',
        house: 'Дом',
        bungalo: 'Бунгало'
      };
      return translate[englishType];
    },
    getRandomValueFromArr = function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    getRandomValueFromRange = function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    getRandomStringsArr = function (arr, min, max) {
      var newStringsArr = arr.slice();
      newStringsArr.length = getRandomValueFromRange(min, max);
      return newStringsArr;
    }
  };
})();

'use strict';
(function () {
  var Key = {
    ENTER: 'Enter',
    MOUSE_LEFT: 1,
    ESCAPE: 'Escape'
  };

  var toggleDisabled = function (elements, value) {
    elements.forEach(function (element) {
      element.disabled = value;
    });
  };

  window.data = {
    enter: Key.ENTER,
    escape: Key.ESCAPE,
    keyMouseLeft: Key.MOUSE_LEFT,
    toggleDisabled:toggleDisabled
  };
})();

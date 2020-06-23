 // mapPinMainElement тот элемент, за который тащим и обработаем событие начала перетаскивания метки mousedown
 mapPinMainElement.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  // запомним координаты точки начала движения
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var dragged = false;
  // При каждом движении мыши нам нужно обновлять смещение относительно
  // первоначальной точки, чтобы диалог смещался на необходимую величину.
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    dragged = true;

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    mapPinMainElement.style.top = (mapPinMainElement.offsetTop - shift.y) + 'px';
    mapPinMainElement.style.left = (mapPinMainElement.offsetLeft - shift.x) + 'px';

    // устанавливаем границы для перетаскивания метки по карте
    mapPinMainElement.style.left = setBorders(MIN.X, MAX.X, parseInt(mapPinMainElement.style.left, 10));
    mapPinMainElement.style.top = setBorders(MIN.Y, MAX.Y, parseInt(mapPinMainElement.style.top, 10));

    var left = mapPinMainElement.offsetLeft - shift.x;
    if (left > MAX.X) {
      left = MAX.X;
    } else if (left <= MIN.X) {
      left = MIN.X;
    }

    var top = mapPinMainElement.offsetTop - shift.y;
    if (top > MAX.Y) {
      top = MAX.Y;
    } else if (top <= MIN.Y) {
      top = MIN.Y;
    }
    var newCoordsX = left + MAIN_PIN_SIZE / 2;
    var newCoordsY = top + (MAIN_PIN_SIZE + MAIN_PIN_ARROW);

    // считаем координаты пина с учетом острой стрелочки
    var calcCoordsByArrow = function () {
      window.form.inputAddressElement.value = Math.floor(newCoordsX) + ', ' + Math.floor(newCoordsY);
    };
    calcCoordsByArrow(startCoords.x, startCoords.y);
  };

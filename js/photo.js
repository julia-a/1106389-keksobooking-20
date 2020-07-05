'use strict';
(function () {
  var DEFAULT_SRC_AVATAR = 'img/muffin-grey.svg';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarChooser = document.querySelector('.ad-form-header__input');
  var previewAvatar = document.querySelector('.ad-form-header__preview img');
  var photoChooser = document.querySelector('.ad-form__input');
  var previewPhoto = document.querySelector('.ad-form__photo');

  avatarChooser.addEventListener('change', function () {
    var file = avatarChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewAvatar.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  photoChooser.addEventListener('change', function () {
    var file = photoChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var photo = document.createElement('img');
        photo.setAttribute('width', '70px');
        photo.setAttribute('height', '70px');
        photo.src = reader.result;
        previewPhoto.appendChild(photo);
      });
      reader.readAsDataURL(file);
    }
  });

  var removeImages = function () {
    previewAvatar.src = DEFAULT_SRC_AVATAR;
    previewPhoto.textContent = '';
  };

  window.photo = {
    removeImages: removeImages
  };
})();

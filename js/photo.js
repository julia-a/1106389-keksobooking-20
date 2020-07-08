'use strict';
(function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png'];
  var DEFAULT_AVATAR = 'img/muffin-grey.svg';
  var avatarLoader = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoLoader = document.querySelector('#images');
  var photoContainer = document.querySelector('.ad-form__photo-container');
  var firstPhotoWrapper = document.querySelector('.ad-form__photo');

  var Photo = {
    WIDTH: '70px',
    HEIGHT: '70px'
  };

  var onAvatarChange = function (evt) {
    loadImage(evt.target, changeAvatar);
  };

  var onPhotoChange = function (evt) {
    loadImage(evt.target, addPhoto);
  };

  var changeAvatar = function (avatar) {
    avatarPreview.src = avatar;
  };

  var createPhoto = function (photo) {
    var newPhoto = document.createElement('img');
    newPhoto.src = photo;
    newPhoto.style.width = Photo.WIDTH;
    newPhoto.style.height = Photo.HEIGHT;
    newPhoto.alt = 'Фотография жилья';
    return newPhoto;
  };

  var addPhoto = function (photo) {
    if (firstPhotoWrapper.querySelector('img')) {
      var newPhotoWrapper = document.createElement('div');
      newPhotoWrapper.classList.add('ad-form__photo');
      newPhotoWrapper.classList.add('ad-form__photo--added');
      newPhotoWrapper.appendChild(createPhoto(photo));
      photoContainer.appendChild(newPhotoWrapper);
    } else {
      firstPhotoWrapper.appendChild(createPhoto(photo));
    }
  };

  var loadImage = function (imageLoader, addImage) {
    var imageFiles = Array.from(imageLoader.files);
    if (imageFiles) {
      imageFiles.forEach(function (file) {
        var imageFileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (type) {
          return imageFileName.endsWith(type);
        });
        if (matches) {
          var reader = new FileReader();
          reader.addEventListener('load', function (evt) {
            addImage(evt.target.result);
          });
          reader.readAsDataURL(file);
        }
      });
    }
  };

  var cleanImages = function () {
    avatarPreview.src = DEFAULT_AVATAR;
    var addedPhotos = document.querySelectorAll('.ad-form__photo--added');
    if (addedPhotos) {
      addedPhotos.forEach(function (photo) {
        photo.remove();
      });
      firstPhotoWrapper.innerHTML = '';
    }
  };

  var changeImages = function () {
    avatarLoader.addEventListener('change', onAvatarChange);
    photoLoader.addEventListener('change', onPhotoChange);
  };

  var removeImages = function () {
    avatarLoader.removeEventListener('change', onAvatarChange);
    photoLoader.removeEventListener('change', onPhotoChange);
  };

  window.photo = {
    cleanImages: cleanImages,
    changeImages: changeImages,
    removeImages: removeImages
  };
})();

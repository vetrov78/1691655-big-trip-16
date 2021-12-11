export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend'
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const renderPhotos = (photos) => {
  const htmlFragment = `<div class="event__photos-container">
   <div class="event__photos-tape">`;
  for (photo in photos) {
    htmlFragment = ''
  }
}

import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
export function renderGallery(cards) {
  const galleryList = cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <a class="gallery__item" href="${largeImageURL}">
  <img
    class="gallery-image"
    src="${webformatURL}" 
    alt="${tags}"
    onclick="event.preventDefault()"
    loading="lazy"
  /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`,
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', galleryList);

  const lightbox = new SimpleLightbox('.gallery a');

  lightbox.refresh();

  const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

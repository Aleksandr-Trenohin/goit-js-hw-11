import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

// Add imports above this line
import { galleryItems } from './gallery-items';
// Change code below this line

console.log(galleryItems);

const galleryEl = document.querySelector('.gallery');

const galleryList = galleryItems
  .map(
    item => `<a class="gallery__item" href="${item.original}">
    <img
      class="gallery__image"
      src="${item.preview}"      
      alt="${item.description}"
      onclick="event.preventDefault()"
    />
 </a >`,
  )
  .join('');

galleryEl.innerHTML = galleryList;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

import './sass/main.scss';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import { fetchImages } from './js/api';
import { renderGallery } from './js/render-gallery';
import { trackScroll } from './js/track-scroll';

let searchQuery = '';
let page;
const pageSize = 40;

const formEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
loadMoreBtnEl.classList.add('is-hidden');

formEl.addEventListener('submit', onSearchFormSubmit);
function onSearchFormSubmit(event) {
  event.preventDefault();
  // galleryEl.innerHTML = '';
  document.querySelector('.gallery').innerHTML = '';
  loadMoreBtnEl.classList.add('is-hidden');

  searchQuery = event.target.searchQuery.value;

  page = 1;

  if (searchQuery) {
    fetchImages(searchQuery, page)
      .then(recievedHits => {
        const hitsAmount = recievedHits.totalHits;

        if (hitsAmount !== 0) {
          Notiflix.Notify.success(`Hooray! We found ${hitsAmount} images.`);

          renderGallery(recievedHits.hits);

          if (hitsAmount > pageSize) {
            loadMoreBtnEl.classList.remove('is-hidden');
          }
        } else {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  page += 1;

  formEl.reset();
}

loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
function onLoadMoreBtnClick() {
  fetchImages(searchQuery, page).then(recievedHits => {
    const hitsAmount = recievedHits.totalHits;
    const totalPage = hitsAmount / pageSize;

    renderGallery(recievedHits.hits);

    page += 1;

    if (page > totalPage) {
      loadMoreBtnEl.classList.add('is-hidden');

      window.addEventListener('scroll', debounce(trackScroll, 300));
    }
  });
}

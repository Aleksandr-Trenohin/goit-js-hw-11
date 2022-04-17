import './sass/main.scss';
import axios, { Axios } from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';

let searchQuery = '';
let page;
const pageSize = 40;

let windowHeight = document.documentElement.clientHeight;

//? const refs = {
//     form: document.querySelector('#search-form'),
//     loadMoreBtn: document.querySelector('.load-more'),
// }
const formEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
loadMoreBtnEl.classList.add('is-hidden');

//? const onBtnClick = (event) => {
//     event.preventDefault();
//     console.log(event.currentTarget.searchQuery.value);
// }
formEl.addEventListener('submit', onSearchFormSubmit);
function onSearchFormSubmit(event) {
  event.preventDefault();
  galleryEl.innerHTML = '';
  loadMoreBtnEl.classList.add('is-hidden');

  searchQuery = event.target.searchQuery.value;

  page = 1;

  if (searchQuery) {
    fetchImages(searchQuery, page)
      .then(recievedHits => {
        //? const hitsAmount = recievedHits.data.totalHits;  (axios/fetch)
        const hitsAmount = recievedHits.totalHits;

        if (hitsAmount !== 0) {
          Notiflix.Notify.success(`Hooray! We found ${hitsAmount} images.`);
          //? renderGallery(recievedHits.data.hits);  (axios/fetch)
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
        // Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
  page += 1;

  formEl.reset();
}

const MY_KEY = '26745683-ec5771c1b459334d80ff30e1d';
axios.defaults.baseURL = 'https://pixabay.com/api';
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
// ? VERSION 1 with async/await foo
async function fetchImages(searchTerm, page) {
  const { data } = await axios.get(
    `/?key=${MY_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${pageSize}`,
  );
  return data;
}
// ? VERSION 2 with axios libs (fetch)
// function fetchImages(searchTerm, page) {
//   return axios.get(
//     `/?key=${MY_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${pageSize}`,
//   );
// }
// * VERSION 2 with axios libs
// axios.defaults.baseURL = 'https://restcountries.com/v3.1';
// axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
// function fetchCountries(countryName) {
//   return axios.get(`/name/${countryName}?fields=name,capital,languages`);
// }
// * VERSION 3 simle with fetch
// const BASE_URL = 'https://restcountries.com/v3.1';
// function fetchCountries(countryName) {
//   const url = `${BASE_URL}/name/${countryName}?fields=name,capital,population,flags,languages`;
//   return fetch(url).then(response => {
//     if (!response.ok) {
//       throw new Error(`Error: ${response.statusText}`);
//     }
//     return response.json();
//   });
// }

const galleryEl = document.querySelector('.gallery');
function renderGallery(cards) {
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

function trackScroll() {
  let scroll = galleryEl.scrollHeight;
  let top = document.documentElement.getBoundingClientRect().top;
  let isOut = windowHeight - top;

  if (isOut > scroll) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
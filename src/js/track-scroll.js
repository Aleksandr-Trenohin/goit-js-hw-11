import Notiflix from 'notiflix';

let windowHeight = document.documentElement.clientHeight;

export function trackScroll() {
 
  let scroll = document.querySelector('.gallery').scrollHeight;
  let top = document.documentElement.getBoundingClientRect().top;
  let isOut = windowHeight - top;

  if (isOut > scroll) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

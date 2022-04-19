import axios, { Axios } from 'axios';

const PAGE_SIZE = 40;

const MY_KEY = '26745683-ec5771c1b459334d80ff30e1d';
axios.defaults.baseURL = 'https://pixabay.com/api';
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

export async function fetchImages(searchTerm, page) {
  const { data } = await axios.get(
    `/?key=${MY_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PAGE_SIZE}`,
  );
  return data;
}

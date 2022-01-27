'use strict';
import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '25405867-bdb8a9d921cbc250fb0edc875';
  OPTIONS = '&image_type=photo&orientation=horizontal&safesearch=true';

  constructor(keyword = null) {
    this.page = 1;
    this.keyword = keyword;
    this.per_page = 40;
  }

  fetchPhotos() {
    return axios.get(
      ` ${this.#BASE_URL}?key=${this.#API_KEY}&q=${this.keyword}${this.OPTIONS}&page=${
        this.page
      }&per_page=${this.per_page}`,
    );
  }
}

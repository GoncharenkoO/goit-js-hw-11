'use strict';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayAPI } from './pixabay-api';
import galleryCardsTemplate from '../templates/gallery-card.hbs';

const searchFormEl = document.querySelector('.js-search-form');
const galleryListEl = document.querySelector('.js-gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more');

const pixabayApi = new PixabayAPI();

searchFormEl.addEventListener('submit', async event => {
  try {
    event.preventDefault();

    const keyword = event.currentTarget.elements['searchQuery'].value;

    if (keyword.trim() === '') {
      alertNoImagesFound();
      return;
    }

    pixabayApi.keyword = keyword;
    pixabayApi.page = 1;

    galleryListEl.innerHTML = '';

    const { data } = await pixabayApi.fetchPhotos();

    if (data.hits.length === 0) {
      loadMoreBtnEl.classList.add('is-hidden');
      alertNoImagesFound();
      return;
    }

    if (data.hits.total_pages === 1) {
      galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    }

    galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
    let lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 }).refresh();
    alertImagesFound(data.totalHits);
    lightbox;

    galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
    loadMoreBtnEl.classList.remove('is-hidden');
  } catch (err) {
    console.log(err);
  }
});

loadMoreBtnEl.addEventListener('click', async event => {
  try {
    pixabayApi.page += 1;

    const { data } = await pixabayApi.fetchPhotos();

    if (data.hits.length === 0) {
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    }

    if (data.totalHits <= pixabayApi.page * pixabayApi.per_page) {
      galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
      loadMoreBtnEl.classList.add('is-hidden');
      alertEndOfSearch();
      return;
    }

    galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
    loadMoreBtnEl.classList.remove('is-hidden');

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    console.log(err);
  }
});

function alertNoImagesFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function alertImagesFound(total) {
  Notiflix.Notify.success(`Hooray! We found ${total} images.`);
}

function alertEndOfSearch() {
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
}

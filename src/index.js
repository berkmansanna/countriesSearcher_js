import './css/styles.css';

import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('[type="text"]');
const countriesListEl = document.querySelector('.country-list');
const countriesConteinerEl = document.querySelector('.country-info');

const onInputChange = e => {
  onEmptyInput();
  if (e.target.value.trim() != '') {
    fetchCountries(e.target.value.trim())
      .then(renderHTML)
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        console.log(error);
      });
  }
};

const onEmptyInput = () => {
  countriesListEl.innerHTML = '';
  countriesConteinerEl.innerHTML = '';
};

const renderHTML = nameCountries => {
  if (nameCountries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (nameCountries.length >= 2 && nameCountries.length <= 10) {
    renderCountriesList(nameCountries);
  } else if (nameCountries.length === 1) {
    renderCountryCard(nameCountries);
  }
};

function renderCountriesList(countriesArr) {
  const markup = countriesArr
    .map(({ flags, name }) => {
      return `<li class="country-item">
        <img class="country-flag" src="${flags.svg}" width="50px">
        <p class="country-text">${name.official}</p>
        </li>`;
    })
    .join('');
  countriesListEl.insertAdjacentHTML('beforeend', markup);
}

function renderCountryCard(nameCountries) {
  const markup = nameCountries
    .map(({ flags, name, capital, population, languages }) => {
      return `<div class="country-thumb"><img src="${flags.svg}" width="100px">
        <p class="country-name">${name.official}<p></div>
        <p><span class="bold-text">Capital:</span> ${capital}</p>
        <p><span class="bold-text">Population:</span> ${population}</p>
        <p><span class="bold-text">Languages:</span> ${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
  countriesConteinerEl.insertAdjacentHTML('beforeend', markup);
}

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

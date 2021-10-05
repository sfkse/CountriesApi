'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)} people</p>
        <p class="country__row"><span>🗣️</span>${data.languages[Object.keys(data.languages)[0]]}</p>
        <p class="country__row"><span>💰</span>${Object.keys(data.currencies)[0]}</p>
      </div>
    </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};
const renderError = function (msg) {

  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1
}

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`)
    return response.json()
  })
}

const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0])
      const neighbour = data[0].borders[0].toLowerCase();
      if (!neighbour) throw new Error('No neighbour found');

      return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`, 'Negihbour not found')
    })
    .then(data => renderCountry(data[0], "neighbour"))
    .catch(err => renderError(`There is a problem: ${err.message}`))
    .finally(() =>
      countriesContainer.style.opacity = 1
    )
}

btn.addEventListener('click', function () {
  getCountryData('germany')
})


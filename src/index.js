/* eslint-disable no-alert */
import './assets/global.scss';
import weatherInfoView from './views/weatherInfoView';
import loaderView from './views/loaderView';
import forecastView from './views/forecastView';
import dayLengthView from './views/dayLengthView';

const state = { unit: 'metric' };
const key = 'c751dd140c912dd0b6a6f02af1f50ee9';
const locationInput = document.querySelector('#location-input');
const body = document.querySelector('body');
const weatherContainer = document.querySelector('#weather-info-container');

const formatDate = (timestamp) => {
  const datesDic = {
    Sun: 'Sunday',
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
  };

  const dateArray = new Date(timestamp * 1000).toDateString().split(' ');
  const weekDay = datesDic[dateArray[0]];
  const day = `${dateArray[1]} ${dateArray[2]}`;
  return [weekDay, day];
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const formatedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  return [date, formatedTime];
};

const formatTemp = (temp) => Math.round(temp);

const formatWindSpeed = (windSpeed) => {
  if (state.unit === 'metric') {
    return `${Math.round(windSpeed * 3.6)} km/h`;
  }
  return `${Math.round(windSpeed)} mph`;
};

const formatDescription = (des) => des[0].toUpperCase() + des.slice(1);

const calcDayLength = () => {
  const difInMs = (state.day0.sunset[0].getTime() - state.day0.sunrise[0].getTime());
  const hours = Math.floor(difInMs / (1000 * 60 * 60));
  const minutes = Math.round((difInMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}min`;
};

const saveCurrentWeather = (weatherData) => {
  state.location = [weatherData.name, weatherData.sys.country];
  state.day0 = {
    date: formatDate(weatherData.dt),
    description: formatDescription(weatherData.weather[0].description),
    temp: formatTemp(weatherData.main.temp),
    feel: formatTemp(weatherData.main.feels_like),
    wind: formatWindSpeed(weatherData.wind.speed),
    sunrise: formatTime(weatherData.sys.sunrise),
    sunset: formatTime(weatherData.sys.sunset),
    icon: weatherData.weather[0].icon,
  };
};

const saveForecast = (weatherData) => {
  state.forecast = [];
  for (let i = 6, day = 1; i < 40; i += 8, day += 1) {
    state.forecast.push({
      date: formatDate(weatherData.list[i].dt),
      icon: weatherData.list[i].weather[0].icon,
      temp: formatTemp(weatherData.list[i].main.temp),
    });
  }
};

const renderNightSky = () => {
  body.insertAdjacentHTML('afterbegin', "<div id='stars'></div>");
  body.insertAdjacentHTML('afterbegin', "<div id='twinkling'></div>");
};

const renderSkyElement = (element, bgColor = null) => {
  body.insertAdjacentHTML('afterbegin', element);

  if (bgColor) {
    body.style.backgroundColor = bgColor;
  }
};

const clearBackground = () => {
  const bgElementsArray = ['sun', 'clouds', 'rain', 'snow', 'stars', 'twinkling'].map(el => document.querySelector(`#${el}`));
  bgElementsArray.forEach(el => {
    if (el) {
      el.parentElement.removeChild(el);
    }
  });
  body.style.backgroundColor = 'rgba(131, 205, 230, 0.897)';
};

const setBackground = () => {
  clearBackground();

  const c = state.day0.icon;

  if (c === '01d') {
    renderSkyElement("<div id='sun'></div>");
  } else if (c === '01n') {
    renderNightSky();
  } else if (c === '02d' || c === '03d') {
    renderSkyElement("<div id='clouds' class='few-clouds'></div>");
  } else if (c === '02n' || c === '03n') {
    renderSkyElement("<div id='clouds' class='few-clouds'></div>");
    renderNightSky();
  } else if (c === '04d') {
    renderSkyElement("<div id='clouds' class='many-clouds'></div>");
  } else if (c === '04n') {
    renderSkyElement("<div id='clouds' class='many-clouds'></div>", '#000');
  } else if (c === '09d' || c === '10d' || c === '11d') {
    renderSkyElement("<div id='rain'></div>", '#d5d2d2');
  } else if (c === '09n' || c === '10n' || c === '11n') {
    renderSkyElement("<div id='rain'></div>", '#393737');
  } else if (c === '13d') {
    renderSkyElement("<div id='snow'></div>", '#d5d2d2');
  } else if (c === '13n') {
    renderSkyElement("<div id='snow'></div>", '#393737');
  }
};

const renderLoader = () => {
  weatherContainer.insertAdjacentHTML('afterbegin', loaderView);
};

const removeLoader = () => {
  const loader = document.querySelector('#loader');
  weatherContainer.removeChild(loader);
};

// eslint-disable-next-line consistent-return
const makeApiCall = async (location, unit) => {
  try {
    const resultCurrent = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}&units=${unit}`, { mode: 'cors' });
    const resultForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${key}&units=${unit}`, { mode: 'cors' });

    if (resultCurrent.status === 200 && resultForecast.status === 200) {
      saveCurrentWeather(await resultCurrent.json());
      saveForecast(await resultForecast.json());
      return true;
    }
    removeLoader();
    clearBackground();
    alert('Location not found');
    return false;
  } catch (error) {
    alert(error);
  }
};

const toggleBtn = () => {
  if (state.unit === 'imperial') {
    const cBtn = document.querySelector('#c-button');
    const fBtn = document.querySelector('#f-button');

    cBtn.classList.toggle('selected');
    fBtn.classList.toggle('selected');
  }
};

const getForecastView = (forecastDataArray) => {
  const forecastViewArray = forecastDataArray.map(current => forecastView(current));
  return forecastViewArray;
};

const renderForecast = () => {
  const forecastContainer = document.querySelector('#next-days');
  getForecastView(state.forecast).forEach(dayView => {
    forecastContainer.insertAdjacentHTML('beforeend', dayView);
  });
};

const renderDayLength = () => {
  const lengthContainer = document.querySelector('#day-length');
  const dayLength = calcDayLength();
  const view = dayLengthView(dayLength, state.day0.sunrise[1], state.day0.sunset[1]);
  lengthContainer.insertAdjacentHTML('afterbegin', view);
};

const renderWeatherInfo = () => {
  const weatherView = weatherInfoView(state);
  weatherContainer.insertAdjacentHTML('afterbegin', weatherView);
  toggleBtn();
  renderDayLength();
  renderForecast();
  setBackground();
};

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

const clearScreen = () => {
  const weatherInfo = document.querySelector('#weather-info');
  if (weatherInfo) {
    weatherInfo.parentElement.removeChild(weatherInfo);
  }
};

const getWeather = async () => {
  if (locationInput.value) {
    clearScreen();
    renderLoader();
    await sleep(1000);

    const response = await makeApiCall(locationInput.value, state.unit);

    if (response) {
      removeLoader();
      renderWeatherInfo();
    }
  } else {
    alert('Please, insert a location.');
  }
};

body.addEventListener('click', (e) => {
  if (e.target.matches('button')) {
    state.unit = e.target.dataset.unit;
    getWeather();
  }
});

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getWeather();
  }
});
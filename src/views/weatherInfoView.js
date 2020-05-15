const weatherInfoView = (weatherData) => {
  const view = `
    <div id="weather-info">
        <div id="current-weather" class="info-box">
            <div id="intro">
                <h2>${weatherData.location[0]}, ${weatherData.location[1]}</h2>
                <p>${weatherData.day0.date[0]}</p>
                <p>${weatherData.day0.description}</p>
            </div>
            <div id="main">
                <div id="left">
                    <img src="http://openweathermap.org/img/wn/${weatherData.day0.icon}@2x.png">
                    <div id="temp">
                        <h1>${weatherData.day0.temp}</h1>
                        <div id="units-container">
                            <button id="c-button" class="selected" data-unit="metric"> °C </button>
                            | 
                            <button id="f-button" data-unit="imperial"> °F </button>
                        </div>
                    </div>
                </div>
                <div id="right">
                    <p>Fells like: ${weatherData.day0.feel}°</p>
                    <p>Wind: ${weatherData.day0.wind}</p>
                </div>
            </div>
        </div>
        <div id="day-length" class="info-box">

        </div>
        <div id="next-days" class="info-box">
        </div>
    </div>`;

  return view;
};

export default weatherInfoView;
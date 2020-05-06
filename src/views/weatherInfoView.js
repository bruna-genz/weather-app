export const weatherInfoView = (weatherData) => {
    const view = `<div id="weather-info">
        <div id="intro">
            <h2>${weatherData.cityName}</h2>
            <p>Wednesday</p>
            <p>${weatherData.description}</p>
        </div>
        <div id="main">
            <div id="left">
                <img src="">
                <h1>${weatherData.temp}</h1>
                <p>°C | °F</p>
            </div>
            <div id="right">
                <p>Fells like: ${weatherData.feel}°</p>
                <p>Wind: ${weatherData.wind} km/h</p>
            </div>
        </div>
    </div>`
    
    return view
}
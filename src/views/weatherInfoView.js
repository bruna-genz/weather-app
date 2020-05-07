export const weatherInfoView = (weatherData) => {
    const view = `<div id="weather-info">
        <div id="intro">
            <h2>${weatherData.cityName}</h2>
            <p>${weatherData.day0.date}</p>
            <p>${weatherData.day0.description}</p>
        </div>
        <div id="main">
            <div id="left">
                <img src="">
                <h1>${weatherData.day0.temp}</h1>
                <p>°C | °F</p>
            </div>
            <div id="right">
                <p>Fells like: ${weatherData.day0.feel}°</p>
                <p>Wind: ${weatherData.day0.wind} km/h</p>
            </div>
        </div>
        <div id="next-days">

        </div>
    </div>`
    
    return view
}
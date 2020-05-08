export const forecastView = (current) => { 
    return `<div class="forecast-day">
        <div class="left">
            <h4>${current.date[0]}</h4>
            <h5>${current.date[1]}</h5>
        </div>
        <div class="right">
            <img src="http://openweathermap.org/img/wn/${current.icon}@2x.png">
            <p>${current.temp}°</p>
        </div>
    </div>`
}
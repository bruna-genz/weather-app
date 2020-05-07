import "../src/assets/styles.scss";
import { weatherInfoView } from "./views/weatherInfoView"

// Variables
const state = {} // city name, description, coord, temp, feels like, wind speed
const key = "c751dd140c912dd0b6a6f02af1f50ee9"
const locationInput = document.querySelector("#location-input")
const body = document.querySelector("body")

// Data formatting functions
const formatDate = (date) => {
    const datesDic = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    }
    const dayNumber = new Date(date * 1000).getDay()
    return datesDic[dayNumber]
}

const formatTemp = (temp) => {
    return Math.round(temp)
}

const formatWindSpeed = (windSpeed) => {
    if (state.unit == "metric") {
       return `${Math.round(windSpeed * 3.6)} km/h`
    } else {
        return `${Math.round(windSpeed)} mph`
    }
}

const formatDescription = (des) => {
    return des[0].toUpperCase() + des.slice(1)
}

// API calls 
const getWeatherData = async (location, unit) => {

    // API call fot the current weather
    const resultCurrent = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}&units=${unit}`, { mode: 'cors'})
    // API call for next 5 days forecas
    const resultForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${key}&units=${unit}`, { mode: 'cors'})
    
    if (resultCurrent.status == 200 && resultForecast.status == 200) {
        saveCurrentWeather(await resultCurrent.json())
        saveForecast(await resultForecast.json())
        return true
    } else {
        alert("Location not found")
        return false
    }
}

// Sava date into state object
const saveCurrentWeather = (weatherData) => {
    state.cityName = weatherData.name
    state.day0 = {  date: formatDate(weatherData.dt),
                    main: weatherData.weather[0].description.main,
                    description: formatDescription(weatherData.weather[0].description),
                    temp: formatTemp(weatherData.main.temp),
                    feel: formatTemp(weatherData.main.feels_like),
                    wind: formatWindSpeed(weatherData.wind.speed),
                    icon: weatherData.weather[0].icon
                }
}

const saveForecast = (weatherData) => {
    state.forecast = []
    for (let i = 6, day = 1; i < 40; i+=8, day++) {
        state.forecast.push({   date: formatDate(weatherData.list[i].dt),
                                icon: weatherData.list[i].weather[0].icon,
                                temp: formatTemp(weatherData.list[i].main.temp),
                            })
    }
}

// Render views
const renderWeatherInfo = () => {
    const weatherView = weatherInfoView(state)
    body.insertAdjacentHTML("beforeend", weatherView)
    renderForecast()
}

const forecastView = (forecastArray) => {
    const forecastViewArray = forecastArray.map(current => {
        return `<div><p>${current.date}</p><img src="http://openweathermap.org/img/wn/${current.icon}@2x.png"><p>${current.temp}°</p></div>`
    })
    return forecastViewArray
}

const renderForecast = () => {
    const forecastContainer = document.querySelector("#next-days")
    forecastView(state.forecast).forEach( dayView => {
    forecastContainer.insertAdjacentHTML("beforeend", dayView)
    })
}

// Events
body.addEventListener("click", async (e) => {
    if (e.target.matches("button")) {
        state.unit = e.target.dataset.unit
        const response = await getWeatherData(locationInput.value, state.unit)
        
        if (response) {
            body.removeChild(body.children[1])
            renderWeatherInfo()
        }
    }
})
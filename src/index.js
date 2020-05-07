import "../src/assets/styles.scss";
import { weatherInfoView } from "./views/weatherInfoView"

// Variables
const state = {} // city name, description, coord, temp, feels like, wind speed
const key = "c751dd140c912dd0b6a6f02af1f50ee9"
const searchButton = document.querySelector("#search-button")
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
    return Math.round(windSpeed * 3.6)
}

// API calls 
const getCurrentWeather = async (location) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}&units=metric`, { mode: 'cors'})
    saveCurrentWeather(await result.json())
}

const getForecast = async (location) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${key}&units=metric`, { mode: 'cors'})
    saveForecast(await result.json())
}

// Sava date into state object
const saveCurrentWeather = (weatherData) => {
    console.log(weatherData)
    state.cityName = weatherData.name
    state.day0 = {  date: formatDate(weatherData.dt),
                    description: weatherData.weather[0].description,
                    temp: formatTemp(weatherData.main.temp),
                    feel: formatTemp(weatherData.main.feels_like),
                    wind: formatWindSpeed(weatherData.wind.speed),
                    icon: weatherData.weather[0].icon
                }
}

const saveForecast = (weatherData) => {
    console.log(weatherData)
    state.forecast = []
    for (let i = 6, day = 1; i < 40; i+=8, day++) {
        state.forecast.push({ date: formatDate(weatherData.list[i].dt),
                             description: weatherData.list[i].weather[0].description,
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
searchButton.addEventListener("click", async () => {
    await getCurrentWeather(locationInput.value)
    await getForecast(locationInput.value)
    renderWeatherInfo()
})


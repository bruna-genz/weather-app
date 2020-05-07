import "../src/assets/styles.scss";
import { weatherInfoView } from "./views/weatherInfoView"

// Variables
const state = {} // city name, description, coord, temp, feels like, wind speed
const key = "c751dd140c912dd0b6a6f02af1f50ee9"
const searchButton = document.querySelector("#search-button")
const locationInput = document.querySelector("#location-input")
const body = document.querySelector("body")

// !FIX THIS FUNCTIONS
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

const getCurrentWeather = async (location) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}&units=metric`, { mode: 'cors'})
    saveCurrentWeather(await result.json())
}

const getForecast = async (location) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${key}&units=metric`, { mode: 'cors'})
    saveForecast(await result.json())
}

const saveCurrentWeather = (weatherData) => {
    state.cityName = weatherData.name
    state.day0 = {  date: formatDate(weatherData.dt),
                    description: weatherData.weather[0].description,
                    temp: weatherData.main.temp,
                    feel: weatherData.main.feels_like,
                    wind: weatherData.wind.speed
                }
}

const saveForecast = (weatherData) => {
    console.log(weatherData)
    state.forecast = []
    for (let i = 6, day = 1; i < 40; i+=8, day++) {
        state.forecast.push({ date: formatDate(weatherData.list[i].dt),
                             description: weatherData.list[i].weather[0].description,
                             temp: weatherData.list[i].main.temp,
                            })
                            console.log(weatherData.list[i])
    }
}

const renderWeatherInfo = () => {
    const weatherView = weatherInfoView(state)
    body.insertAdjacentHTML("beforeend", weatherView)
    renderForecast()
}

const forecastView = (forecastArray) => {
    const forecastViewArray = forecastArray.map(current => {
        return `<div><p>${current.date}</p><p>${current.description}</p><p>${current.temp}</p></div>`
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


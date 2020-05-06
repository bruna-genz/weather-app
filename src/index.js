import "../src/assets/styles.scss";
import { weatherInfoView } from "./views/weatherInfoView"

// Variables
const state = {} // city name, description, coord, temp, feels like, wind speed, rain
const key = "c751dd140c912dd0b6a6f02af1f50ee9"
const searchButton = document.querySelector("#search-button")
const locationInput = document.querySelector("#location-input")
const body = document.querySelector("body")

/*const formatDescription = (desc) => {

}*/

const getCurrentWeather = async (location) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}&units=metric`, { mode: 'cors'})
    saveCurrentWeather(await result.json())
}

const getForecast = async (location) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${key}&units=metric`, { mode: 'cors'})
    saveForecast(await result.json())
}

const saveCurrentWeather = (weatherData) => {
    console.log(weatherData)
    state.cityName = weatherData.name
    state.day0 = {  description: weatherData.weather[0].description,
        temp: weatherData.main.temp,
        feel: weatherData.main.feels_like,
        wind: weatherData.wind.speed
    }
}

const saveForecast = (weatherData) => {
    state.forecast = []
    for (let i = 4, day = 1; i < 40; i+=8, day++) {
        state.forecast.push({ date: weatherData.list[i].dt_txt,
                             description: weatherData.list[i].weather[0].description,
                             temp: weatherData.list[i].main.temp,
                            })
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


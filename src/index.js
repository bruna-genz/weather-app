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

const getWeather = async (location) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}&units=metric`, { mode: 'cors'})
    saveData(await result.json())
}

const saveData = (weatherData) => {
    console.log(weatherData)
    state.cityName = weatherData.name
    state.description = weatherData.weather[0].description
    state.coord = weatherData.coord
    state.temp = weatherData.main.temp
    state.feel = weatherData.main.feels_like
    state.wind = weatherData.wind.speed
}

const renderWeatherInfo = () => {
    const weatherView = weatherInfoView(state)
    body.insertAdjacentHTML("beforeend", weatherView)
}

// Events
searchButton.addEventListener("click", async () => {
    await getWeather(locationInput.value)
    renderWeatherInfo()
})


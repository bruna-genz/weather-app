import "../src/assets/styles.scss";
import { weatherInfoView } from "./views/weatherInfoView";
import { loaderView } from "./views/loaderView";
import { forecastView } from "./views/forecastView";
import { dayLengthView } from "./views/dayLengthView";

// Variables
const state = { unit: "metric"} // unit, city name, description, coord, temp, feels like, wind speed, forecast
const key = "c751dd140c912dd0b6a6f02af1f50ee9"
const locationInput = document.querySelector("#location-input")
const body = document.querySelector("body")
const weatherContainer = document.querySelector("#weather-info-container")

// Data formatting functions
const formatDate = (timestamp) => {
    const datesDic = {
        "Sun": "Sunday",
        "Mon": "Monday",
        "Tue": "Tuesday",
        "Wed": "Wednesday",
        "Thu": "Thursday",
        "Fri": "Friday",
        "Sat": "Saturday"
    }

    const dateArray = new Date(timestamp * 1000).toDateString().split(" ")
    const weekDay = datesDic[dateArray[0]]
    const day = `${dateArray[1]} ${dateArray[2]}`
    return [weekDay, day]
}

const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const formatedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    return [date, formatedTime]
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

const calcDayLength = () => {
    const difInMs = (state.day0.sunset[0].getTime() - state.day0.sunrise[0].getTime()) // difference in milliseconds
    const hours = Math.floor(difInMs / (1000 * 60 * 60))
    const minutes = Math.round((difInMs % (1000 * 60 * 60)) / (1000 * 60))  
    return `${hours}h ${minutes}min`
}

// API calls 
const makeApiCall = async (location, unit) => {
    try {
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
    } catch(error) {
        alert(error)
    }
}

// Sava date into state object
const saveCurrentWeather = (weatherData) => {
    state.location = [weatherData.name, weatherData.sys.country]
    state.condition = weatherData.weather[0].main
    state.day0 = {  date: formatDate(weatherData.dt),
                    description: formatDescription(weatherData.weather[0].description),
                    temp: formatTemp(weatherData.main.temp),
                    feel: formatTemp(weatherData.main.feels_like),
                    wind: formatWindSpeed(weatherData.wind.speed),
                    sunrise: formatTime(weatherData.sys.sunrise),
                    sunset: formatTime(weatherData.sys.sunset),
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
const toggleBtn = () => {
    if (state.unit == "imperial") {
        const cBtn = document.querySelector("#c-button")
        const fBtn = document.querySelector("#f-button")

        cBtn.classList.toggle("selected")
        fBtn.classList.toggle("selected")
    }
}

const renderWeatherInfo = () => {
    const weatherView = weatherInfoView(state)
    weatherContainer.insertAdjacentHTML("afterbegin", weatherView)
    toggleBtn()
    renderDayLength()
    renderForecast()
    setBackground()
}

const getForecastView = (forecastDataArray) => {
    const forecastViewArray = forecastDataArray.map(current => {
        return forecastView(current)
    })
    return forecastViewArray
}

const renderForecast = () => {
    const forecastContainer = document.querySelector("#next-days")
    getForecastView(state.forecast).forEach( dayView => {
        forecastContainer.insertAdjacentHTML("beforeend", dayView)
    })
}

const renderDayLength = () => {
    const lengthContainer = document.querySelector("#day-length")
    const dayLength = calcDayLength()
    const view = dayLengthView(dayLength, state.day0.sunrise[1], state.day0.sunset[1])
    lengthContainer.insertAdjacentHTML("afterbegin", view)
}

const setBackground = () => {
    weatherContainer.classList.add(state.condition)
}

const renderLoader = () => {
    weatherContainer.insertAdjacentHTML("beforeend", loaderView)
}

const removeLoader = () => {
    const loader = document.querySelector("#loader")
    weatherContainer.removeChild(loader)
}

// Events
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

const getWeather = async () => {
    renderLoader()
    const response = await makeApiCall(locationInput.value, state.unit)
    
    if (response) {
        await sleep(1000)
        weatherContainer.removeChild(weatherContainer.children[0])
        renderWeatherInfo()
    }

    removeLoader()
}

body.addEventListener("click", (e) => {
    if (e.target.matches("button")) {

        /*if (e.target.matches("#c-button") || e.target.matches("#f-button")) {
            const celem = document.querySelector("#c-button")
            const felem = document.querySelector("#f-button")

            celem.classList.toggle("selected")
            celem.classList.toggle("selected")
        }*/

        state.unit = e.target.dataset.unit
        getWeather()
    }
})

document.addEventListener("keypress", (e) => {
    if (event.key == "Enter") {
        getWeather()
    }
})
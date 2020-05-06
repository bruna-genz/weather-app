import "../src/assets/styles.scss"



// Variables
const key = "c751dd140c912dd0b6a6f02af1f50ee9"
const searchButton = document.querySelector("#search-button")
const locationInput = document.querySelector("#location-input")

const getWeather = async (location) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`, { mode: 'cors'})
    console.log(result)
    
}

// Events
searchButton.addEventListener("click", () => {
    getWeather(locationInput.value)
})
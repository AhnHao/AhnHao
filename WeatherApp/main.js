const apiKey = "6be0c84b4a8cea98e32ae4ed1e2bdc8d"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="
const searchBox = document.querySelector(".search-bar")
const searchBtn = document.querySelector(".search-btn")
const weatherIcon = document.querySelector(".weather-icon")

async function checkWeather(city) {
    const respone = await fetch(apiUrl + city + `&appid=${apiKey}`)
    
    if(respone.status == 404) {
        document.querySelector(".error-city-name").style.display = 'block'
        document.querySelector(".weather").style.display = 'none'
    } else {
        var data = await respone.json()

        document.querySelector(".weather-city").innerHTML = data.name
        document.querySelector(".weather-temp").innerHTML = Math.round(data.main.temp) + `°C`
        document.querySelector(".humidity").innerHTML = data.main.humidity + `%`
        document.querySelector(".wind").innerHTML = data.wind.speed + `Km/h`

        var weatherSituation = data.weather[0].main
        weatherIcon.src = './assets/image/' + `${weatherSituation}` + '.png'

        document.querySelector(".error-city-name").style.display = 'none'
        document.querySelector(".weather").style.display = 'block'
    }
}

searchBtn.onclick = function() {
    checkWeather(searchBox.value)
}

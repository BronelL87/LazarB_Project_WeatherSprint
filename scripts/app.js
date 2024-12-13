import { myApiKey } from "./environment.js";
import { saveRecentSearch, getRecentSearches, saveFavoriteCity, getFavoriteCities, removeFavoriteCity } from "./localStorage.js";


let defaultWeather = { city: "Stockton", state: "CA", lat: 37.9577, lon: -121.2908 };


let searchBar = document.getElementById('searchBar');
let findLocation = document.getElementById('findLocation');
let theTime = document.getElementById('theTime');
let theDate = document.getElementById('theDate');
let searchBtn = document.getElementById('searchBtn');
let currentTemp = document.getElementById('currentTemp');
let highTemp = document.getElementById('highTemp');
let lowTemp =  document.getElementById('lowTemp');
let recentSearchesList = document.getElementById('recentSearches');
let favoriteCitiesList = document.getElementById('favoriteCities');
let addFavoriteBtn = document.getElementById('addFavoriteBtn');
let day1Fore = document.getElementById("day1Fore");
let day1High = document.getElementById("day1High");
let day1Low = document.getElementById("day1Low");

let day2Fore = document.getElementById("day2Fore");
let day2High = document.getElementById("day2High");
let day2Low = document.getElementById("day2Low");

let day3Fore = document.getElementById("day3Fore");
let day3High = document.getElementById("day3High");
let day3Low = document.getElementById("day3Low");

let day4Fore = document.getElementById("day4Fore");
let day4High = document.getElementById("day4High");
let day4Low = document.getElementById("day4Low");

let day5Fore = document.getElementById("day5Fore");
let day5High = document.getElementById("day5High");
let day5Low = document.getElementById("day5Low");



navigator.geolocation.getCurrentPosition(successCall, errorCall);

function successCall(position) {
    let { latitude, longitude } = position.coords;

    
    fetchWeatherByCoords(latitude, longitude);
}

function errorCall() {
   
    fetchWeatherByCoords(defaultWeather.lat, defaultWeather.lon);
}


async function fetchWeatherByCoords(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}`);
    let weatherData = await response.json();
    getWeather(weatherData);
}

async function fetchCityDetails(city) {
    let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},US&limit=1&appid=${myApiKey}`);
    let geoData = await response.json();

    if (geoData && geoData.length > 0) {
        const location = geoData[0];
        fetchWeatherByCoords(location.lat, location.lon);
        saveRecentSearch(city);
        updateRecentSearches();
    } else {
        console.log(`City "${city}" not found.`);
    }
}


searchBtn.addEventListener("click", () => {
    const city = searchBar.value.trim();
    if (city) {
        fetchCityDetails(city);
    } else {
        console.log("Please enter a city name.");
    }
});

function kelvinToFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 9) / 5 + 32;
  }

function getWeather(weatherData) {
    console.log( weatherData);
    
    const city = weatherData.city.name;
    const state = weatherData.city.country;

    findLocation.textContent = `${city}, ${state}`;

 theTime.textContent = `${new Date().toLocaleTimeString()}`;
   
    theDate.textContent = ` - ${new Date().toLocaleDateString()}`;

    const currentWeather = weatherData.list[0];
    const temp = kelvinToFahrenheit(currentWeather.main.temp).toFixed(0);
    const tempMax = kelvinToFahrenheit(currentWeather.main.temp_max).toFixed(0);
    const tempMin = kelvinToFahrenheit(currentWeather.main.temp_min).toFixed(0);

    const humidity = currentWeather.main.humidity;
    const windSpeed = currentWeather.wind.speed;
    const precipitation = currentWeather.pop * 100;

    currentTemp.textContent = `${temp}°F`;
    highTemp.textContent = `High: ${tempMax}°F`;
    lowTemp.textContent = `Low: ${tempMin}°F`;
    humidStat.textContent = `Humidity: ${humidity}%`;
    windStat.textContent = `Wind: ${windSpeed} mph`;
    precipStat.textContent = `Precipitation: ${precipitation.toFixed(0)}%`;

    const dailyForecasts = weatherData.list.filter((item, index) => index % 8 === 0);

if (dailyForecasts.length >= 5) {
    const forecast1 = dailyForecasts[0];
    day1Fore.textContent = new Date(forecast1.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
    day1High.textContent = `High: ${kelvinToFahrenheit(forecast1.main.temp_max).toFixed(0)}°F`;
    day1Low.textContent = `Low: ${kelvinToFahrenheit(forecast1.main.temp_min).toFixed(0)}°F`;

    const forecast2 = dailyForecasts[1];
    day2Fore.textContent = new Date(forecast2.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
    day2High.textContent = `High: ${kelvinToFahrenheit(forecast2.main.temp_max).toFixed(0)}°F`;
    day2Low.textContent = `Low: ${kelvinToFahrenheit(forecast2.main.temp_min).toFixed(0)}°F`;

    const forecast3 = dailyForecasts[2];
    day3Fore.textContent = new Date(forecast3.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
    day3High.textContent = `High: ${kelvinToFahrenheit(forecast3.main.temp_max).toFixed(0)}°F`;
    day3Low.textContent = `Low: ${kelvinToFahrenheit(forecast3.main.temp_min).toFixed(0)}°F`;

    const forecast4 = dailyForecasts[3];
    day4Fore.textContent = new Date(forecast4.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
    day4High.textContent = `High: ${kelvinToFahrenheit(forecast4.main.temp_max).toFixed(0)}°F`;
    day4Low.textContent = `Low: ${kelvinToFahrenheit(forecast4.main.temp_min).toFixed(0)}°F`;

    const forecast5 = dailyForecasts[4];
    day5Fore.textContent = new Date(forecast5.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
    day5High.textContent = `High: ${kelvinToFahrenheit(forecast5.main.temp_max).toFixed(0)}°F`;
    day5Low.textContent = `Low: ${kelvinToFahrenheit(forecast5.main.temp_min).toFixed(0)}°F`;

    
}
}



function updateRecentSearches() {
    let recentCities = getRecentSearches();
    if (recentSearchesList) {
        recentSearchesList.innerHTML = ""; 
        
        recentCities.forEach((city) => {
            let listElement = document.createElement("li");
            listElement.textContent = city;
            listElement.addEventListener("click", () => fetchCityDetails(city));
            recentSearchesList.appendChild(li);
        });
    }else{
        console.log("No recents")
    }
}


function updateFavorites() {
    let favoriteCities = getFavoriteCities();
    if (favoriteCitiesList) {
        favoriteCitiesList.innerHTML = "";
        
        favoriteCities.forEach((city) => {
            const li = document.createElement("li");
            li.textContent = city;

            const removeBtn = document.createElement("img");
            removeBtn.src = "./assets/minusIcon.png";
            removeBtn.alt = "Remove from Favorites";
            removeBtn.addEventListener("click", () => {
                removeFavoriteCity(city);
                updateFavorites();
            });

            li.appendChild(removeBtn);
            favoriteCitiesList.appendChild(li);
        });
    }else{
        console.log("No favorites")
    }
}


function addCityToFavorites(city) {
    saveFavoriteCity(city);
    updateFavorites();
}

addFavoriteBtn.addEventListener('click', () => {
    let city = findLocation.textContent.split(",")[0]
    if (city) {
        addCityToFavorites(city);
    }
});

updateRecentSearches();
updateFavorites();

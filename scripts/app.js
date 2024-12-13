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
    const temp = kelvinToFahrenheit(currentWeather.main.temp).toFixed();
    const tempMax = kelvinToFahrenheit(currentWeather.main.temp_max).toFixed();
    const tempMin = kelvinToFahrenheit(currentWeather.main.temp_min).toFixed(0);

    currentTemp.textContent = `${temp}°F`;
    highTemp.textContent = `High: ${tempMax}°F`;
    lowTemp.textContent = `Low: ${tempMin}°F`;


    updateFavorites()
}

function updateRecentSearches() {
    const recentCities = getRecentSearches();
    if (recentSearchesList) {
        recentSearchesList.innerHTML = ""; 
        
        recentCities.forEach((city) => {
            const li = document.createElement("li");
            li.textContent = city;
            li.addEventListener("click", () => fetchCityDetails(city));
            recentSearchesList.appendChild(li);
        });
    }
}


function updateFavorites() {
    const favoriteCities = getFavoriteCities();
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
    }
}


function addCityToFavorites(city) {
    saveFavoriteCity(city);
    updateFavorites();
}

addFavoriteBtn.addEventListener('click', () => {
    let city = findLocation.textContent.split(",")[0].trim();
    if (city) {
        addCityToFavorites(city);
    }
});

updateRecentSearches();
updateFavorites();

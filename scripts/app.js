import { myApiKey } from "./environment.js";


let defaultWeather = { city: "Stockton", state: "CA", lat: 37.9577, lon: -121.2908 };


let searchBar = document.getElementById('searchBar');
let findLocation = document.getElementById('findLocation');
let theTime = document.getElementById('theTime');
let theDate = document.getElementById('theDate');


navigator.geolocation.getCurrentPosition(successCall, errorCall);

function successCall(position) {
    let { latitude, longitude } = position.coords;

    
    fetchWeatherByCoords(latitude, longitude);
}

function errorCall() {
   
    fetchWeatherByCoords(defaultWeather.lat, defaultWeather.lon);
}


function fetchWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}`)
        .then((response) => response.json())
        .then((weatherData) => getWeather(weatherData))
}


function fetchCityDetails(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},US&limit=1&appid=${myApiKey}`)
        .then((response) => response.json())
        .then((geoData) => {
            if (geoData && geoData.length > 0) {
                const location = geoData[0];
                fetchWeatherByCoords(location.lat, location.lon);
            } else {
                console.log(`City "${city}" not found.`);
            }
        })
        
}


findLocation.addEventListener("click", () => {
    const city = searchBar.value.trim();
    if (city) {
        fetchCityDetails(city);
    } else {
        console.log("Please enter a city name.");
    }
});


function getWeather(weatherData) {
    console.log( weatherData);
    
    theTime.textContent = `${new Date().toLocaleTimeString()}`;
    theDate.textContent = ` - ${new Date().toLocaleDateString()}`;
}
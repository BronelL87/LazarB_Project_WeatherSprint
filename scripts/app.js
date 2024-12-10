import { myApiKey } from "./environment.js";

let userSearch = document.getElementById('userSearch');
let findLocation = document.getElementById('findLocation');
let theTime = document.getElementById('theTime');
let theDate = document.getElementById('theDate');


async function apiCall(){
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=37.736317&lon=-120.936005&appid=${myApiKey}`)
    const data = await promise.json()
    console.log(data);    
}

apiCall()
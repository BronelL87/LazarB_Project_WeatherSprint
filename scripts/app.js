import { myApiKey } from "./environment.js";



async function apiCall(){
    const promise = await fetch(`http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${myApiKey}`)
    const data = await promise.json()
    console.log(data);    
}

apiCall()
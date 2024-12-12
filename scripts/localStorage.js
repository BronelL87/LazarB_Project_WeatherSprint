function saveRecentSearch(city) {
    let recentCities = getRecentSearches();

    
    if (!recentCities.includes(city)) {
        
        if (recentCities.length >= 5) {
            recentCities.pop(); 
        }
        recentCities.unshift(city); 
    }

   
    localStorage.setItem("recentSearches", JSON.stringify(recentCities));
}


function getRecentSearches() {
    let data = localStorage.getItem("recentSearches");
    if (data == null) {
        return []; 
    }
    return JSON.parse(data); 
}


function saveFavoriteCity(city) {
    let favoriteCities = getFavoriteCities();

    
    if (!favoriteCities.includes(city)) {
        favoriteCities.push(city);
    }

    
    localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
}


function getFavoriteCities() {
    let data = localStorage.getItem("favoriteCities");
    if (data == null) {
        return []; 
    }
    return JSON.parse(data); 
}


function removeFavoriteCity(city) {
    let favoriteCities = getFavoriteCities();
    let index = favoriteCities.indexOf(city);
    if (index != -1) {
        favoriteCities.splice(index, 1); 
    }

    
    localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
}

export { saveRecentSearch, getRecentSearches, saveFavoriteCity, getFavoriteCities, removeFavoriteCity };
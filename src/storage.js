import { addToast } from "./loading.js";
import { state } from "./state.js";

export const AGELIMIT = 20 * 60 * 1000;
const FAVORITES_LIMIT = 7;

export function saveWeather(coords, weather) {
    const cacheList = readWeather() || [];
    coords = cleanCoords(coords);

    const newCache = {
        location: coords,
        time: Date.now(),
        data: weather,
    }

    const foundIndex = cacheList.findIndex(cacheItem => 
        cacheItem.location.latitude === coords.latitude &&
        cacheItem.location.longitude === coords.longitude 
    )

    if (foundIndex === -1) {
        cacheList.push(newCache);
    } else {
        cacheList[foundIndex] = newCache;
    }

    const stringData = JSON.stringify(cacheList)
    localStorage.setItem('cacheWeather', stringData)
}

export function getCache(coords) {
    const cache = readWeather();
    coords = cleanCoords(coords);

    if (!cache) {
        return;
    }

    const weather = cache.find((cacheItem) => 
        cacheItem.location.latitude === coords.latitude &&
        cacheItem.location.longitude === coords.longitude        
    )
    if (!weather) {
        return;
    }

    const timeDiff = Date.now() - weather.time;
    if (timeDiff < 0 || timeDiff > AGELIMIT) {
        weather.data.source = 'expiredCache';
    } else {
        weather.data.source = 'cache';
    }

    const cacheTime = new Date(weather.time)
    const nowTime = new Date()

    if (cacheTime.getHours() !== nowTime.getHours()) {
        weather.data.source = 'expiredCache';
    }

    return weather.data;
}

export function getDefaultLocation() {
    const location = localStorage.getItem('defaultLocation');
    if (!location) return;

    try {
        return JSON.parse(location);
    } catch {
        localStorage.removeItem('defaultLocation');
        return;
    }
}

export function setDefaultLocation() {
    const location = {
        name: state.location.city,
        state: state.location.province,
        country: state.location.country,
        coords: cleanCoords(state.location.coordinates),
    }
    
    if (!location.coords) return;
    
    const strCoords = JSON.stringify(location)
    localStorage.setItem('defaultLocation', strCoords);
    removeDefWeatherCache();
}

export function removeDefaultLocation() {
    localStorage.removeItem('defaultLocation');
    removeDefWeatherCache();
}

function readWeather() {
    const weatherData = localStorage.getItem('cacheWeather');
    if (!weatherData) return;

    try {
        return JSON.parse(weatherData);
    } catch {
        localStorage.removeItem('cacheWeather');
        return;
    }
}

function cleanCoords(coords) {
    return {
        latitude: Number(coords.latitude.toFixed(3)),
        longitude: Number(coords.longitude.toFixed(3)),
    }
}

export function cacheDefLocWeather(weather) {
    const cache = {
        time: Date.now(),
        weather: weather
    }

    const cacheStr = JSON.stringify(cache);
    localStorage.setItem('defWeather', cacheStr);
}

export function getDefWeatherCache() {
    const savedWeather = localStorage.getItem('defWeather');
    if (!savedWeather) return;

    try {
        return JSON.parse(savedWeather);
    } catch {
        localStorage.removeItem('defWeather');
        return;
    }
}

export function removeDefWeatherCache() {
    localStorage.removeItem('defWeather');
}

export function saveRecentSearch(location) {
    const recents = getRecentSearch();

    const index = recents.findIndex(city => city.latitude === location.latitude && city.longitude === location.longitude);

    if (index !== -1) {
        recents.splice(index, 1);
    } else if (recents.length >= 4) {
        recents.shift();
    }
    
    recents.push(location);
    state.recentSearches = recents;

    const strRecents = JSON.stringify(recents);
    localStorage.setItem('recentSearches', strRecents);
}

export function getRecentSearch() {
    const recents = localStorage.getItem('recentSearches');
    if (!recents) return [];

    try {
        return JSON.parse(recents);
    } catch {
        localStorage.removeItem('recentSearches');
        return [];
    }
}

export function addToFavorites() {
    const list = getFavorites();
    if (list.length >= FAVORITES_LIMIT) {
        addToast("You've reached the 7-location favorites limit.");
        return;
    } 

    const location = {
        id: Date.now(),
        name: state.location.city,
        state: state.location.province,
        country: state.location.country,
        coords: cleanCoords(state.location.coordinates),
    }
    list.push(location);
    
    state.favorites = list;
    localStorage.setItem('favorites', JSON.stringify(list));
    return true;
}

export function getFavorites() {
    const list = localStorage.getItem("favorites")
    if (!list) return [];

    try {
        return JSON.parse(list);
    } catch  {
        localStorage.removeItem('favorites');
        return [];
    }
}

export function removeFromFavorites() {
    const coords = cleanCoords(state.location.coordinates);
    const list = getFavorites()

    const index = list.findIndex(item => 
        item.coords.latitude === coords.latitude &&
        item.coords.longitude === coords.longitude
    )
    console.log(coords)
    console.log(list)
    if (index === -1) return;

    list.splice(index, 1)

    state.favorites = list;
    localStorage.setItem('favorites', JSON.stringify(list));
}
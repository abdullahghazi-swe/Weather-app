import { setState, state } from "./state.js";
import { render, renderFavorites, renderSearchResults } from "./ui.js";
import { saveWeather, getCache, getDefaultLocation, cacheDefLocWeather, getDefWeatherCache, saveRecentSearch, AGELIMIT } from "./storage.js";
import { showSearchError } from "./loading.js";

let controller;

export async function manageSelectedCity(selectedCityId) {
    const cityData = state.recentSearches.find((city) => city.id === selectedCityId) ??
                     state.searchResult.find((city) => city.id === selectedCityId);

    if (!cityData) return;

    const coords = { 
        latitude: cityData.latitude,
        longitude: cityData.longitude
    }
    
    let weather;
    const cachedWeather = getCache(coords);
    
    if (!cachedWeather || cachedWeather.source === 'expiredCache') {
        weather = await getWeather(cityData.latitude, cityData.longitude);
        weather && (weather.source = 'api');
    } else {
        weather = cachedWeather;
    }

    if (!weather && cachedWeather) {
        weather = cachedWeather;
    }
     
    if (!weather) {
        return; // show error
    }

    const formattedData = {
        name: cityData.name,
        state: cityData.admin1,
        country: cityData.country,
        coords: coords,
    }

    if (weather.source === 'api') {
        saveWeather(coords, weather)
    }

    saveRecentSearch(cityData);
    setState(formattedData, weather);
    render();
}

export async function manageFavWeather(id) {
    const city = state.favorites.find(city => city.id === id);
    if (!city) {
        return;
    }

    let weather;
    const cachedWeather = getCache(city.coords);

    if (!cachedWeather || cachedWeather.source === 'expiredCache') {
        weather = await getWeather(city.coords.latitude, city.coords.longitude);
        weather && (weather.source = 'api');
    } else {
        weather = cachedWeather;
    }

    if (!weather && cachedWeather) {
        weather = cachedWeather;
    }
     
    if (!weather) {
        return; // show error
    }

    if (weather.source === 'api') {
        saveWeather(city.coords, weather)
    }

    setState(city, weather)
    render();

}

export async function cityResults(searchQuery) {
    const citiesList = await getCitiesList(searchQuery);

    if (citiesList === "Abort") return;
    state.searchResult = citiesList || [];
    
    if (!citiesList) {
        showSearchError();
        return;
    }

    renderSearchResults();
}

async function getCitiesList(query) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}`;
    controller?.abort()
    controller = new AbortController()

    try {
        const response = await fetch(url, {signal: controller.signal});

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} : ${response.statusText}`);
        }

        const cities = await response.json();

        if (!cities.results || cities.results.length === 0) {
            return;
        }

        return cities.results;

    } catch(error) {
        if (error.name === 'AbortError') {
            console.log("Request aborted.")
            return "Abort";
        }
        console.error("Couldn't connect to server!", error)
        return;
    }
}

async function getWeather(lat, long) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}` + 
    "&current=temperature_2m,apparent_temperature,surface_pressure,relative_humidity_2m,uv_index,precipitation_probability,visibility,wind_speed_10m,weather_code,precipitation,dew_point_2m" + 
    "&hourly=temperature_2m,weather_code&forecast_hours=12" + 
    "&daily=precipitation_probability_mean,weather_code,temperature_2m_max,temperature_2m_min&timezone=auto";

    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=european_aqi,us_aqi`

    try {
        const [weatherRes, aqiRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(aqiUrl)
        ])

        if (!weatherRes.ok || !aqiRes.ok) {
            throw new Error(`HTTP Error Response failed!`);
        }

        const weatherData = await weatherRes.json();
        const aqi = await aqiRes.json()
        
        return {...weatherData, aqi_us: aqi.current.us_aqi, aqi_eu: aqi.current.european_aqi };

    } catch (error) {
        console.error("Couldn't get weather!", error)
        return;
    } 
}

export async function getWeatherOnLoad() {
    const location = await getlocationOnLoad();

    if (!location) {
        console.log("Couldn't get location");
        return
    }
    let cache;
    if (location.default) {
        cache = getDefWeatherCache();
    }

    let weather;

    if (cache && Date.now() - cache.time <= AGELIMIT) {
        weather = cache.weather;
        weather.source = 'cache';
    } else {
        weather = await getWeather(location.coords.latitude, location.coords.longitude);
        weather && (weather.source = 'api');
    }

    if (!weather && cache) {
        weather = cache.weather;
        weather.source = 'expiredCache';
        weather.cachedTime = cache.time;
    }

    if (!weather) {
        console.log("Couldnt get weather!")
        return;
    }

    if (weather.source === 'api') {
        cacheDefLocWeather(weather);
    }

    setState(location, weather)
    render()
}


async function getlocationOnLoad() {
    const defaultLocation = getDefaultLocation();

    if (defaultLocation) {
        defaultLocation.default = true;
        return defaultLocation;
    }

    try {
        const data = await getLocationFromBrowser()
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${data.lat}&lon=${data.lon}&format=json`;

        const response = await fetch(url);
        const cityData = await response.json();
        
        if (cityData) {
            return {
                name: cityData.address.city || location.address.village || location.address.town,
                state: cityData.address.state,
                country: cityData.address.country,
                approx: false,
                coords: {
                    latitude: data.lat,
                    longitude: data.lon,
                }
            }
        }
    } catch (error) {
        console.error(error)
    }

    try {
        const response = await fetch("https://hackmyip.com/api/ip");
        const cityData = await response.json();

        if (location) {
            return {
                name: cityData.data.location.city,
                state: cityData.data.location.region,
                country: cityData.data.location.country_name,
                approx: true,
                coords: {
                    latitude: Number(cityData.data.location.latitude),
                    longitude: Number(cityData.data.location.longitude),
                }
            }
        }

    }catch (err) {
        console.error(err)
    }
}

function getLocationFromBrowser() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve({
                lat: position.coords.latitude,
                lon: position.coords.longitude
        }),
    (error) => reject(error),
    {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      })
    })
}

async function getFavWeather(city) {
    let weather;
    const cacheWeather = getCache(city.coords)

    if (!cacheWeather || cacheWeather.source === 'expiredCache') {
        weather = await getWeather(city.coords.latitude, city.coords.longitude);
        weather && (weather.source = 'api');
    } else {
        weather = cacheWeather;
    }

    if (!weather && cacheWeather) {
        weather = cacheWeather;
    }

    if (weather.source === 'api') {
        saveWeather(city.coords, weather)
    }

    return {
        id: city.id,
        name: city.name,
        weather: weather || null,
    }
}

export async function loadFavorites() {
    const results = await Promise.all(state.favorites.map(city => getFavWeather(city)))
    renderFavorites(results);
}
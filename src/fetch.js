import { searchErr } from "./dom.js"
import { setState, state } from "./state.js";
import { render, renderSearchResults } from "./ui.js";
import { saveWeather, getCache, getDefaultLocation, cacheDefLocWeather, getDefWeatherCache } from "./storage.js";

const AGELIMIT = 60 * 60 * 1000;
let controller;

export async function manageSelectedCity(selectedCityId) {
    const cityData = state.searchResult.find((city) => city.id === selectedCityId)

    if (!cityData) return;

    const coords = { 
        latitude: cityData.latitude,
        longitude: cityData.longitude
    }

    const cachedWeather = getCache(coords);

    const weather = cachedWeather || await getWeather(cityData.latitude, cityData.longitude);
     
    if (!weather) {
        return;
    }

    const formatedData = {
        name: cityData.name,
        state: cityData.admin1,
        country: cityData.country,
        coords: coords,
    }

    if (!cachedWeather) {
        saveWeather(coords, weather)
    }

    setState(formatedData, weather);
    render();
}

export async function cityResults(searchQuery) {
    const citiesList = await getCitiesList(searchQuery);

    if (citiesList === "Abort") return;
    if (!citiesList) {
        searchErr.textContent = "City not found!";
    }

    state.searchResult = citiesList || [];
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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}` + 
    "&current=temperature_2m,apparent_temperature,surface_pressure,relative_humidity_2m,uv_index,precipitation,visibility,wind_speed_10m,weather_code" + 
    "&hourly=temperature_2m,weather_code&forecast_hours=7" + 
    "&daily=precipitation_probability_mean,weather_code,temperature_2m_max,temperature_2m_min&timezone=auto";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} : ${response.statusText}`);
        }

        const weatherData = await response.json();
        
        return weatherData;

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


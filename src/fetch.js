import { searchErr } from "./dom.js"
import { setState, state } from "./state.js";
import { render, renderSearchResults } from "./ui.js";

export async function getCityWeather(cityName) {
    const location = await getCity(cityName);

    if (!location) {
        searchErr.textContent = "City not found!";
        return;
    }

    const weather = await getWeather(location.latitude, location.longitude);

    if (!weather) {
        return;
    }

    const city = {
        name: location.name,
        state: location.admin1,
        country: location.country
    }

    setState(city, weather);
    render();
}

export async function manageSelectedCity(selectedCityId) {
    const cityData = state.searchResult.find((city) => city.id === selectedCityId)

    if (!cityData) return
    console.log(cityData.id)
    const weather = await getWeather(cityData.latitude, cityData.longitude);
    
    if (!weather) return;

    const formatedData = {
        name: cityData.name,
        state: cityData.admin1,
        country: cityData.country
    }
    setState(formatedData, weather);
    render();
}

export async function cityResults(searchQuery) {
    const citiesList = await getCitiesList(searchQuery);

    if (!citiesList) {
        searchErr.textContent = "City not found!";
        return;
    }
    state.searchResult = citiesList;
    renderSearchResults();
}

async function getCitiesList(query) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} : ${response.statusText}`);
        }

        const cities = await response.json();

        if (!cities.results || cities.results.length === 0) {
            return;
        }

        return cities.results;

    } catch(error) {
        console.error("Couldn't connect to server!", error)
        return;
    }
}

async function getCity(name) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}`;

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} : ${response.statusText}`);
        }

        const cities = await response.json()

        if (!cities.results || cities.results.length === 0) {
            return;
        }
        const city = cities.results[0]

        return city;

    } catch(error) {
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

    const weather = await getWeather(location.lat, location.lon)
    if (!weather) {
        console.log("Couldnt get weather!")
        return;
    }

    setState(location, weather)
    render()
}


async function getlocationOnLoad() {
    try {
        const data = await getLocationFromBrowser()
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${data.lat}&lon=${data.lon}&format=json`;

        const response = await fetch(url);
        const cityData = await response.json();
        
        if (cityData) {
            return {
                lat: cityData.lat,
                lon: cityData.lon,
                name: cityData.address.city || location.address.village || location.address.town,
                state: cityData.address.state,
                country: cityData.address.country
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
                lat: cityData.data.location.latitude,
                lon: cityData.data.location.longitude,
                name: cityData.data.location.city,
                state: cityData.data.location.region,
                country: cityData.data.location.country_name
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


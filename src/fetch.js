import { country, searchErr } from "./dom.js"
import { setState } from "./state.js";
import { render } from "./ui.js";

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
        name: city.name,
        state: city.admin1,
        country: city.country
    }

    setState(city, weather);
    render();
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
    const city = {
        name: location.address.city || location.address.village || location.address.town,
        state: location.address.state,
        country: location.address.country
    }
    setState(city, weather)
    render()
}


async function getlocationOnLoad() {
    try {
        const data = await getLocationFromBrowser()
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${data.lat}&lon=${data.lon}&format=json`;

        const response = await fetch(url);
        const cityData = await response.json();
        
        if (cityData) {
            return cityData;
        }
    } catch (error) {
        console.error(error)
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


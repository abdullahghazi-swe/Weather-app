import { searchErr } from "./dom.js"
import { setState } from "./state.js";
import { render } from "./ui.js";

export async function getCityWeather(cityName) {
    const city = await getCity(cityName);

    if (!city) {
        searchErr.textContent = "City not found!";
        return;
    }

    const weather = await getWeather(city.latitude, city.longitude);

    if (!weather) {
        return;
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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature,surface_pressure,relative_humidity_2m,uv_index,precipitation,visibility,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&forecast_hours=7&timezone=auto`

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
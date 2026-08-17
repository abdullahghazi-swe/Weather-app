import { humidity, searchErr } from "./dom.js"
import { setState } from "./state.js";
import { render } from "./ui.js";

export async function getCityWeather(cityName) {
    const location = await getCityCoords(cityName);

    if (!location) {
        searchErr.textContent = "City not found!"
    }
    const weather = await getWeather(location.latitude, location.longitude);

    setState({
        city: cityName,
        weather: weather.current.weather_code,
        temperature: weather.current.temperature_2m,
        humidity: weather.current.relative_humidity_2m,
        wind: weather.current.wind_speed_10m,
    })
    render();
}
async function getCityCoords(name) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name}`

    const response = await fetch(url)
    const cities = await response.json()

    if (!cities.results || cities.results.location === 0) return;
    const city = cities.results[0]

    return {latitude: city.latitude, longitude: city.longitude}
    
}

async function getWeather(lat, long) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`

    const response = await fetch(url);
    const weatherData = await response.json();

    return weatherData;
}
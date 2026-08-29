import { favorites } from "./dom.js";
import { cleanHourData, cleanDailyData } from "./utils.js";

export const state = {
    searchResult:  [],
    recentSearches: [],
    favorites: [],
    location: {
        time: null,
        timezone: null,
        city: null,
        province: null,
        country: null,
        approx:  false,
        coordinates: null,
    },
    baseData: {
        weather: null,
        temperature: null,
        pressure: null,
        humidity: null,
        source: null,
    },
    derivedData: {
        apparentTemp: null,
        windSpeed: null,
        uvIndex: null,
        precipitation: null,
        visibility: null,
    },
    hourlyData: [],
    dailyData: [],
}

export function setState(city, weather) {
    state.location.time = weather.current.time;
    state.location.timezone = weather.timezone;
    state.location.city = city.name;
    state.location.province = city.state;
    state.location.country = city.country;
    state.location.approx = city.approx || false;
    state.location.coordinates = city.coords;

    state.baseData.weather = weather.current.weather_code;
    state.baseData.temperature = weather.current.temperature_2m;
    state.baseData.pressure = weather.current.surface_pressure;
    state.baseData.humidity = weather.current.relative_humidity_2m;
    state.baseData.source = weather.source;

    state.derivedData.apparentTemp = weather.current.apparent_temperature;
    state.derivedData.windSpeed = weather.current.wind_speed_10m;
    state.derivedData.uvIndex = weather.current.uv_index;
    state.derivedData.precipitation = weather.current.precipitation;
    state.derivedData.visibility = weather.current.visibility;

    state.hourlyData = cleanHourData(weather.hourly)
    state.dailyData = cleanDailyData(weather.daily)
}
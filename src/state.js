import { temp } from "./dom.js";
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
    weatherData: {
        weatherCode: null,
        temperature: null,
        apparentTemp: null,
        precipProbability: null,

        windSpeed: null,
        uvIndex: null,
        aqi:null,
        visibility: null,

        pressure: null,
        humidity: null,
        precipitation: null,
        dewPoint:null,
        source: null,
    },
    hourlyData: [],
    dailyData: [],
    units: {
        temp: 'celsius',
        pres: 'hectopascals',
        precip: 'millimeters',
        wind: 'kilometersPerHour',
        visib: 'kilometers',
    }
}

export function setState(city, weather) {
    state.location.time = weather.current.time;
    state.location.timezone = weather.timezone;
    state.location.city = city.name;
    state.location.province = city.state;
    state.location.country = city.country;
    state.location.approx = city.approx || false;
    state.location.coordinates = city.coords;

    state.weatherData.weatherCode = weather.current.weather_code;
    state.weatherData.temperature = weather.current.temperature_2m;
    state.weatherData.apparentTemp = weather.current.apparent_temperature;
    state.weatherData.precipProbability = weather.current.precipitation_probability;

    state.weatherData.windSpeed = weather.current.wind_speed_10m;
    state.weatherData.uvIndex = weather.current.uv_index;
    state.weatherData.aqi = weather.aqi_eu;
    state.weatherData.visibility = weather.current.visibility;

    state.weatherData.pressure = weather.current.surface_pressure;
    state.weatherData.humidity = weather.current.relative_humidity_2m;
    state.weatherData.precipitation = weather.current.precipitation;
    state.weatherData.dewPoint = weather.current.dew_point_2m;
    state.weatherData.source = weather.source;

    state.hourlyData = cleanHourData(weather.hourly)
    state.dailyData = cleanDailyData(weather.daily)
}
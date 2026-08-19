import { time, city, country, weather, temp, humidity, wind, hourList, precip, uv, feels, pressure, visibility } from "./dom.js";
import { state } from "./state.js";
import { formateTime, cleanHourTime } from "./utils.js";

const WEATHERCODES = {
  0: "Clear",
  1: "Clear",
  2: "Partly Cloudy",
  3: "Cloudy",
  45: "Foggy",
  48: "Heavy Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  56: "Light Freezing Drizzle",
  57: "Dense Freezing Drizzle",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Light Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Slight Snowfall",
  73: "Moderate Snowfall",
  75: "Heavy Snowfall",
  77: "Snow Grains",
  80: "Slight Rain Showers",
  81: "Moderate Rain Showers",
  82: "Violent Rain Showers",
  85: "Slight Snow Showers",
  86: "Heavy Snow Showers",
  95: "Slight/Moderate Thunderstorm",
  96: "Thunderstorm with Slight Hail",
  97: "Thunderstorm with Heavy Hail"
};

export function render() {
    time.textContent = formateTime(state.location.time);
    city.textContent = state.location.city;
    country.textContent = `${state.location.province}, ${state.location.country}`;

    weather.textContent = getWeatherState(state.baseData.weather);
    temp.textContent = state.baseData.temperature;
    humidity.textContent = state.baseData.humidity;
    pressure.textContent = state.baseData.pressure;

    wind.textContent = state.derivedData.windSpeed;
    precip.textContent = state.derivedData.precipitation;
    uv.textContent = state.derivedData.uvIndex;
    feels.textContent = state.derivedData.apparentTemp;
    visibility.textContent = state.derivedData.visibility;

    createHourList(state.hourlyData, hourList)
}

function getWeatherState(code) {
    return WEATHERCODES[code] || 'Clear';
}



function createHourList(hours, list) {
    list.innerHTML = ''
    for (const hour of hours) {
        const card = document.createElement('div')
        card.classList.add('hour-card')
        
        const hourLable = document.createElement('div')
        const hourWeather = document.createElement('div')
        const hourTemp = document.createElement('p')

        hourLable.textContent = cleanHourTime(hour.time);
        
        hourWeather.textContent = getWeatherState(hour.weather);
        hourTemp.textContent = `${hour.temp} °C`;
        
        card.append(hourLable, hourWeather, hourTemp)
        hourList.appendChild(card)
    }
}
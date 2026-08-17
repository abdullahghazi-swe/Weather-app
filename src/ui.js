import { city, weather, temp, humidity, wind, hourList } from "./dom.js";
import { state } from "./state.js";

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
    city.textContent = state.city;
    weather.textContent = getWeatherState(state.weather);
    temp.textContent = state.temp;
    humidity.textContent = state.humidity;
    wind.textContent = state.wind;
}

function getWeatherState(code) {
    return WEATHERCODES[code] || 'Clear';
}



// function createHourList(hours, hourList) {
//     hourList.innerHTML = ''
//     for (const hour in hours) {
//         const card = document.createElement('div')
//         card.classList.add('hour-card')
        
//         const hourLable = document.createElement('div')
//         const hourTemp = document.createElement('p')

//         hourLable.textContent = `${hour}pm`;
//         hourTemp.textContent = `${hours[hour]} C`;
        
//         card.append(hourLable, hourTemp)
//         hourList.appendChild(card)
//     }
// }
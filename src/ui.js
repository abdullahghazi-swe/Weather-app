import { time, city, country, weather, temp, humidity, wind, hourList, precip, uv, feels, pressure, visibility, dailyList, searchResult, locDetail, search, star, defaultText } from "./dom.js";
import { state } from "./state.js";
import { formateTime, cleanHourTime, cleanDay, checkDefault } from "./utils.js";

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
    time.textContent = formateTime(state.location.timezone);
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

    createHourList(state.hourlyData, hourList, state.location.time);
    createDailyList(state.dailyData, dailyList, state.location.time);

    addSetDefault(state.location.coordinates)

    removeChangeLoc();
    if (state.location.approx) {
        addChangeLocation();
    }

    searchResult.classList.remove('show-results')
}

function getWeatherState(code) {
    return WEATHERCODES[code] || 'Clear';
}



function createHourList(hours, list, currentTime) {
    list.innerHTML = ''
    for (const hour of hours) {
        const card = document.createElement('div')
        card.classList.add('hour-card')
        
        const hourLable = document.createElement('div')
        const hourWeather = document.createElement('div')
        const hourTemp = document.createElement('p')

        hourLable.textContent = cleanHourTime(hour.time, currentTime);
        
        hourWeather.textContent = getWeatherState(hour.weather);
        hourTemp.textContent = `${hour.temp} °C`;
        
        card.append(hourLable, hourWeather, hourTemp)
        list.appendChild(card)
    }
}

function createDailyList(daily, list, currentTime) {
    list.innerHTML = "";
    for (const day of daily) {
        const card = document.createElement('div')
        card.classList.add('day-card')
        
        const dayBox = document.createElement('div')
        const weatherBox = document.createElement('div')
        const precipBox = document.createElement('span')
        const tempBox = document.createElement('div')

        dayBox.textContent = cleanDay(day.date, currentTime)
        weatherBox.textContent = getWeatherState(day.weather);
        precipBox.textContent = `${day.precipitaion}%`;
        tempBox.textContent = `${day.tempMin}° - ${day.tempMax}°`
        
        card.append(dayBox, weatherBox, precipBox, tempBox)
        list.appendChild(card)
    }
}

export function renderSearchResults() {
    searchResult.innerHTML = '';

    searchResult.classList.add('show-results')

    for (const city of state.searchResult) {
        const box = document.createElement('div');
        const cityName = document.createElement('div');
        const details = document.createElement('div');

        const state = city.admin1 ? `${city.admin1}, ` : '';
        const district = city.admin2 ? `${city.admin2}, ` : '';
        const division = city.admin3 ? `${city.admin3}, ` : '';

        box.classList.add('city-result')
        box.dataset.id = city.id;

        cityName.textContent = city.name;
        details.textContent = division + district + state + city.country;
        box.append(cityName, details)
        searchResult.appendChild(box)
    }
}

function addChangeLocation() {
    const note = document.createElement('span');
    const btn = document.createElement('btn');

    note.textContent = "Approximate";
    btn.textContent = "Change";

    note.className = 'approx';
    btn.className = 'changeBtn'
    
    btn.addEventListener('click', () => {
        search.focus();
        setTimeout(() => searchResult.classList.add('show-results'), 100);
    });

    note.append(btn);
    locDetail.append(note);
}

function removeChangeLoc() {
    const appox = document.querySelector('.approx');
    if (appox) appox.remove();
}

function addSetDefault(currentCoords) {
    const isDefault = checkDefault(currentCoords);

    if (isDefault) {
        star.textContent = "★";
        defaultText.textContent = "Default Location";
    } else {
        star.textContent = "☆";
        defaultText.textContent = "Set as default";
    }
}
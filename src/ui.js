import { locBox, time, city, country, weather, temp, humidity, wind, hourList, precip, precipProb, dew, uv, feels, pressure, visibility, aqi, dailyList, searchResult, search, star, defaultText, update, favorites, favList, favStar, favText, searchBtn } from "./dom.js";
import { tempUnit, feelsUnit, windUnit, visibUnit, dewUnit, presUnit, precipUnit  } from "./dom.js";
import { removeLoading } from "./loading.js";
import { state } from "./state.js";
import { formateTime, cleanHourTime, cleanDay, checkDefault, checkInFavorites, convertTemp, convertPrecip, convertPressure, convertWind, convertVisib } from "./utils.js";

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
  95: "Moderate Thunderstorm",
  96: "Thunderstorm with Slight Hail",
  97: "Thunderstorm with Heavy Hail"
};

export function render() {
    resetUI();

    time.textContent = formateTime(state.location.timezone);
    city.textContent = state.location.city;
    country.textContent = `${state.location.province}, ${state.location.country}`;

    temp.textContent = convertTemp(state.weatherData.temperature, state.units.temp);
    feels.textContent = convertTemp(state.weatherData.apparentTemp, state.units.temp);
    weather.textContent = getWeatherState(state.weatherData.weatherCode);
    precipProb.textContent = state.weatherData.precipProbability;

    wind.textContent = convertWind(state.weatherData.windSpeed, state.units.wind);
    uv.textContent = state.weatherData.uvIndex;
    aqi.textContent = state.weatherData.aqi
    visibility.textContent = convertVisib(state.weatherData.visibility, state.units.visib);

    humidity.textContent = state.weatherData.humidity;
    pressure.textContent = convertPressure(state.weatherData.pressure, state.units.pres);
    precip.textContent = convertPrecip(state.weatherData.precipitation, state.units.precip);
    dew.textContent = convertTemp(state.weatherData.dewPoint, state.units.temp);

    showUpdateTime(state.weatherData.updateTime);

    createHourList(state.hourlyData, hourList, state.location.time);
    createDailyList(state.dailyData, dailyList, state.location.time);

    addSetDefault(state.location.coordinates);
    addFavOption(state.location.coordinates);

    setUnits()

    if (state.weatherData.source === 'expiredCache') {
        showOffline();
    }

    if (state.location.approx) {
        addChangeLocation();
    }
    removeLoading()
    renderRecentSearches();
    
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

        hourLable.textContent = cleanHourTime(hour.time);
        hourLable.className = 'hourTime';
        
        hourWeather.dataset.weather = getWeatherState(hour.weather);
        hourWeather.textContent = '🌙';
        hourWeather.className = 'hourWeather';

        hourTemp.textContent = `${convertTemp(hour.temp, state.units.temp)} ${state.units.temp === "celsius" ? "°C": "°F"}`;
        hourTemp.className = 'hourTemp'

        if (hour.time.slice(0, 13) === currentTime.slice(0, 13)) {
            hourLable.textContent = "Now";
            hourWeather.dataset.weather = state.weatherData.weatherCode;
            hourTemp.textContent = `${convertTemp(state.weatherData.temperature, state.units.temp)} ${state.units.temp === "celsius" ? "°C": "°F"}`;
            card.classList.add('now-hour');
            hourLable.style.color = '#6e96be'
        }

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

        dayBox.className = 'dayBox'
        weatherBox.className = 'weatherBox'

        const weekDay = document.createElement('div')
        const weather = document.createElement('div')

        weekDay.className = 'weekDay'
        weather.className = 'weekDayWeather'

        const precipBox = document.createElement('span')
        const tempBox = document.createElement('div')

        precipBox.className = 'dailyPrecip'
        tempBox.className = 'dailyTemp'

        weekDay.textContent = cleanDay(day.date, currentTime)
        weather.textContent = `☀️ ${getWeatherState(day.weather)}`;
        precipBox.textContent = `${day.precipitaion}%`;
        tempBox.textContent = `${day.tempMin}° - ${day.tempMax}°`

        dayBox.append(weekDay, weather)
        weatherBox.append(tempBox, precipBox)
        
        card.append(dayBox, weatherBox)
        list.appendChild(card)
    }
    list.lastElementChild.classList.add('last-day')
}

export function renderSearchResults() {
    searchResult.innerHTML = '';

    for (const city of state.searchResult) {
        searchResult.append(createSearchResult(city))
    }

    searchResult.classList.add('show-results')
}

export function renderRecentSearches() {
    searchResult.innerHTML = '';

    for (const city of state.recentSearches) {
        searchResult.prepend(createSearchResult(city))
    }
}

function createSearchResult(city) {
    const box = document.createElement('div');
    const cityName = document.createElement('div');
    const details = document.createElement('div');

    const state = city.admin1 ? `${city.admin1}, ` : '';
    const district = city.admin2 ? `${city.admin2}, ` : '';
    const division = city.admin3 ? `${city.admin3}, ` : '';

    box.classList.add('city-result')
    box.dataset.id = city.id;

    details.className = 'area-details';
    cityName.className = 'city-name'

    cityName.textContent = city.name;
    details.textContent = division + district + state + city.country;
    box.append(cityName, details)

    return box;
}

function addChangeLocation() {
    const note = document.createElement('span');
    const btn = document.createElement('btn');

    note.textContent = "Approximate";
    btn.textContent = "Change";

    note.className = 'approx';
    btn.className = 'changeBtn';
    
    btn.addEventListener('click', () => {
        search.classList.add('show')
        searchBtn.classList.remove('show')
        search.focus()
        if (searchResult.children.length) {
            searchResult.classList.add('show-results');
        }
    });

    note.append(btn);
    city.append(note);
}

function resetUI() {
    const appox = document.querySelector('.approx');
    if (appox) appox.remove();

    const offline = document.querySelector('.offline');
    if (offline) offline.remove();

    update.textContent = '';
    search.value = '';
    searchResult.classList.remove('show-results');
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

function showOffline() {
    update.textContent = `Offline · ${update.textContent}`;

    const offline = document.createElement('div')
    offline.textContent = 'Offline — showing cached data';
    offline.className = 'offline';

    locBox.append(offline);
}

function showUpdateTime(time) {
    const weatherTime = new Date(time);
    const now = new Date();

    const timeDiff = now - weatherTime;
    const minutes = Math.floor(timeDiff / (1000 * 60)) ;
    const hours = Math.floor(minutes / 60);

    let text;

    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        text = `Updated ${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
        text = `Updated ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes <= 10) {
        text = 'Updated Just Now';
    } else {
        text = `Updated ${minutes} minutes ago`;
    }

    update.textContent = text;
}

export function renderFavorites(favs) {
    favList.innerHTML = "";
    favorites.classList.remove('show')

    for (let city of favs) {
        const favorite = createFavCard(city);
        
        favList.prepend(favorite);
    }

    if (favList.children.length) {
        favorites.classList.add('show')
    } 
}

function createFavCard(city) {
    const favBox = document.createElement('div');
    const cityBox = document.createElement('div');

    const cityName = document.createElement('div');

    favBox.dataset.id = city.id
    favBox.className = 'favorite-item';
    cityBox.className = 'cityBox';
    

    cityName.textContent = city.name;
    cityName.className = 'cityName';

    cityBox.append(cityName)

    if (city.weather !== null) {
        const weatherIcon = document.createElement('div');
        const cityWeather = document.createElement('div');

        const weatherState = document.createElement('div');
        const temp = document.createElement('div');

        cityWeather.className = 'cityWeather';

        weatherIcon.textContent = '🌙';
        weatherIcon.className = 'weatherIcon';

        weatherState.textContent = getWeatherState(city.weather.current.weather_code);
        weatherState.className = 'weatherState';

        temp.textContent = `${convertTemp(city.weather.current.temperature_2m, state.units.temp)} ${state.units.temp === "celsius" ? "°C": "°F"}`;
        temp.className = 'cityTemp';

        cityWeather.append(weatherState, temp)
        cityBox.append(cityWeather);
        favBox.append(weatherIcon);
    }

    if (city.weather === null || city.weather.source === 'expiredCache') {
        const btn = document.createElement('button')
        btn.textContent = '🔄';

        btn.classList.add('retry-btn');
        favBox.append(btn);
    }
    
    favBox.append(cityBox);
    return favBox;
}


function addFavOption(coords) {
    const isFav = checkInFavorites(coords);
    
    if (isFav) {
        favStar.textContent = "★";
        favText.textContent = "Favorited";
    } else {
        favStar.textContent = "☆";
        favText.textContent = "Add to Favorites";
    }
}

function setUnits() {

    tempUnit.textContent = state.units.temp === "celsius" ? "°C": "°F";
    feelsUnit.textContent = state.units.temp === "celsius" ? "°C": "°F";
    dewUnit.textContent = ` ${state.units.temp === "celsius" ? "°C": "°F"}`;
    precipUnit.textContent = ` ${state.units.precip === "millimeters" ? "mm": "in"}`;
    presUnit.textContent = ` ${state.units.pres === "hectopascals" ? "hPa": "mmHg"}`;
    windUnit.textContent = ` ${state.units.wind === "kilometersPerHour" ? "Km/h": state.units.wind === "milesPerHour" ? "mph": "kn"}`;
    visibUnit.textContent = ` ${state.units.visib === "kilometers" ? "Km": state.units.visib === "miles"? "mi": "m"}`;
}
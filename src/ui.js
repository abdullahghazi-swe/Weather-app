import { locBox, time, city, country, weather, weatherIcon, temp, humidity, wind, hourList, precip, precipProb, dew, uv, feels, pressure, visibility, aqi, dailyList, searchResult, search, star, defaultText, update, favorites, favList, favStar, favText, searchBtn, defaultBtn, favBtn, rightScroll, leftScroll } from "./dom.js";
import { tempUnit, feelsUnit, windUnit, visibUnit, dewUnit, presUnit, precipUnit  } from "./dom.js";
import { removeLoading } from "./loading.js";
import { state } from "./state.js";
import { formateTime, cleanHourTime, cleanDay, checkDefault, checkInFavorites, convertTemp, convertPrecip, convertPressure, convertWind, convertVisib, getTimezoneDateTime, checkDay } from "./utils.js";
import { WEATHER_ICONS, WEATHER_CODES } from "./constant.js";

export function render() {
    resetUI();

    showTime(state.location.timezone)
    city.textContent = state.location.city;
    country.textContent = showCountry(state.location.province, state.location.country);

    temp.textContent = convertTemp(state.weatherData.temperature, state.units.temp);
    feels.textContent = convertTemp(state.weatherData.apparentTemp, state.units.temp);
    weather.textContent = getWeatherState(state.weatherData.weatherCode);
    precipProb.textContent = state.weatherData.precipProbability;
    weatherIcon.textContent = getWeatherIcon(state.weatherData.weatherCode, getTimezoneDateTime(state.location.timezone))

    wind.textContent = convertWind(state.weatherData.windSpeed, state.units.wind);
    uv.textContent = state.weatherData.uvIndex;
    aqi.textContent = state.weatherData.aqi
    visibility.textContent = convertVisib(state.weatherData.visibility, state.units.visib);

    humidity.textContent = state.weatherData.humidity;
    pressure.textContent = convertPressure(state.weatherData.pressure, state.units.pres);
    precip.textContent = convertPrecip(state.weatherData.precipitation, state.units.precip);
    dew.textContent = convertTemp(state.weatherData.dewPoint, state.units.temp);

    showUpdateTime(state.weatherData.updateTime);

    createHourList(state.hourlyData, hourList);
    createDailyList(state.dailyData, dailyList);

    addSetDefault(state.location.coordinates);
    addFavOption(state.location.coordinates);

    setUnits()

    if (state.weatherData.source === 'expiredCache') {
        showOffline();
    }

    if (state.location.approx) {
        addChangeLocation();
    }
    removeLoading();
    renderRecentSearches();
}

function getWeatherState(code) {
    return WEATHER_CODES[code] || 'Clear';
}



function createHourList(allHours, list) {
    list.scrollTo({left:0});
    list.innerHTML = '';
    const now = getTimezoneDateTime(state.location.timezone);

    const remainingHours = allHours.filter(hour => hour.time.slice(0, 13) >= now.slice(0, 13)).slice(0, 13)

    for (const hour of remainingHours) {
        const card = document.createElement('div')
        card.classList.add('hour-card')
        
        const hourLable = document.createElement('div')
        const hourWeather = document.createElement('div')
        const hourTemp = document.createElement('p')

        hourLable.textContent = cleanHourTime(hour.time);
        hourLable.className = 'hourTime';
        
        hourWeather.textContent = getWeatherIcon(hour.weather, hour.time);
        hourWeather.className = 'hourWeather';

        hourTemp.textContent = `${convertTemp(hour.temp, state.units.temp)} ${state.units.temp === "celsius" ? "°C": "°F"}`;
        hourTemp.className = 'hourTemp'

        if (hour.time.slice(0, 13) === now.slice(0, 13)) {
            hourLable.textContent = "Now";
            hourWeather.dataset.weather = state.weatherData.weatherCode;
            hourTemp.textContent = `${convertTemp(state.weatherData.temperature, state.units.temp)} ${state.units.temp === "celsius" ? "°C": "°F"}`;
            card.classList.add('now-hour');
            hourLable.style.color = '#6e96be'
        }

        card.append(hourLable, hourWeather, hourTemp)
        list.appendChild(card)
    }

    if (list.scrollWidth > list.clientWidth) {
        rightScroll.classList.add("show");
    }

    if (!list.children.length) {
        list.parentElement.classList.add('hide');
    }
}

function createDailyList(daily, list) {
    list.innerHTML = "";

    const now = getTimezoneDateTime(state.location.timezone);
    const days = daily.filter(day => day.date >= now.slice(0, 10)).slice(0, 7)

    const highestTemp = days.reduce((highest, temp) => Math.max(highest, temp.tempMax), -Infinity)
    const lowestTemp = days.reduce((lowest, temp) => Math.min(lowest, temp.tempMin), Infinity)

    for (const day of days) {
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
        const tempBox = getDailyTempBox(day.tempMin, day.tempMax, highestTemp, lowestTemp)

        precipBox.className = 'dailyPrecip'
        tempBox.className = 'dailyTempBox'

        weekDay.textContent = cleanDay(day.date, now)
        weather.textContent = `${getWeatherIcon(day.weather)} ${getWeatherState(day.weather)}`;
        precipBox.textContent = `${day.precipitaion}%`;

        dayBox.append(weekDay, weather)
        weatherBox.append(tempBox, precipBox)
        
        card.append(dayBox, weatherBox)
        list.appendChild(card)
    }
    list.lastElementChild.classList.add('last-day')
}

function getDailyTempBox(min, max, highest, lowest) {
    const weekTempDiff = highest - lowest;
    const dayTempDiff = max - min;
    const lowDiff = min - lowest;

    const percentOfWeek =  Math.round(dayTempDiff / weekTempDiff * 100)
    const percentOfLow = Math.round(lowDiff / weekTempDiff * 100)
    
    const dailyTemp = document.createElement('div')
    const minBox = document.createElement('span')
    const maxBox = document.createElement('span')

    const tempBox = document.createElement('div')
    const tempBar = document.createElement('div')

    tempBox.className = 'tempBarBox'
    tempBar.className = 'tempBar'

    tempBar.style.width = `${percentOfWeek}%`
    tempBar.style.marginLeft = `${percentOfLow}%`

    minBox.textContent = `${convertTemp(min, state.units.temp)} ${state.units.temp === "celsius" ? "°C": "°F"}`;
    maxBox.textContent = `${convertTemp(max, state.units.temp)} ${state.units.temp === "celsius" ? "°C": "°F"}`;

    maxBox.className = 'maxTemp';

    tempBox.appendChild(tempBar)

    dailyTemp.append(minBox, tempBox, maxBox)

    return dailyTemp;
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
    const country = city.country ? `${city.country}` : '';

    box.classList.add('city-result')
    box.dataset.id = city.id;

    details.className = 'area-details';
    cityName.className = 'city-name'

    cityName.textContent = city.name;
    details.textContent = division + district + state + country;

    if (details.textContent === '') {
        details.textContent = 'none'
        details.classList.add('invisible')
    }
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
    search.classList.remove('active');
    hourList.parentElement.classList.remove('hide');
    rightScroll.classList.remove('show');
    leftScroll.classList.remove('show');
}

function addSetDefault(currentCoords) {
    const isDefault = checkDefault(currentCoords);

    if (isDefault) {
        star.textContent = "★";
        defaultText.textContent = "Default Location";
        defaultBtn.classList.add('selected');
    } else {
        star.textContent = "☆";
        defaultText.textContent = "Set as default";
        defaultBtn.classList.remove('selected');
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

        weatherIcon.textContent = favWeatherIcon(city.weather.timezone, city.weather.daily.sunset[0], city.weather.daily.sunrise[0], city.weather.current.weather_code);
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
        favBtn.classList.add('selected');
    } else {
        favStar.textContent = "☆";
        favText.textContent = "Add to Favorites";
        favBtn.classList.remove('selected');
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

function showTime(timezone) {
    clearInterval(state.interval)

    time.textContent = formateTime(timezone);
    
    state.interval = setInterval(() => {
        time.textContent = formateTime(timezone);
    }, 20 * 1000)
}

function showCountry(stateData, countryData) {
    country.classList.remove('invisible')

    if (!stateData && ! countryData) {
        country.classList.add('invisible')
    }

    if (!stateData && countryData) return countryData;

    return `${stateData}, ${countryData}`
}


function getWeatherIcon(code, time=null) {
    
    if (time) {
        const timeState = checkDay(state.dailyData, time)
        return WEATHER_ICONS[timeState][code] ?? WEATHER_ICONS.general[code]
    }

    return WEATHER_ICONS.day[code] ?? WEATHER_ICONS.general[code]
}

function favWeatherIcon(timezone, sunset, sunrise, code) {
    const now = getTimezoneDateTime(timezone);
    let timeState;
    if (now < sunrise || now >= sunset) {
        timeState = 'night';
    } else {
        timeState = 'day';
    }

    return WEATHER_ICONS[timeState][code] ?? WEATHER_ICONS.general[code];
}
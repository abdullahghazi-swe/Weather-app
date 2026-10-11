import { getDefaultLocation, getFavorites } from "./storage.js";

const hourFormater = new Intl.DateTimeFormat('en-US', { hour12: true, hour: 'numeric' })
const dayFormater = new Intl.DateTimeFormat('en-US', { weekday: 'short' })

export function formateTime(timezone) {
    const now = new Date();
    const dateFormater = new Intl.DateTimeFormat('en-US', { timeZone:timezone, weekday: 'short', month: 'short', day: 'numeric' });
    const timeFormater = new Intl.DateTimeFormat('en-US', { timeZone:timezone, hour12: true, hour: '2-digit', minute: 'numeric' });
    
    return `${dateFormater.format(now)} · ${timeFormater.format(now)}`;
}

export function cleanHourTime(timeStr) {

    const time = new Date(timeStr);
    return hourFormater.format(time);
}

export function cleanDay(dateStr, currentTime) {

    if (dateStr === currentTime.slice(0, 10)) {
        return "Today";
    }
    
    const day = new Date(dateStr);
    return dayFormater.format(day);
}

export function cleanHourData(hourly) {
    const timeList = [];
    for (let i=0; i < hourly.time.length; i++) {
        timeList.push({
            time: hourly.time[i],
            weather: hourly.weather_code[i],
            temp: hourly.temperature_2m[i]
        })
    }
    return timeList;
}

export function cleanDailyData(daily) {
    const dayList = [];
    for (let i=0; i < daily.time.length; i++) {
        dayList.push({
            date: daily.time[i],
            weather: daily.weather_code[i],
            precipitaion: daily.precipitation_probability_mean[i],
            tempMax: daily.temperature_2m_max[i],
            tempMin: daily.temperature_2m_min[i],
        })
    }
    return dayList;
}

export function checkDefault(currentCoords) {
    const location = getDefaultLocation();
    if (!location) return false;

    const defaultCoords = location.coords;    

    currentCoords = {
        latitude: Number(currentCoords.latitude.toFixed(3)),
        longitude: Number(currentCoords.longitude.toFixed(3))
    }
    
    if (defaultCoords &&
        currentCoords.latitude === defaultCoords.latitude &&
        currentCoords.longitude === defaultCoords.longitude
    ) {
        return true;
    }

    return false;
}

export function checkInFavorites(currentCoords) {
    const list = getFavorites();

    currentCoords = {
        latitude: Number(currentCoords.latitude.toFixed(3)),
        longitude: Number(currentCoords.longitude.toFixed(3))
    }

    const exists = list.find(item => 
        item.coords.latitude === currentCoords.latitude &&
        item.coords.longitude === currentCoords.longitude
    )
    
    if (exists) return true;

    return false;
}

export function convertTemp(value, unit) {
    if (unit === 'celsius') return Math.round(value);

    return Math.round((value * 1.8) + 32);
}

export function convertPressure(value, unit) {
    if (unit === 'hectopascals') return Math.round(value);

    return Math.round(value * 0.75006150504341);
}

export function convertPrecip(value, unit) {
    if (unit === 'millimeters') return value;

    return (value / 25.4).toFixed(2);
}

export function convertWind(value, unit) {
    if (unit === 'kilometersPerHour') {
        return Math.round(value);
    } 
    
    if (unit === 'milesPerHour') {
        return (value / 1.609344).toFixed(1);
    }
    
    if (unit === 'knots') {
        return (value / 1.852).toFixed(1);
    }
}

export function convertVisib(value, unit) {

    if (unit === 'meters') {
        return Math.round(value);
    } 
    
    if (unit === 'miles') {
        return (value / 1609.344).toFixed(1)
    }
    
    if (unit === 'kilometers') {
        return (value / 1000).toFixed(1);
    }
}

export function manageExpiry(weather) {
    if (weather.source !== "expiredCache") return weather;

    const now = getTimezoneDateTime(weather.timezone)

    if (weather.current.time.slice(0, 13) === now.slice(0, 13)) return weather;

    const matchingHour = weather.hourly.time.findIndex(hour => hour.slice(0, 13) === now.slice(0, 13));

    if (matchingHour < 0) {
        return weather;
    }

    weather.current.temperature_2m = weather.hourly.temperature_2m[matchingHour];
    weather.current.weather_code = weather.hourly.weather_code[matchingHour];

    return weather;
}


export function getTimezoneDateTime(timezone) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    }).formatToParts(new Date());

    const values = Object.fromEntries(parts.map(p => [p.type, p.value]));

    return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`;
}

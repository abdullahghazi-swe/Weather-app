import { getDefaultLocation } from "./storage.js";

const hourFormater = new Intl.DateTimeFormat('en-US', { hour12: true, hour: 'numeric' })
const dayFormater = new Intl.DateTimeFormat('en-US', { weekday: 'short' })

export function formateTime(timezone) {
    const now = new Date();
    const dateFormater = new Intl.DateTimeFormat('en-US', { timeZone:timezone, weekday: 'short', month: 'short', day: 'numeric' });
    const timeFormater = new Intl.DateTimeFormat('en-US', { timeZone:timezone, hour12: true, hour: '2-digit', minute: 'numeric' });
    
    return `${dateFormater.format(now)} · ${timeFormater.format(now)}`;
}

export function cleanHourTime(timeStr, currentTime) {
    if (timeStr.slice(0, 13) === currentTime.slice(0, 13)) {
        return "Now";
    } 

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
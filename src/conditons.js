import { state } from "./state.js";

function checkTimeState(dayList, time) {
    const currentTime = new Date(time);
    const index = dayList.findIndex(day => day.date === time.slice(0, 10))
    const todaySunrise = new Date(dayList[index].sunrise)
    const todaySunset = new Date(dayList[index].sunset)

    if  (currentTime < todaySunrise) {
        return 'night';
    }

    if (currentTime < new Date(todaySunrise.getTime() + 3 * 60 * 60 * 1000)) {
        return 'morning';
    }

    if (currentTime < new Date(todaySunset.getTime() - 3 * 60 * 60 * 1000)) {
        return 'noon';
    }

    if (currentTime < new Date(todaySunset.getTime() + 1 * 60 * 60 * 1000)) {
        return 'evening';
    }

    return 'night';
}

function checkWeather(code) {
    if ([0,1].includes(code)) return 'clear';
    if ([2,3].includes(code)) return 'cloud';
    if ([45, 48].includes(code)) return 'fog';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
    if ([95, 96, 97, 99].includes(code)) return "thunder";
    
    return 'clear';
}

function checkTemp(temp) {
    if (temp <= 0) return 'freezing';
    if (temp <= 14) return 'cold';
    if (temp <= 26) return 'moderate';
    if (temp <= 33) return 'warm';

    return 'hot';
}

export function setConditions(weatherCode, time, temp) {
    const timeState = checkTimeState(state.dailyData, time);
    const weather = checkWeather(weatherCode);
    const temperature = checkTemp(temp);

    state.conditions.time = timeState;
    state.conditions.weather = weather;
    state.conditions.temp = temperature;
}
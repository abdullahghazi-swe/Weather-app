import { weather } from "./dom.js"

const dateFormater = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const timeFormater = new Intl.DateTimeFormat('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })
const hourFormater = new Intl.DateTimeFormat('en-US', { hour12: true, hour: 'numeric' })

export function formateTime(str) {
    const time = new Date(str)
    return `${dateFormater.format(time)} · ${timeFormater.format(time)}`
}

export function cleanHourTime(str) {
    const time = new Date(str)
    return hourFormater.format(time)
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
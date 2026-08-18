
export const state = {
    city: null,
    weather: null,
    temp: null,
    humidity: null,
    wind: null,
}

export function setState(city, weather) {

    state.city = city.name;
    state.weather = weather.current.weather_code;
    state.temp = weather.current.temperature_2m;
    state.humidity = weather.current.relative_humidity_2m;
    state.wind = weather.current.wind_speed_10m;
}
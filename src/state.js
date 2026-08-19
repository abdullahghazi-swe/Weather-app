
export const state = {
    city: null,
    weather: null,
    temp: null,
    feelsTemp: null,
    pressure: null,
    humidity: null,
    wind: null,
    uvIndex: null,
    precp: null,
    visibility: null,
}

export function setState(city, weather) {

    state.city = city.name;
    state.weather = weather.current.weather_code;
    state.temp = weather.current.temperature_2m;
    state.feelsTemp = weather.current.apparent_temperature;
    state.pressure = weather.current.surface_pressure;
    state.humidity = weather.current.relative_humidity_2m;
    state.wind = weather.current.wind_speed_10m;
    state.uvIndex = weather.current.uv_index;
    state.precp = weather.current.precipitation;
    state.visibility = weather.current.visibility;
}
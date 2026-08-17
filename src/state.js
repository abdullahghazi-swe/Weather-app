
export const state = {
    city: null,
    weather: null,
    temp: null,
    humidity: null,
    wind: null,
}

export function setState(newData) {

    state.city = newData.city;
    state.weather = newData.weather;
    state.temp = newData.temperature;
    state.humidity = newData.humidity;
    state.wind = newData.wind;
}
import { search, searchErr } from "./dom.js";
import { getCityWeather, cityResults } from "./fetch.js";

const searchState = {
    timer: null,
}

export function getCities() {
    searchErr.textContent = '';
    if (searchState.timer) {
        clearTimeout(searchState.timer);
        searchState.timer = null;
    }

    searchState.timer = setTimeout(() => {
        if (search.value.length >= 2) {
            cityResults(search.value)
        }
    }, 600)
}

export function searchData() {
    searchErr.textContent = '';
    const query = search.value.toLowerCase().trim();

    getCityWeather(query)
}



        
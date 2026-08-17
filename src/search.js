import { search, searchErr, form } from "./dom.js";
import { setState } from "./state.js";
import { render } from "./ui.js";
import { getCityWeather } from "./fetch.js";

export function initApp() {
    form.addEventListener('submit', e => {
    e.preventDefault()
    searchData()
    })
}

function searchData() {
    searchErr.textContent = '';
    const query = search.value.toLowerCase().trim();

    getCityWeather(query)
}




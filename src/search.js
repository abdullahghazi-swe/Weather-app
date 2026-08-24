import { search, searchErr } from "./dom.js";
import { cityResults } from "./fetch.js";

const searchState = {
    timer: null,
}

export function getCities() {
    searchErr.textContent = '';
    const query = search.value.trim();

    if (searchState.timer) {
        clearTimeout(searchState.timer);
        searchState.timer = null;
    }

    searchState.timer = setTimeout(() => {
        if (query.length >= 2) {
            cityResults(search.value)
        }
    }, 600)
}



        
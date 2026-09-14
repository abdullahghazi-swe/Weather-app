import { search } from "./dom.js";
import { cityResults } from "./fetch.js";
import { renderRecentSearches } from "./ui.js";
import { showSearching } from "./loading.js";

const searchState = {
    timer: null,
}

export function getCities() {

    const query = search.value.trim();

    if (query === '') {
        renderRecentSearches();
    }

    if (searchState.timer) {
        clearTimeout(searchState.timer);
        searchState.timer = null;
    }

    searchState.timer = setTimeout(() => {
        if (query.length >= 2) {
            showSearching();
            cityResults(search.value)
        }
    }, 600)
}



        
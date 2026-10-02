import { search } from "./dom.js";
import { cityResults } from "./fetch.js";
import { renderRecentSearches } from "./ui.js";
import { showSearching } from "./loading.js";

const searching = debounce((query) => cityResults(query))

export function getCities() {

    const query = search.value.trim();

    if (query === '') {
        renderRecentSearches();
    }

    searching(query);
}


function debounce(callback) {
    let timer;

    return function(query) {
        clearTimeout(timer);

        timer = setTimeout(() => {
            if (query.length < 2) return;

            showSearching();
            callback(query);
        }, 600)
    }
}
        
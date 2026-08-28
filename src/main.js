import { initEventListeners } from "./events.js";
import { getWeatherOnLoad } from "./fetch.js";
import { state } from "./state.js";
import { getRecentSearch } from "./storage.js";

function initApp() {
    state.recentSearches = getRecentSearch();
    initEventListeners();
    getWeatherOnLoad();
}

initApp()


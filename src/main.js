import { initEventListeners } from "./events.js";
import { getWeatherOnLoad, loadFavorites } from "./fetch.js";
import { state } from "./state.js";
import { getRecentSearch, getFavorites } from "./storage.js";

function initApp() {
    state.recentSearches = getRecentSearch();
    state.favorites = getFavorites();
    initEventListeners();
    getWeatherOnLoad();
    loadFavorites();
}

initApp()


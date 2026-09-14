import { initEventListeners } from "./events.js";
import { getWeatherOnLoad, loadFavorites } from "./fetch.js";
import { showLoading } from "./loading.js";
import { state } from "./state.js";
import { getRecentSearch, getFavorites } from "./storage.js";

function initApp() {
    showLoading()
    state.recentSearches = getRecentSearch();
    state.favorites = getFavorites();
    initEventListeners();
    getWeatherOnLoad();
    loadFavorites();
}

initApp()


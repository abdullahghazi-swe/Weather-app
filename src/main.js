import { initEventListeners } from "./events.js";
import { getWeatherOnLoad, loadFavorites } from "./fetch.js";
import { state } from "./state.js";
import { getRecentSearch, getFavorites } from "./storage.js";
import { loadPrefs } from "./prefs.js";

function initApp() {
    state.recentSearches = getRecentSearch();
    state.favorites = getFavorites();
    loadPrefs();
    initEventListeners();
    getWeatherOnLoad();
    loadFavorites();
}

initApp()


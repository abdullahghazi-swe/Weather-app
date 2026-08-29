import { initEventListeners } from "./events.js";
import { getWeatherOnLoad } from "./fetch.js";
import { state } from "./state.js";
import { getRecentSearch, getFavorites } from "./storage.js";
import { renderFavorites } from "./ui.js";

function initApp() {
    state.recentSearches = getRecentSearch();
    state.favorites = getFavorites();
    initEventListeners();
    getWeatherOnLoad();
    renderFavorites()
}

initApp()


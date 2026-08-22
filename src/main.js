import { initEventListeners } from "./events.js";
import { getWeatherOnLoad } from "./fetch.js";

function initApp() {
    initEventListeners()
    getWeatherOnLoad()
}

initApp()


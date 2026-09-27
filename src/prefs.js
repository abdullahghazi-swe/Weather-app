import { settings } from "./dom.js";
import { loadFavorites } from "./fetch.js";
import { state } from "./state.js";
import { render } from "./ui.js";

export function showSettings() {
    settings.classList.add('show');
    requestAnimationFrame(()=> {
        settings.firstElementChild.classList.add('settings-shown');
    })
    document.body.style.overflow = "hidden";
}

export function hideSettings() {
    settings.classList.remove('show')
    settings.firstElementChild.classList.remove('settings-shown');
    document.body.style.overflow = "";
}

export function loadPrefs() {
    const prefs = localStorage.getItem("preferences")
    if (!prefs) {
        savePrefs();
        return;
    };

    try {
        const units = JSON.parse(prefs)
        state.units = units;
    } catch {
        localStorage.removeItem('preferences');
    }
}

export function savePrefs() {
    const prefs = state.units;
    localStorage.setItem("preferences", JSON.stringify(prefs));
}

export function changePrefs(type, unit) {
    state.units[type] = unit;
    savePrefs()
    render();
    loadFavorites();
}
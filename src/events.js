import { search, searchResult, star, defaultText } from "./dom.js";
import { manageSelectedCity } from "./fetch.js";
import { getCities } from "./search.js";
import { state } from "./state.js";
import { setDefaultLocation, removeDefaultLocation } from "./storage.js";
import { checkDefault } from "./utils.js";


export function initEventListeners() {
    document.addEventListener('click', e => {
        if (!searchResult.classList.contains('show-results')) return;

        if (!search.contains(e.target) && !searchResult.contains(e.target)) {
            searchResult.classList.remove('show-results');
        }
    })

    search.addEventListener('input', getCities)
    search.addEventListener('focus', () => {
        if (searchResult.children.length) {
            searchResult.classList.add('show-results');
        }
    })
    searchResult.addEventListener('click', e => {
        if (!searchResult.contains(e.target)) return;

        const selectedCity = e.target.closest('.city-result');
        manageSelectedCity(Number(selectedCity.dataset.id));
    })

    star.addEventListener('click', () => {
        const isDefault = checkDefault(state.location.coordinates)
        
        if (!isDefault) {
            setDefaultLocation();
            star.textContent = "★";
            defaultText.textContent = "Default Location";
        } else {
            removeDefaultLocation();
            star.textContent = "☆";
            defaultText.textContent = "Set as default";
        }
    })
}
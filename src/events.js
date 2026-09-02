import { search, searchResult, star, defaultText, favStar, favText, favorites } from "./dom.js";
import { manageFavWeather, manageSelectedCity, loadFavorites } from "./fetch.js";
import { getCities } from "./search.js";
import { state } from "./state.js";
import { setDefaultLocation, removeDefaultLocation, addToFavorites, removeFromFavorites } from "./storage.js";
import { checkDefault, checkInFavorites } from "./utils.js";


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

    favStar.addEventListener('click', () => {
        const isFav = checkInFavorites(state.location.coordinates);

        if (!isFav) {
            const added = addToFavorites();
            if (!added) return;
            favStar.textContent = "★";
            favText.textContent = "Favorited";
            loadFavorites();
        } else {
            removeFromFavorites();
            favStar.textContent = "☆";
            favText.textContent = "Add to Favorites";
            loadFavorites();
        }
    })

    favorites.addEventListener('click', e => {
        const fav = e.target.closest('.favorite-item');
        if (!fav) return;

        manageFavWeather(Number(fav.dataset.id))
    })
}
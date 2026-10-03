import { search, searchResult, star, defaultText, favStar, favText, favorites, searchBtn, settingBtn, settings, settingClose, units, hourList, leftScroll, rightScroll } from "./dom.js";
import { manageFavWeather, manageSelectedCity, loadFavorites } from "./fetch.js";
import { getCities } from "./search.js";
import { state } from "./state.js";
import { setDefaultLocation, removeDefaultLocation, addToFavorites, removeFromFavorites } from "./storage.js";
import { checkDefault, checkInFavorites } from "./utils.js";
import { showSettings, hideSettings, changePrefs } from "./prefs.js";


export function initEventListeners() {
    searchBtn.addEventListener('click', e => {
        search.classList.add('show')
        searchBtn.classList.remove('show')
        search.focus()
        requestAnimationFrame(() => {
            search.classList.add('active')
        })
        if (searchResult.children.length) {
            searchResult.classList.add('show-results');
        }
    })

    document.addEventListener('click', e => {
        if (!search.classList.contains('show')) return;
        if (e.target.closest('.changeBtn')) return;

        if (!search.contains(e.target) && !searchBtn.contains(e.target)) {
            search.classList.remove('active');
        }
    })

    search.addEventListener('transitionend', e => {
        if (e.target.classList.contains('active')) return;

        search.classList.remove('show')
        searchBtn.classList.add('show');
    })

    document.addEventListener('click', e => {
        if (!searchResult.classList.contains('show-results')) return;

        if (!search.contains(e.target) && !searchResult.contains(e.target) && !searchBtn.contains(e.target)) {
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
        const retry = e.target.closest('button');

        if (retry) {
            loadFavorites();
            return;
        }

        const fav = e.target.closest('.favorite-item');
        if (!fav) return;

        manageFavWeather(Number(fav.dataset.id))
    })

    settingBtn.addEventListener('click', () => {
        showSettings();
    })

    settingClose.addEventListener('click', () => {
        hideSettings();
    })

    settings.addEventListener('click', e => {
        if (e.target === settings) {
            hideSettings();
        }
    })

    units.addEventListener('click', e => {
        const btn = e.target.closest('button') 
        
        if (btn) {
            changePrefs(btn.dataset.type, btn.dataset.unit)
        }
    })

    hourList.addEventListener('scroll', () => {
        const atLeft = hourList.scrollLeft <= 0;
        const atRight = hourList.scrollLeft + hourList.clientWidth >= hourList.scrollWidth - 1;

        if (atLeft) {
            leftScroll.classList.remove('show')
        } else {
            !leftScroll.classList.contains('show') && leftScroll.classList.add('show')
        }

        if (atRight) {
            rightScroll.classList.remove('show')
        } else {
            !rightScroll.classList.contains('show') && rightScroll.classList.add('show')
        }
    })

    leftScroll.addEventListener('click', () => {
        hourList.scrollTo({behavior: "smooth", left:0});
    })

    rightScroll.addEventListener('click', () => {
        hourList.scrollTo({behavior: "smooth", left: hourList.scrollWidth - hourList.clientWidth})
    })
}
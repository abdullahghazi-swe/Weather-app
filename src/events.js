import { search, searchResult, star, defaultText, favStar, favText, favorites, searchBtn, settingBtn, settings, settingClose, units, hourList, leftScroll, rightScroll } from "./dom.js";
import { manageFavWeather, manageSelectedCity, loadFavorites } from "./fetch.js";
import { getCities } from "./search.js";
import { state } from "./state.js";
import { setDefaultLocation, removeDefaultLocation, addToFavorites, removeFromFavorites } from "./storage.js";
import { checkDefault, checkInFavorites } from "./utils.js";
import { showSettings, hideSettings, changePrefs } from "./prefs.js";


export function initEventListeners() {
    document.addEventListener('keydown', e => {
        const key = e.key;

        if (key === "Escape") {

            if (settings.classList.contains('show')) {
                hideSettings()
            }

            if (search.classList.contains('show')) {
                search.classList.remove('active')
                searchResult.classList.remove('show-results');
                document.querySelector('.city-result.current')?.classList.remove('current');
            }
            
            e.preventDefault();
        }

        if (e.ctrlKey && key === ',') {
            showSettings();
            search.classList.remove('active')
            searchResult.classList.remove('show-results');
        }

        if (key === '/' && !search.classList.contains('show')) {
            showSearch();
            hideSettings();
            e.preventDefault();
        }

        if (key === 'ArrowDown' || key === 'ArrowUp') {
            if (!searchResult.classList.contains('show-results')) return;
            e.preventDefault()

            const activeResult = document.querySelector('.city-result.current');
            activeResult?.classList.remove('current');
            if (key === 'ArrowDown') {
                if (!activeResult) {
                    searchResult.firstElementChild.classList.add('current');
                    return;
                }

                const nextElement = activeResult.nextElementSibling;
                if (!nextElement) {
                    searchResult.firstElementChild.classList.add('current');
                } else {
                    nextElement.classList.add('current')
                }
            }

            if (key === 'ArrowUp') {
                if (!activeResult) {
                    searchResult.lastElementChild.classList.add('current');
                    return;
                }

                const nextElement = activeResult.previousElementSibling;
                if (!nextElement) {
                    searchResult.lastElementChild.classList.add('current');
                } else {
                    nextElement.classList.add('current')
                }
            }
        }

        if (key === 'Enter' && searchResult.classList.contains('show-results')) {
            e.preventDefault()

            const selectedCity = document.querySelector('.city-result.current')
            if (!selectedCity) return;

            manageSelectedCity(Number(selectedCity.dataset.id));
        }
    })

    searchResult.addEventListener('mousemove', e => {
        if (!searchResult.classList.contains('show-results')) return;

        const over = e.target.closest('.city-result')

        if (!over) return;
        if (over.classList.contains('current')) return;

        const currentActive = document.querySelector('.city-result.current');
        if (currentActive) {
            currentActive.classList.remove('current');
        }

        over.classList.add('current');
    })

    searchBtn.addEventListener('click', () => {
        showSearch();
    })

    document.addEventListener('click', e => {
        if (!search.classList.contains('show')) return;
        if (e.target.closest('.changeBtn')) return;

        if (!search.contains(e.target) && !searchBtn.contains(e.target)) {
            search.classList.remove('active');
            document.querySelector('.city-result.current')?.classList.remove('current');
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

function showSearch() {
    search.classList.add('show')
    searchBtn.classList.remove('show')
    search.focus()
    requestAnimationFrame(() => {
        search.classList.add('active')
    })
    if (searchResult.children.length) {
        searchResult.classList.add('show-results');
    }
}
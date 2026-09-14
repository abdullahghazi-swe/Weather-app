import { searchResult } from "./dom.js"

export function showSearching() {
    searchResult.innerHTML = '';
    const loader = document.createElement('div');

    loader.className = 'search-loading';
    
    searchResult.prepend(loader)
}

export function showSearchError() {
    searchResult.innerHTML = '';
    const error = document.createElement('div');

    error.textContent = 'No results found.';
    error.className = 'search-error'

    searchResult.prepend(error)
}
import { searchResult, toastBox } from "./dom.js"

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

export function showLoading() {
    removeLoading();
    document.body.style.overflow = "hidden";

    const loader = document.createElement('div');
    loader.className = 'app-loading';
    document.body.append(loader);
}

export function removeLoading() {
    document.body.style.overflow = '';
    const loader = document.querySelector('.app-loading');

    if (loader) {
        loader.remove();
    }
}

export function showErrorPage(message, retry, id) {
    removeLoading();
    document.body.style.overflow = "hidden";

    const errorPage = document.createElement('div');
    const text = document.createElement('p');
    const retryBtn = document.createElement('button');

    errorPage.className = 'app-error';
    text.className = 'app-error-text';
    retryBtn.className = 'tryAgain-btn';

    text.textContent = message;
    retryBtn.textContent = "Try again";

    retryBtn.addEventListener('click', e => {
        removeErrorPage();
        retry(id);
    });

    errorPage.append(text, retryBtn);
    document.body.append(errorPage);
}

function removeErrorPage() {
    const page = document.querySelector('.app-error');
    if (page) {
        page.remove();
    }
}

export function addToast(msg) {
    removeLoading();
    const toast = document.createElement('div');
    toast.className = 'toast';

    toast.textContent = msg;
    toastBox.prepend(toast);

    setTimeout(() => {
        toast.classList.add('toastEnd');
        toast.addEventListener('transitionend', e => e.target.remove());
    }, 4000);
}
import { settings } from "./dom.js";

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
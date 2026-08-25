const AGELIMIT = 60 * 60 * 1000;

export function saveWeather(coords, weather) {
    const cacheList = readWeather() || [];
    coords = cleanCoords(coords);

    const newCache = {
        location: coords,
        time: Date.now(),
        data: weather,
    }

    const foundIndex = cacheList.findIndex(cacheItem => 
        cacheItem.location.latitude === coords.latitude &&
        cacheItem.location.longitude === coords.longitude 
    )

    if (foundIndex === -1) {
        cacheList.push(newCache);
    } else {
        cacheList[foundIndex] = newCache;
    }

    const stringData = JSON.stringify(cacheList)
    localStorage.setItem('cacheWeather', stringData)
}

export function getCache(coords) {
    const cache = readWeather();
    coords = cleanCoords(coords);

    if (!cache) {
        return;
    }

    const weather = cache.find((cacheItem) => 
        cacheItem.location.latitude === coords.latitude &&
        cacheItem.location.longitude === coords.longitude        
    )
    if (!weather) {
        return;
    }

    const timeDiff = Date.now() - weather.time;
    if (timeDiff < 0 || timeDiff > AGELIMIT) {
        return;
    }

    return weather.data;
}

function readWeather() {
    const weatherData = localStorage.getItem('cacheWeather');
    if (!weatherData) return;

    try {
        return JSON.parse(weatherData);
    } catch {
        localStorage.removeItem('cacheWeather');
        return;
    }
}

function cleanCoords(coords) {
    return {
        latitude: Number(coords.latitude.toFixed(3)),
        longitude: Number(coords.longitude.toFixed(3)),
    }
}

const AGELIMIT = 60 * 60 * 1000;

export function saveWeather(coords, weather) {
    const cacheList = readWeather() || [];
    cacheList.push({location: coords, time: Date.now(), data: weather})

    const stringData = JSON.stringify(cacheList)
    localStorage.setItem('cacheWeather', stringData)
}

export function getCache(coords) {
    
    const cache = readWeather();
    if (!cache) {
        return;
    }

    const cleanedCache = cleanCache(cache);

    const weather = cleanedCache.find((cacheItem) => 
        cacheItem.location.latitude === coords.latitude &&
        cacheItem.location.longitude === coords.longitude        
    )

    return weather?.data;
}

function readWeather() {
    const weatherData = localStorage.getItem('cacheWeather');
    if (!weatherData) return;

    return JSON.parse(weatherData);
}

function cleanCache(cache) {
    const now = Date.now();

    const cleanedCache = cache.filter(item => now - item.time <= AGELIMIT)

    localStorage.setItem('cacheWeather', JSON.stringify(cleanedCache))

    return cleanCache;
}

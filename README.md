# Weather app

Weather app built in vanilla Javascript that show weather and forcast of any city.

## Features
- Search any city
- Show recent searches
- Get city location information
- Get Current full weather data
- Get hourly forcast
- Get 7-day forcast
- Get approx location from Geolocation API
- Get IP based location as backup
- Set Default location
- Set Favorites
- Save cache weather data to minimize API calls
- Refresh expired weather 
- Show stale weather on API failure

## Tech Stack
- HTML5
- CSS3
- JavaScript (vanilla)
- Open-mateo Weather and Geolocation API
- Nominatim reverse geocoding API
- HackMyIP (IP based geolocation)

## How to run

1. Clone the repo
2. Open index.html in browser


## Next

show real weather icons
add cache rules
make mobile responsive

## Cache Rules 

in 20 everything fine
in 1 hour everything fine but try refetch
1-12 hour old filter out passed hours and use hourly forcast to display current weather, fetch 15 hours but show 12 max
12-24 just dont show hours at all
more than 24 cache is just too oldshow error state 
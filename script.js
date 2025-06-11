// Take Location (Form)
const city = document.querySelector('input');
const submitButton = document.getElementById('submit');
const refreshButton = document.getElementById('refresh');
const tempC = document.getElementById('cel');
const tempF = document.getElementById('fah');

let unit = 'us';
let cityHolder;
submitButton.addEventListener('click', () => {
    displayWeather(city.value);
});

// Enter to submit
city.addEventListener('keypress', event => {
    if (event.key === "Enter") {
        submitButton.click();
    }
});

refreshButton.addEventListener('click', () => {
    displayWeather(cityHolder);
});

// Toggle Different Units
tempC.addEventListener('click', () => {
    tempF.classList.remove('active');
    tempC.classList.add('active');
    unit = 'uk';
    displayWeather(cityHolder);
});

tempF.addEventListener('click', () => {
    tempC.classList.remove('active');
    tempF.classList.add('active');
    unit = 'us';
    displayWeather(cityHolder);
});

// Return Weather Data for Location
async function getWeather(search) {
    const result = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search}?unitGroup=${unit}&key=3MCR6VGYN2JXJW7TCLCDHQM2Z`);
    const resultData = await result.json();
    const currentLocation = await resultData.resolvedAddress;
    const currentTemp = await resultData.currentConditions.temp;
    const currentFeel = await resultData.currentConditions.feelslike;
    const currentDescrip = await resultData.currentConditions.conditions;
    const currentSunrise = await resultData.currentConditions.sunrise;
    const currentSunset = await resultData.currentConditions.sunset;
    const currentRain = await resultData.currentConditions.precipprob;
    const currentUV = await resultData.currentConditions.uvindex;
    const currentIcon = await resultData.currentConditions.icon;
    const currentHigh = await resultData.days[0].tempmax;
    const currentLow = await resultData.days[0].tempmin;

    const nextDays = [];
    for (let i = 1; i < 8; i++) {
        const dayObject = {};
        dayObject.icon = await resultData.days[i].icon;
        dayObject.date = await resultData.days[i].datetime;
        dayObject.high = await resultData.days[i].tempmax;
        dayObject.low = await resultData.days[i].tempmin;

        nextDays.push(dayObject);
    }

    console.log(resultData);
    return {
        currentLocation,
        currentTemp,
        currentFeel,
        currentDescrip,
        currentSunrise,
        currentSunset,
        currentRain,
        currentUV,
        currentIcon,
        currentHigh,
        currentLow,
        nextDays,
    };
}

const leftContainer = document.getElementById('left-container');
const rightContainer = document.getElementById('right-container');
const daysContainer = document.getElementById('days-container');
const highlightContainer = document.getElementById('highlight-container');
const rainWrapper = document.getElementById('rain-wrapper');
const sunWrapper = document.getElementById('sun-wrapper');
const uvWrapper = document.getElementById('uv-wrapper');

function createDaysDiv(day) {
    const dayWrapper = document.createElement('div');
    dayWrapper.setAttribute('class', 'day-wrapper');

    const dayName = document.createElement('h4');
    const dateHolder = new Date(day.date).getDay();
    dayName.textContent = dayOfTheWeek(dateHolder);

    const dayIcon = document.createElement('img');
    dayIcon.setAttribute('src', `icons/${day.icon}.png`)

    const dayTemp = document.createElement('div');

    const dayHigh = document.createElement('div');
    dayHigh.textContent = day.high.toFixed() + '°' + ' |';

    const dayLow = document.createElement('div');
    dayLow.textContent = day.low.toFixed() + '°';

    dayTemp.appendChild(dayHigh);
    dayTemp.appendChild(dayLow);

    dayWrapper.appendChild(dayName);
    dayWrapper.appendChild(dayIcon);
    dayWrapper.appendChild(dayTemp);

    daysContainer.appendChild(dayWrapper);
}

function dayOfTheWeek(dayIndex) {
    switch (dayIndex) {
        case 0:
            return 'Sun';
        case 1:
            return 'Mon';
        case 2:
            return 'Tue';
        case 3:
            return 'Wed';
        case 4:
            return 'Thu';
        case 5:
            return 'Fri';
        case 6 :
            return 'Sat';
    }
}

function formatTime (timeString){
    const [hour, minute] = timeString.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const newHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${newHour}:${minute} ${period}`;
}

//DOM Function
function displayWeather(location) {
    let degree;
    if (unit === 'us') {
        degree = '°F';
    }
    if (unit === 'uk') {
        degree = '°C';
    }

    getWeather(location).then(value => {
    // Clear containers and wrappers
    leftContainer.textContent = '';
    rightContainer.textContent = '';
    daysContainer.innerHTML = '';
    rainWrapper.innerHTML = '';
    sunWrapper.innerHTML = '';
    uvWrapper.innerHTML = '';

    const displayLocation = document.createElement('div');
    displayLocation.classList.add('bold');
    displayLocation.setAttribute('id', 'location');
    displayLocation.textContent = value.currentLocation;

    const displayIcon = document.createElement('img');
    displayIcon.setAttribute('src', `icons/${value.currentIcon}.png`);

    const displayTemp = document.createElement('div');
    displayTemp.setAttribute('id', 'temp');
    displayTemp.classList.add('medium');
    displayTemp.textContent = value.currentTemp.toFixed() + degree;

    const displayDescrip = document.createElement('div');
    displayDescrip.textContent = value.currentDescrip;
    displayDescrip.setAttribute('id', 'descrip');

    const displayHiLo = document.createElement('div');
    displayHiLo.textContent = `H: ${value.currentHigh.toFixed()}° | L: ${value.currentLow.toFixed()}°`
    displayHiLo.classList.add('extra-info');

    const displayFeel = document.createElement('div');
    displayFeel.textContent = `Feels like: ${value.currentFeel.toFixed()}${degree}`;
    displayFeel.classList.add('extra-info');

    const titleForecast = document.createElement('h2');
    titleForecast.textContent = '7-Day Forecast';

    value.nextDays.map(day => createDaysDiv(day));
    
    const titleHighlight = document.createElement('h2');
    titleHighlight.textContent = 'Daily Highlights';

    const titleRain = document.createElement('p');
    titleRain.textContent = 'Rain Chance'
    const displayRain = document.createElement('div');
    displayRain.textContent = `${value.currentRain}%`;
    rainWrapper.appendChild(titleRain);
    rainWrapper.appendChild(displayRain);
    
    const titleSun = document.createElement('p');
    titleSun.textContent = 'Sunrise & Sunset';
    sunWrapper.appendChild(titleSun);

    const imgSunrise = document.createElement('img');
    imgSunrise.setAttribute('src', 'icons/sunrise.png');

    const textSunrise = document.createElement('div');
    textSunrise.textContent = formatTime(value.currentSunrise);

    const displaySunrise = document.createElement('div');
    displaySunrise.classList.add('sun', 'rise');
    displaySunrise.appendChild(imgSunrise);
    displaySunrise.appendChild(textSunrise);

    sunWrapper.appendChild(displaySunrise);

    const imgSunset = document.createElement('img');
    imgSunset.setAttribute('src', 'icons/sunset.png');

    const textSunset = document.createElement('div');
    textSunset.textContent = formatTime(value.currentSunset);

    const displaySunset = document.createElement('div');
    displaySunset.classList.add('sun', 'set');
    displaySunset.appendChild(imgSunset);
    displaySunset.appendChild(textSunset);

    sunWrapper.appendChild(displaySunset);
    
    const titleUV = document.createElement('p');
    titleUV.textContent = 'UV Index'
    const displayUV = document.createElement('div');
    displayUV.textContent = value.currentUV;
    uvWrapper.appendChild(titleUV);
    uvWrapper.appendChild(displayUV);

    leftContainer.appendChild(displayLocation);
    leftContainer.appendChild(displayIcon);
    leftContainer.appendChild(displayTemp);
    leftContainer.appendChild(displayDescrip);
    leftContainer.appendChild(displayFeel);
    leftContainer.appendChild(displayHiLo);
    
    highlightContainer.appendChild(rainWrapper);
    highlightContainer.appendChild(sunWrapper);
    highlightContainer.appendChild(uvWrapper);

    rightContainer.appendChild(titleForecast);
    rightContainer.appendChild(daysContainer);
    rightContainer.appendChild(titleHighlight);
    rightContainer.appendChild(highlightContainer);

    city.setCustomValidity('');
    city.classList.remove('error');
    
    })
    .catch(() => {
        city.setCustomValidity('Please enter valid location.')
        city.classList.add('error')
    });
}
city.value = 'Miami';
displayWeather('Miami', unit);

// Take Location (Form)
const city = document.querySelector('input');
const submitButton = document.getElementById('submit');
const refreshButton = document.getElementById('refresh');
const tempC = document.getElementById('cel');
const tempF = document.getElementById('fah');

let unit = 'us';

// Enter to submit
city.addEventListener('keypress', event => {
    if (event.key === "Enter") {
        submitButton.click();
    }
});

submitButton.addEventListener('click', () => {
    // Add error for not valid city value
    displayWeather(city.value, unit);
});

refreshButton.addEventListener('click', () => {
    displayWeather(city.value);
});

// Toggle Different Units
tempC.addEventListener('click', () => {
    tempC.classList.toggle('active');
    unit = 'uk';
    displayWeather(city.value);
});

tempF.addEventListener('click', () => {
    tempF.classList.toggle('active');
    unit = 'us';
    displayWeather(city.value);
});

// Return Weather Data for Location
async function getWeather(search) {
    //promise all?
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

    const nextDays = [];
    for (let i = 1; i < 8; i++) {
        const dayObject = {};
        dayObject.icon = await resultData.days[i].icon;
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

    // day of the week using datetime
    const dayIcon = document.createElement('div');
    dayIcon.textContent = day.icon;

    const dayTemp = document.createElement('div');

    const dayHigh = document.createElement('div');
    dayHigh.textContent = day.high;

    const dayLow = document.createElement('div');
    dayLow.textContent = day.low;

    dayTemp.appendChild(dayHigh);
    dayTemp.appendChild(dayLow);

    dayWrapper.appendChild(dayIcon);
    dayWrapper.appendChild(dayTemp);

    daysContainer.appendChild(dayWrapper);
}

//DOM Function
function displayWeather(location) {
    let degree;
    if (unit === 'us') {
        degree = 'F';
    }
    if (unit === 'uk') {
        degree = 'C'
    }

    getWeather(location).then(value => {
    // Clear containers and wrappers
    leftContainer.textContent = '';
    daysContainer.innerHTML = '';
    rainWrapper.innerHTML = '';
    sunWrapper.innerHTML = '';
    uvWrapper.innerHTML = '';

    const displayLocation = document.createElement('div');
    displayLocation.textContent = value.currentLocation;

    const displayIcon = document.createElement('div');

    const displayTemp = document.createElement('div');
    displayTemp.textContent = value.currentTemp + degree;

    const displayFeel = document.createElement('div');
    displayFeel.textContent = `Feels like: ${value.currentFeel}${degree}`;

    const displayDescrip = document.createElement('div');
    displayDescrip.textContent = value.currentDescrip;

    value.nextDays.map(day => createDaysDiv(day));

    const displayRain = document.createElement('div');
    displayRain.textContent = `Rain Chance: ${value.currentRain}%`;
    rainWrapper.appendChild(displayRain);

    const displaySunrise = document.createElement('div');
    displaySunrise.textContent = value.currentSunrise;
    sunWrapper.appendChild(displaySunrise);

    const displaySunset = document.createElement('div');
    displaySunset.textContent = value.currentSunset;
    sunWrapper.appendChild(displaySunset);

    const displayUV = document.createElement('div');
    displayUV.textContent = value.currentUV;
    uvWrapper.appendChild(displayUV);

    leftContainer.appendChild(displayLocation);
    leftContainer.appendChild(displayIcon);
    leftContainer.appendChild(displayTemp);
    leftContainer.appendChild(displayFeel);
    leftContainer.appendChild(displayDescrip);



    highlightContainer.appendChild(rainWrapper);
    highlightContainer.appendChild(sunWrapper);
    highlightContainer.appendChild(uvWrapper);

    rightContainer.appendChild(daysContainer);
    rightContainer.appendChild(highlightContainer);
});
}

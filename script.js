// API Interacting Functions - console.log for now

// Take Location (Form)
const city = document.querySelector('input');
const button = document.querySelector('button');
const container = document.getElementById('container')

// Enter to submit
city.addEventListener('keypress', event => {
    if (event.key === "Enter"){
        button.click();
    }
});

button.addEventListener('click', () => {
    // Add error for not valid city value
    displayWeather(city.value);
});

// Return Weather Data for Location
async function getWeather(search) {
    // optional parameter
    // unitGroup=metric for C vs F
    const result = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search}?key=3MCR6VGYN2JXJW7TCLCDHQM2Z`)
    const resultData = await result.json();
    const currentLocation = await resultData.resolvedAddress;
    const currentTemp = await resultData.currentConditions.temp;
    const currentFeel = await resultData.currentConditions.feelslike;
    const currentDescrip = await resultData.currentConditions.conditions;
    console.log(resultData);
    return {
        currentLocation,
        currentTemp,
        currentFeel,
        currentDescrip,
    };
}

//DOM Function
function displayWeather(location) {
    // if C or F change value next to temps
    getWeather(location).then((value) => {
    container.textContent = '';

    const displayLocation = document.createElement('div');
    displayLocation.textContent = value.currentLocation;

    const displayTemp = document.createElement('div');
    displayTemp.textContent = value.currentTemp;

    const displayFeel = document.createElement('div');
    displayFeel.textContent = `Feels like: ${value.currentFeel}`;

    const displayDescrip = document.createElement('div');
    displayDescrip.textContent = value.currentDescrip;

    container.appendChild(displayLocation);
    container.appendChild(displayTemp);
    container.appendChild(displayFeel);
    container.appendChild(displayDescrip);
});
}

// Process JSON from API - Return what's necessary


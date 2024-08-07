document.addEventListener('DOMContentLoaded', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherByLocation, showError);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherDataByCity(city);
    } else {
        showAlert('Please enter a city name.');
    }
});

function getWeatherByLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeatherData(lat, lon);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            showAlert('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            showAlert('Location information is unavailable.');
            break;
        case error.TIMEOUT:
            showAlert('The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            showAlert('An unknown error occurred.');
            break;
    }
}

function fetchWeatherData(lat, lon) {
    const apiKey = '30d0f926ca133330ead2e2c213e6ea02';
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateWeatherCard(data);
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            showAlert('An error occurred while fetching the weather data.');
        });
}

function fetchWeatherDataByCity(city) {
    const apiKey = '30d0f926ca133330ead2e2c213e6ea02';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateWeatherCard(data);
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            if (!navigator.onLine) {
                showAlert('You are not connected to the internet.');
            } else {
                showAlert('An error occurred while fetching the weather data. Please try again.');
            }
        });
}

function updateWeatherCard(data) {
    document.querySelector('.city-name').textContent = data.name;
    document.querySelector('.temperature').innerHTML = `${Math.round(data.main.temp - 273.15)}&deg;C`;
    document.querySelector('.description').textContent = data.weather[0].description;
    document.querySelector('.min-max').innerHTML = `Min: ${Math.round(data.main.temp_min - 273.15)}&deg;C / Max: ${Math.round(data.main.temp_max - 273.15)}&deg;C`;
    document.querySelector('.humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    document.getElementById('favicon').href = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    document.getElementById('city-input').value = '';
}

function showAlert(message) {
    alert(message);
}

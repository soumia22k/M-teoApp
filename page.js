// Clé API OpenWeatherMap
const API_KEY = 'VOTRE_CLE_API';

// Sélection des éléments HTML
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const weatherIcon = document.getElementById('weather-icon');
const currentTemp = document.getElementById('current-temp');
const forecastRow = document.querySelector('#forecast .row');

// Fonction pour récupérer et afficher la météo
async function fetchWeather(city) {
    try {
        // Récupération des données météo actuelles
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=fr`);
        const data = await response.json();

        // Mise à jour des données actuelles
        cityName.textContent = data.name;
        currentDate.textContent = new Date().toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        weatherIcon.textContent = getWeatherIcon(data.weather[0].main);
        currentTemp.textContent = `${Math.round(data.main.temp)}°C`;

        // Récupération des prévisions
        fetchForecast(city);
    } catch (error) {
        alert('Erreur lors du chargement des données météo !');
    }
}

// Fonction pour récupérer les prévisions météo
async function fetchForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}&lang=fr`);
    const data = await response.json();

    // Nettoyage des anciennes prévisions
    forecastRow.innerHTML = '';

    // Ajout des prévisions (1 par jour)
    data.list.slice(0, 5).forEach((forecast) => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div>${new Date(forecast.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
            <div>${Math.round(forecast.main.temp)}°C</div>
        `;
        forecastRow.appendChild(col);
    });
}

// Fonction pour obtenir un icône météo
function getWeatherIcon(condition) {
    const icons = {
        Clear: '☀️',
        Clouds: '☁️',
        Rain: '🌧️',
        Snow: '❄️',
        Thunderstorm: '⚡',
        Drizzle: '🌦️',
        Mist: '🌫️',
    };
    return icons[condition] || '🌍';
}

// Appel initial (avec une ville par défaut)
fetchWeather('Beni Mellal');

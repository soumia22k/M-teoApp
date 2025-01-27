const API_KEY = "3b8c50adbc06805ab1e55b38a2dbd910"; // Remplacez par votre clé API OpenWeatherMap
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";
const DEFAULT_CITY = "Beni Mellal";

// Fonction pour récupérer la météo actuelle
async function fetchCurrentWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`);
        if (!response.ok) {
            console.error("API Response Error:", await response.json());
            throw new Error("Erreur lors de la récupération des données météo.");
        }
        return response.json();
    } catch (error) {
        console.error("Fetch Error:", error);
        alert(error.message);
    }
}

// Fonction pour récupérer les prévisions météo
async function fetchWeatherForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`);
        console.log("URL utilisée :", `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`);
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erreur API :", errorData);
            throw new Error(errorData.message || "Erreur lors de la récupération des prévisions météo.");
        }
        return response.json();
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
        alert(error.message);
    }
}


// Mise à jour des données météo actuelles
function updateCurrentWeather(data) {
    const { name, main, weather, wind } = data;
    document.querySelector(".weather-info h2").textContent = name;
    document.querySelector(".weather-info p").textContent = new Date().toLocaleString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    document.querySelector(".weather-info .temperature").innerHTML = `${Math.round(main.temp)}&deg; <img src='http://openweathermap.org/img/wn/${weather[0].icon}@2x.png' alt='${weather[0].description}'>`;
    document.querySelector(".weather-info .details div:nth-child(1) p").textContent = `${wind.speed} Km/h`;
    document.querySelector(".weather-info .details div:nth-child(2) p").textContent = `${main.humidity}%`;
}

// Mise à jour des prévisions météo
function updateForecast(data) {
    const forecastSection = document.querySelector(".forecast");
    forecastSection.innerHTML = ""; // Clear existing content

    data.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString("fr-FR", { weekday: "short" });
        const forecastDiv = document.createElement("div");
        forecastDiv.innerHTML = `
            <span>${day}.</span>
            <span>${Math.round(item.main.temp_max)}&deg; / ${Math.round(item.main.temp_min)}&deg;</span>
        `;
        forecastSection.appendChild(forecastDiv);
    });
}

// Chargement initial des données météo
async function loadWeatherData(city = DEFAULT_CITY) {
    const currentWeather = await fetchCurrentWeather(city);
    if (currentWeather) updateCurrentWeather(currentWeather);

    const forecastData = await fetchWeatherForecast(city);
    if (forecastData) updateForecast(forecastData);
}

// Gestion des événements pour les boutons
document.getElementById("home-btn").addEventListener("click", () => loadWeatherData(DEFAULT_CITY));
document.getElementById("search-btn").addEventListener("click", () => {
    const city = document.getElementById("city-input").value.trim();
    if (city) {
        loadWeatherData(city);
    } else {
        alert("Veuillez entrer un nom de ville.");
    }
});

// Initialisation
loadWeatherData();

const API_KEY = "3b8c50adbc06805ab1e55b38a2dbd910";

function displayBtn() {
    const city = document.getElementById('input').value.trim();
    if (city) {
        displayData(city);
    } else {
        alert("Veuillez entrer une ville !");
    }
}

function displayData(city) {
    const cityElem = document.getElementById('city');
    const countryElem = document.getElementById('country');
    const tempElem = document.getElementById('tmp');
    const humidityElem = document.getElementById('humidity');
    const windElem = document.getElementById('wind');
    const forecastContainer = document.querySelector('.forecast');

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fr`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ville non trouvée !");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            cityElem.textContent = data.city.name;
            countryElem.textContent = data.city.country;
            tempElem.textContent = data.list[0].main.temp + "°C";
            windElem.textContent = data.list[0].wind.speed + " km/h";
            humidityElem.textContent = data.list[0].main.humidity + "%";

            forecastContainer.innerHTML = '';
            const days = {};

            data.list.forEach(weatherData => {
                const date = new Date(weatherData.dt_txt);
                const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });

                if (!days[day]) {
                    days[day] = weatherData;
                    forecastContainer.innerHTML += `
                        <div class="weather-forecast-item">
                            <div class="day">${day}</div>
                            <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="Weather Icon">
                            <div class="temp">Min: ${Math.round(weatherData.main.temp_min)}°C</div>
                            <div class="temp">Max: ${Math.round(weatherData.main.temp_max)}°C</div>
                        </div>
                    `;
                }
            });
        })
        .catch(error => {
            alert(error.message);
        });
}

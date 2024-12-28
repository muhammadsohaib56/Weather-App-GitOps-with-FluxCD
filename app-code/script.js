const searchButton = document.getElementById("search-button");
const weatherInfo = document.getElementById("weather-info");
const weatherForecast = document.getElementById("weather-forecast");
const dateTimeElement = document.getElementById("date-time");

// Function to update date and time
function updateDateTime() {
  const currentDate = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  dateTimeElement.textContent = formattedDate;
}

// Initial call to update date and time
updateDateTime();
setInterval(updateDateTime, 1000);

searchButton.addEventListener("click", () => {
  const cityName = document.getElementById("city-name").value;
  if (cityName === "") {
    weatherInfo.innerHTML = "<p class='error'>Please enter a city name.</p>";
    return;
  }

  const apiKey = "9920008360e6212a01a59fd9eb579f46";

  // Fetch current weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${data.weather[0].description}</p>
        <p>Temperature: ${Math.round(data.main.temp - 273.15)}°C / ${Math.round((data.main.temp - 273.15) * 9/5 + 32)}°F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind speed: ${data.wind.speed} m/s</p>
        <p>Air pressure: ${data.main.pressure} hPa</p>
        <p>Visibility: ${data.visibility} m</p>
        <p>Chance of precipitation: ${data.clouds.all}%</p>
        <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
      `;
    })
    .catch(() => {
      weatherInfo.innerHTML = "<p class='error'>An error occurred. Please try again.</p>";
    });

  // Fetch forecast data
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const forecastElements = data.list.filter((_, index) => index % 8 === 0).map(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const temp = Math.round(forecast.main.temp - 273.15);
        const iconCode = forecast.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        return `
          <div class="forecast-day">
            <p>${dayOfWeek}, ${formattedDate}</p>
            <img class="forecast-icon" src="${iconUrl}" alt="${forecast.weather[0].description}">
            <p class="forecast-temp">${temp}°C</p>
          </div>
        `;
      });
      weatherForecast.innerHTML = forecastElements.join('');
    })
    .catch(() => {
      weatherForecast.innerHTML = "<p class='error'>An error occurred while fetching the weather forecast. Please try again.</p>";
    });
});

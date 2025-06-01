async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    document.getElementById("weatherResult").innerHTML = "<p>Please enter a city or village name.</p>";
    return;
  }

  const apiKey = "7dbb1a98edb9fcac6335adab32740d46";  
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(weatherURL);
    const data = await response.json();

    if (data.cod === 200) {
      const weatherDescription = data.weather[0].description;
      let rainAlert = "";

      if (weatherDescription.toLowerCase().includes("rain")) {
        rainAlert = "<p style='color:red;'>🌧️ Rain Alert: Rain expected. Please take precautions.</p>";
      }

      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const pollutionURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      const pollutionRes = await fetch(pollutionURL);
      const pollutionData = await pollutionRes.json();
      const aqi = pollutionData.list[0].main.aqi;

      let airQuality = "";
      switch (aqi) {
        case 1: airQuality = "Good "; break;
        case 2: airQuality = "Fair "; break;
        case 3: airQuality = "Moderate "; break;
        case 4: airQuality = "Poor "; break;
        case 5: airQuality = "Very Poor "; break;
        default: airQuality = "Unknown";
      }

      const result = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${weatherDescription}</p>
        ${rainAlert}
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Air Quality Index (AQI): ${airQuality}</p>
      `;

      document.getElementById("weatherResult").innerHTML = result;
    } else {
      document.getElementById("weatherResult").innerHTML = `<p>City or village not found. Please try again.</p>`;
    }
  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<p>Error fetching data. Please check your internet or API key.</p>`;
  }
}

function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = function (event) {
    const city = event.results[0][0].transcript;
    document.getElementById("cityInput").value = city;
    getWeather();
  };
  recognition.onerror = function () {
    alert("Voice input failed. Please try again.");
  };
}

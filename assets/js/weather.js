let cityList = document.getElementById('city-list');
let cityDateImg = document.getElementById('cityDateImg');
let fiveDayForecast = document.getElementById('five-day-forecast');
let fiveDay = document.getElementById('fiveDay');

function listItemHandler(e) {
  e.preventDefault();

  let loc = document.getElementById('searchCity');
  loc.value = e.target.attributes.value.value;
  // if city from list is selected, fire-off search
  searchHandler(e);
}

function saveCityNameToLocalStorage(city) {
  let isPresent = false;
  let cityStore = JSON.parse(localStorage.getItem('weatherDashboard')) || [];
  for (let i = 0; i < cityStore.length; i++) {
    if (city === cityStore[i]) {
      isPresent = true;
      break;
    }
  }

  if (!isPresent && city != null) {
    cityStore.push(city);
    localStorage.setItem('weatherDashboard', JSON.stringify(cityStore));

    loadWeatherStorage();
  }

}

function loadWeatherStorage() {
  let cities = JSON.parse( localStorage.getItem('weatherDashboard')) || [];
  cityList.textContent = "";
  for (let i = 0; i < cities.length; i++) {
    let city = document.createElement('li');
    city.textContent = cities[i];
    city.setAttribute( 'value', cities[i]);
    city.addEventListener('click', listItemHandler);
    cityList.appendChild(city);
  }
}

function setBackground(uvi) {
  let color = 'white';
  switch(Math.round(uvi)) {
    case 0:
    case 1:
    case 2: color = 'green'; break;
    case 3:
    case 4:
    case 5: color = 'yellow'; break;
    case 6:
    case 7: color = 'orange'; break;
    case 8:
    case 9:
    case 10: color = 'lightcoral'; break
    case(11): color = 'red';
  }
  return color;
}

function searchHandler(e) {
  e.preventDefault();

  let city = document.getElementById('searchCity').value;
  
  fetch('https://api.openweathermap.org/data/2.5/weather?q=' 
    + city 
    + ',us&APPID=38502b70b289d62a156e29aa933997f8&units=imperial')
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    let tempDate = moment();
    cityDateImg.textContent = response.name + "  (" + tempDate.format('MM/DD/YYYY') + ")  ";
    // save city in list if not already there
    if (response.cod === "404") {
      
    }
    saveCityNameToLocalStorage(response.name);

    let imgEl = document.createElement('img');
    imgEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png');
    imgEl.setAttribute('height', 32);
    imgEl.setAttribute('width', 32);
    cityDateImg.appendChild(imgEl);
  
    return fetch('https://api.openweathermap.org/data/2.5/onecall?lat='
    + response.coord.lat + '&lon=' + response.coord.lon 
    + '&appid=38502b70b289d62a156e29aa933997f8&units=imperial');
    
  })
  .then((oneCallResponse) => {
    return oneCallResponse.json();
  })
  .then (oneCallResponse => {
    let currentTemp = document.getElementById('currentTemp');
    currentTemp.textContent = "Current Temp: " + Math.round(oneCallResponse.current.temp) + " F";

    let humidity = document.getElementById('humidity');
    humidity.textContent = "Humidity: " + oneCallResponse.current.humidity + "%";

    let windSpeed = document.getElementById('windSpeed');
    windSpeed.textContent = "Wind Speed: " + oneCallResponse.current.wind_speed + " MPH";

    let uv =document.getElementById('uv');
    color = setBackground(oneCallResponse.current.uvi);
    uv.setAttribute('style',' color:black; background: ' + color +';');
    uv.textContent = "UV Index: " + oneCallResponse.current.uvi;

    // build 5 day forecast
    fiveDay.textContent = "5-Day Forecast:";
    for (let i = 1; i <= 5; i++) {
      let date = new Date(oneCallResponse.daily[i].dt * 1000);

      let card = document.getElementById("card-"+i);
      card.textContent = "";
      let cardBody = document.createElement('div');
      cardBody.setAttribute('class', 'card-body');
      let cardTitle = document.createElement('p');
      cardTitle.setAttribute('class', 'card-title');
      cardTitle.textContent = date.toLocaleDateString();
      cardBody.appendChild(cardTitle);

      let imgEl = document.createElement('img');
      imgEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + oneCallResponse.daily[i].weather[0].icon + '@2x.png');
      imgEl.setAttribute('height', 32);
      imgEl.setAttribute('width', 32);
      cardBody.appendChild(imgEl);

      let dayTemp = document.createElement('p');
      dayTemp.textContent = "Temp: " + Math.round(oneCallResponse.daily[i].temp.day) + " F";
      cardBody.appendChild(dayTemp);

      let dayHumidity = document.createElement('p');
      dayHumidity.textContent = "Humidity: " + oneCallResponse.daily[i].humidity + "%";
      cardBody.appendChild(dayHumidity);
  
      card.appendChild(cardBody);
      fiveDayForecast.appendChild(card);
      }
  });
}



document.getElementById("search").addEventListener('click', searchHandler);

loadWeatherStorage();


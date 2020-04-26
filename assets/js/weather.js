let cityList = document.getElementById('city-list');
//http://openweathermap.org/img/wn/10d@2x.png

function initializeStorage() {
  let primer = [{'city':'Austin', 'cityId':'', }, {'city':'Anaheim', 'cityId':''}];
  localStorage.setItem("weatherDashboard", JSON.stringify(primer));
}

//initializeStorage();

function listItemHandler(e) {
  e.preventDefault();

  console.log(e.target.attributes.value);
  let loc = document.getElementById('searchCity');
  loc.value = e.target.attributes.value.value;
}

function loadWeatherStorage() {
  let cities = JSON.parse( localStorage.getItem('weatherDashboard'));

  for (let i = 0; i < cities.length; i++) {
    console.log(cities[i].city);
    let city = document.createElement('li');
    city.textContent = cities[i].city;
    city.setAttribute( 'value', cities[i].city);
    city.addEventListener('click', listItemHandler);
    cityList.appendChild(city);
  }
}

function searchHandler(e) {
  e.preventDefault();
  console.log("search");
  let city = document.getElementById('searchCity').value;
console.log("sH city="+city);
console.log('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=38502b70b289d62a156e29aa933997f8');
  
  fetch('https://api.openweathermap.org/data/2.5/weather?q=' 
    + city 
    + ',us&APPID=38502b70b289d62a156e29aa933997f8&units=imperial')
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    console.log(response);
    console.log("id="+response.id);
    console.log("name="+response.name);
    console.log("feels="+response.main.feels_like);
    console.log("temp = "+response.main.temp);
    console.log("icon="+response.weather[0].icon);
    console.log("lat, lon="+response.coord.lat+", "+response.coord.lon);

    let detailCity = document.getElementById('detailCity');
    //let currentDateTime = document.getElementById('currentDateTime');
    let tempDate = moment();
    detailCity.textContent = response.name + "  (" + tempDate.format('MM/DD/YYYY') + ")  ";
    let cityDateImg = document.querySelector('.city-date-img');
    let imgEl = document.createElement('img');
    imgEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png');
    imgEl.setAttribute('height', 32);
    imgEl.setAttribute('width', 32);
    cityDateImg.appendChild(imgEl);
    //currentDateTime.textContent = tempDate.format('MM/DD/YYYY');

    let currentTemp = document.getElementById('currentTemp');
    currentTemp.textContent = "Current Temp: " + Math.round(response.main.temp) + " F";

    let humidity = document.getElementById('humidity');
    humidity.textContent = "Humidity: " + response.main.humidity + "%";

    let windSpeed = document.getElementById('windSpeed');
    windSpeed.textContent = "Wind Speed: " + response.wind.speed + " MPH";

    const uvFetch = 'https://api.openweathermap.org/data/2.5/uvi/forecast?appid=38502b70b289d62a156e29aa933997f8' +
    '&lat=' + response.coord.lat + '&lon=' + response.coord.lon;
    console.log("uvF="+uvFetch);
    return fetch(uvFetch);
  })
  .then((uvResponse) => {
    return uvResponse.json();
  })
  .then (uvResponse => {
    console.log("uv val="+uvResponse[0].value);
    let uv =document.getElementById('uv');
    uv.textContent = "UV Index: " + uvResponse[0].value;
  });
}

document.getElementById("search").addEventListener('click', searchHandler);

loadWeatherStorage();

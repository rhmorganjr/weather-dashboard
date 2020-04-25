let cityList = document.getElementById('city-list');


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

    let detailCity = document.getElementById('detailCity');
    detailCity.textContent = response.name;

    let currentDateTime = document.getElementById('currentDateTime');
    let tempDate = moment();//response.dt;
    console.log("tempDate="+tempDate);
    currentDateTime.textContent = tempDate.format('MM/DD/YYYY');

    let currentTemp = document.getElementById('currentTemp');
    currentTemp.textContent = "Current Temp: " + Math.round(response.main.temp) + " F";

    let humidity = document.getElementById('humidity');
    humidity.textContent = "Humidity: " + response.main.humidity + "%";

    let windSpeed = document.getElementById('windSpeed');
    windSpeed.textContent = "Wind Speed: " + response.wind.speed + " MPH";
  });
}

document.getElementById("search").addEventListener('click', searchHandler);

loadWeatherStorage();

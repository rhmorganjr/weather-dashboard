let cityList = document.getElementById('city-list');


function initializeStorage() {
  let primer = [{'city':'Austin', 'cityId':'', }, {'city':'Anaheim', 'cityId':''}];
  localStorage.setItem("weatherDashboard", JSON.stringify(primer));
}

//initializeStorage();

function listItemHandler(e) {
  e.preventDefault();

  console.log(e.target.attributes.value);
  let loc = document.getElementById('city');
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

function searchHandler() {
  console.log("search");
}

document.getElementById("search").addEventListener('click', searchHandler);

loadWeatherStorage();

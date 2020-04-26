let cityList = document.getElementById('city-list');
let cityDateImg = document.getElementById('cityDateImg');


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

    let tempDate = moment();
    cityDateImg.textContent = response.name + "  (" + tempDate.format('MM/DD/YYYY') + ")  ";
    
    let imgEl = document.createElement('img');
    imgEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png');
    imgEl.setAttribute('height', 32);
    imgEl.setAttribute('width', 32);
    cityDateImg.appendChild(imgEl);
  
    //fetch('https://api.openweathermap.org/data/2.5/onecall?lat='
    //+ response.coord.lat + '&lon=' + response.coord.lon + '&appid=38502b70b289d62a156e29aa933997f8&units=imperial');

    return fetch('https://api.openweathermap.org/data/2.5/onecall?lat='
    + response.coord.lat + '&lon=' + response.coord.lon 
    + '&appid=38502b70b289d62a156e29aa933997f8&units=imperial');
    
  })
  .then((oneCallResponse) => {
    return oneCallResponse.json();
  })
  .then (oneCallResponse => {
    console.log("1callR="+oneCallResponse);
    let currentTemp = document.getElementById('currentTemp');
    currentTemp.textContent = "Current Temp: " + Math.round(oneCallResponse.current.temp) + " F";

    let humidity = document.getElementById('humidity');
    humidity.textContent = "Humidity: " + oneCallResponse.current.humidity + "%";

    let windSpeed = document.getElementById('windSpeed');
    windSpeed.textContent = "Wind Speed: " + oneCallResponse.current.wind_speed + " MPH";

    console.log("oneCall: "+oneCallResponse);
    console.log("uv val="+oneCallResponse.current.uvi);
    let uv =document.getElementById('uv');
    uv.textContent = "UV Index: " + oneCallResponse.current.uvi;


    console.log("pressure="+oneCallResponse.daily[0].pressure);

    console.log("dt="+oneCallResponse.current.dt);
    let date = new Date(oneCallResponse.daily[0].dt * 1000);
    console.log((new Date(oneCallResponse.daily[1].dt * 1000)).toLocaleString());
    console.log((new Date(oneCallResponse.daily[2].dt * 1000)).toLocaleString());
    console.log((new Date(oneCallResponse.daily[3].dt * 1000)).toLocaleString());
    console.log((new Date(oneCallResponse.daily[4].dt * 1000)).toLocaleString());
    console.log((new Date(oneCallResponse.daily[5].dt * 1000)).toLocaleString());
  });
}



document.getElementById("search").addEventListener('click', searchHandler);

loadWeatherStorage();


function initializeStorage() {
  let primer = [{'city':'Austin', 'lastSearch':''},
            {'city':'Anaheim', 'lastSearch':''},
            {'city':'San Antonio', 'lastSearch':''},
            {'city':'Paris', 'lastSearch':''}
  ];
  localStorage.setItem("weatherDashboard", JSON.stringify(primer));
}

//initializeStorage();


//API Key from https://openweathermap.org/api
let keys = 'd7f8c15a29a9d9e360522ebd5ef53707';


// cities from local storage and render below search
function renderCities() {
  for (let i = 0; i < localStorage.length; i++) {
    let city = localStorage.getItem(localStorage.key(i));
    let cityListItem = document.createElement('a');
    cityListItem.innerHTML = `
    <a> href="#!" class="collection-item" id=${city}>${city}</a>
    `;

    document.getElementById('collections').append(cityListItem);

  }
}



//temperatue to fahrenheit
function kelvinToFahrenheit(num) {
  return parseInt((num - 273.15) * (9 / 5) + 32);
}

//rearch history
renderCities();

// search bar 
document.getElementById('searchBut').addEventListener('click', event => {

  event.preventDefault();

  document.getElementById('card').style.visibility = 'visible';

  let todayDate;

  let coordinates = [];

  //fetch for current weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${document.getElementById('search').value}&appid=${keys}`)
    .then(r => r.json())
    .then(data => {

      coordinates.push(data.coord.lon);
      coordinates.push(data.coord.lat);

      fahrenheit = kelvinToFahrenheit(Number(data.main.temp))


      //moment.js transfer unix date
      todayDate = moment.unix(data.dt).format('MM/DD/YYYY');

      document.getElementById('cityName').textContent = data.name + ' ' + todayDate;
      document.getElementById('weatherImg').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      document.getElementById('temperature').textContent = fahrenheit;
      document.getElementById('hummidity').textContent = data.main.humidity;
      document.getElementById('windSpeed').textContent = data.wind.speed;

      //add search history
      let cityLink = document.createElement('a');
      cityLink.innerHTML = `<a href="#!" class="collection-item" id=${data.name}>${data.name}</a>`;

      document.getElementById('collections').append(cityLink);
      //set local storage
      localStorage.setItem(`${data.name}`, `${data.name}`)
      //clear search button
      document.getElementById('search').value = '';



      //fetch request for uv index
      fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${keys}&lat=${coordinates[1]}&lon=${coordinates[0]}`)
        .then(r => r.json())
        .then(data => {

          document.getElementById('uv').textContent = data.value;
        })
        .catch(e => console.error(e));


      //fetch for 5 days forecast
      fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=${keys}&lat=${coordinates[1]}&lon=${coordinates[0]}`)
        .then(r => r.json())
        .then(({ list }) => {

          //clear history forecast
          document.getElementById('forecastDisplay').innerHTML = '';


          //make a new card
          let heading = document.createElement('h4');
          heading.textContent = '5-Days Forecast: ';

          document.getElementById('forecastDisplay').append(heading);

          //array of hourly forecast
          for (let i = 0; i < list.length; i++) {

            //set current date 
            let date = moment.unix(list[i].dt).format("MM/DD/YYYY");


            if ((date === todayDate) || (i > 0 && (date === moment.unix((list[i - 1].dt)).format("MM/DD/YYYY")))) {

              continue;

            } else {

              let forecastCard = document.createElement('div');
              let temperatueFahrenheit = kelvinToFahrenheit(Number(list[i].main.temp))


              forecastCard.classList = 'col s12 m4';
              forecastCard.innerHTML = `
            <div class="card small light-blue lighten-4">
            <h6><strong>${moment.unix(list[i].dt).format("MM/DD/YYYY")}</strong></h6> 
               <img src="https://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png" alt='${list[i].weather[0].description}' id='img'>
               <p>Temperatue: ${temperatueFahrenheit}°F</p>
               <p>Humidity: ${list[i].main.humidity}%</p>
            </div>   
            </div>
            `

              document.getElementById('forecastDisplay').append(forecastCard);

            }

          }
        })

        .catch(e => console.error(e));

    })

    .catch(e => console.error(e))


})

document.getElementsByClassName('collection-item').addEventListener("click", event => {
  document.getElementById('searchBut').value = localStorage.getItem(event.target.id);
  document.getElementById('searchBut').click();
})





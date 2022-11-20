const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const today = new Date();

const time =
  today.getHours().toString().padStart(2, "0") +
  ":" +
  today.getMinutes().toString().padStart(2, "0");
const date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
const fullDate = date;

timeEl.innerHTML = time;
dateEl.innerHTML = fullDate;

function getOpenWeatherData(cityID) {
  document.getElementById("futureForecast").classList.remove("hidden");
  const cityName = document.getElementById("cityName");
  cityID = cityName.value;
  const key = "46d4b7c5d34fa20f4e66d522546c5d5f";
  mockApi = "http://127.0.0.1:8000/api.json";

  apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?id=" +
    cityID +
    "&appid=" +
    key +
    "&units=metric";
  fetch(apiUrl)
    .then(function (resp) {
      return resp.json();
    }) // Convert data to json
    .then(function (data) {
      // console.log(data);
      timeZone.innerHTML = data.city.name;
      coordLon.innerHTML = data.city.coord.lon;
      coordLat.innerHTML = data.city.coord.lat;

      const list = data.list;

      let dataDate = new Date(list[0].dt_txt);

      let fullQueryDate =
        date +
        "-" +
        time +
        "-" +
        today.getSeconds().toString().padStart(2, "0");

      queryDate.innerHTML = fullQueryDate;

      currentDay.innerHTML = dataDate.toLocaleString("hu", { weekday: "long" });

      currentMinTemp.innerHTML = Math.round(list[0].main.temp_min);
      currentMaxTemp.innerHTML = Math.round(list[0].main.temp_max);
      temperature.innerHTML = Math.round(list[0].main.temp);
      pressure.innerHTML = list[0].main.pressure;
      humidity.innerHTML = list[0].main.humidity;
      windLine.innerHTML = list[0].wind.speed;
      cloudCover.innerHTML = list[0].weather[0].description;
      cloudInfo.innerHTML = list[0].weather[0].main;

      if (list[0].rain) {
        rainfallAmount.innerHTML = list[0].rain["3h"] + "mm";
      } else {
        rainfallAmount.innerHTML = "0 mm";
      }

      let grouppedObject = {};

      //Végigmegyek a list objecten a következő naptől, a dátumot (10 karakter) használom arra hogy
      //az aktuális dátum objectnbe beletegyek 8 elemü objektumot (3 óránkénti sávok) és azon belül kiveszem a nekem szükséges adatokat
      list.slice(1).forEach((element) => {
        const forecastedDataTime = element.dt_txt.substring(0, 10);
        grouppedObject[forecastedDataTime] =
          grouppedObject[forecastedDataTime] || [];

        grouppedObject[forecastedDataTime].push({
          temp_min: element.main.temp_min,
          temp_max: element.main.temp_max,
        });
      });

      let dateObject = {};

      //kulcs érték pár objektum -- végigiterálunk a grouppedObject-en aminek a kulcsa a dátum
      //és a dateObject-en kulcsa szintén a dátum és azon belül beállítjuk a kulcs érték párokat
      // a min és max értéket beállítjuk a legmagasabb maxra és a legalacsonyabb min-re

      Object.keys(grouppedObject).forEach((key) => {
        dateObject[key] = {
          day: new Date(key).toLocaleString("hu", { weekday: "long" }),
        };

        dateObject[key].temp_min = grouppedObject[key][0].temp_min;
        dateObject[key].temp_max = grouppedObject[key][0].temp_max;

        //min és max kiválasztás a két objektumban
        for (let i = 0; i < grouppedObject[key].length; i++) {
          if (grouppedObject[key][i].temp_min < dateObject[key].temp_min) {
            dateObject[key].temp_min = grouppedObject[key][i].temp_min;
          }

          if (grouppedObject[key][i].temp_max > dateObject[key].temp_max) {
            dateObject[key].temp_max = grouppedObject[key][i].temp_max;
          }
        }
      });

      const cards = document.querySelectorAll(".weather-forecast-item");

      Object.keys(dateObject).forEach((key, i) => {
        if (!cards[i]) {
          return;
        }
        cards[i].querySelector(".day").innerHTML = dateObject[key]["day"];
        cards[i].querySelector(".min-temp").innerHTML =
          dateObject[key]["temp_min"];
        cards[i].querySelector(".max-temp").innerHTML =
          dateObject[key]["temp_max"];
      });
    });
}

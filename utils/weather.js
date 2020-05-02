const config = require("../config");
const comm = require("../control/comm");
const owm = require("openweathermap-node");
const weather = new owm({
  APPID: config.OPENWEATHER_KEY,
});

module.exports = async (socket, message) => {
  const zipRegex = /^\d{5}$|^\d{5}-\d{4}$/;

  if (zipRegex.test(message)) {
    // zip code
    weather.getCurrentWeatherByZipCode(
      parseInt(message),
      (err, currentWeather) => {
        if (err) {
          comm(socket, `Weather API returned error. Message: ${err}.`, "error");
        } else {
          comm(
            socket,
            `Weather in ${currentWeather.name} is currently ${parseWeather(
              currentWeather
            )}`,
            "success"
          );
        }
      }
    );

    weather.getThreeHourForecastByZipCode(
      parseInt(message),
      (err, threeHourForecast) => {
        if (err) {
          comm(
            socket,
            `Weather forcast API returned error. Message: ${err}.`,
            "error"
          );
        } else {
          comm(
            socket,
            `In three hours, the weather will be ${parseWeather(
              threeHourForecast.list[threeHourForecast.list.length - 1]
            )}`,
            "success"
          );
        }

        socket.emit("end");
      }
    );
  } else {
    weather.getCurrentWeatherByCityName(message, (err, currentWeather) => {
      if (err) {
        comm(socket, `Weather API returned error. ${err}.`, "error");
      } else {
        comm(
          socket,
          `Weather in ${currentWeather.name} is currently ${parseWeather(
            currentWeather
          )}`,
          "success"
        );
      }
    });

    weather.getThreeHourForecastByCityName(
      message,
      (err, threeHourForecast) => {
        if (err) {
          comm(
            socket,
            `Weather forcast API returned error. ${err}.`,
            "error"
          );
        } else {
          comm(
            socket,
            `In three hours, the weather will be ${parseWeather(
              threeHourForecast.list[threeHourForecast.list.length - 1]
            )}`,
            "success"
          );
        }
        socket.emit("end");
      }
    );
  }
};

let parseWeather = (weather) => {
  return `${
    weather.weather[0].description
  }, with temperatures ranging between ${kToF(
    weather.main.temp_min
  )} °F and ${kToF(weather.main.temp_max)} °F, but feeling like ${kToF(
    weather.main.feels_like
  )} °F. Wind speed is ${weather.wind.speed} mph.`;
};

let kToF = (k) => {
  return (((k - 273.15) * 9) / 5 + 32).toFixed(1);
};

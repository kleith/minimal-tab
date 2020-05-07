import Api from "utils/Api";
import storage from "utils/Storage";
import { compare } from "utils/dates";
import { WEATHER, WEATHER_MINUTES_EXPIRED, ONECALL, ONECALL_HOURS_EXPIRED } from "constant";

const {
  REACT_APP_WEATHER_KEY: WEATHER_KEY,
  REACT_APP_WEATHER_ENDPOINT: WEATHER_ENDPOINT,
} = process.env;

const getParams = params => {
  const mainQueryObject = {
    units: "metric",
    lang: "es",
    appid: WEATHER_KEY,
  };
  let queryObject = {};

  if (params.locationID) {
    queryObject = { locationID: params.locationID };
  } else if (params.location) {
    queryObject = { location: params.location };
  } else if (params.lat && params.lon) {
    queryObject = { lat: params.lat, lon: params.lon };
  } else {
    return false;
  }

  return { ...queryObject, ...mainQueryObject };
};

class Weather extends Api {
  constructor() {
    super(WEATHER_ENDPOINT);
  }

  weather(params = {}, forceFetch = false) {
    const prevWeather = storage.getItem(WEATHER);
    const queryObject = getParams(params);

    return new Promise((resolve, reject) => {
      // some params are wrong
      if (!queryObject) {
        return reject({ msg: "Missing params, please checkout again" });
      }

      if (queryObject.lat && queryObject.lon) {
        // validate latitude and longitude
        if (
          queryObject.lat > 90 ||
          queryObject.lat < -90 ||
          queryObject.lon > 180 ||
          queryObject.lon < -180
        ) {
          return reject({ msg: "The latitude or longitude not exist" });
        }
      }

      // check if exist the previous weather request and the time not expired
      if (
        !forceFetch &&
        prevWeather !== null &&
        compare(prevWeather.date) < WEATHER_MINUTES_EXPIRED
      ) {
        return resolve(prevWeather.data);
      }

      this.get(this.qs("weather", queryObject))
        .then(data => {
          storage.setItem(WEATHER, { date: new Date(), data });
          resolve(data);
        })
        .catch(err => reject(err));
    });
  }

  onecall(params, forceFetch) {
    const prevWeather = storage.getItem(ONECALL);
    const queryObject = getParams(params);

    return new Promise((resolve, reject) => {
      // some params are wrong
      if (!queryObject) {
        return reject({ msg: "Missing params, please checkout again" });
      }

      if (queryObject.lat && queryObject.lon) {
        // validate latitude and longitude
        if (
          queryObject.lat > 90 ||
          queryObject.lat < -90 ||
          queryObject.lon > 180 ||
          queryObject.lon < -180
        ) {
          return reject({ msg: "The latitude or longitude not exist" });
        }
      }

      // check if exist the previous weather request and the time not expired
      if (
        !forceFetch &&
        prevWeather !== null &&
        compare(prevWeather.date, "hours") < ONECALL_HOURS_EXPIRED
      ) {
        return resolve(prevWeather.data);
      }

      this.get(this.qs("onecall", queryObject))
        .then(data => {
          storage.setItem(ONECALL, { date: new Date(), data });
          resolve(data);
        })
        .catch(err => reject(err));
    });
  }

  getNextDaysWeather(latitude, longitude) {
    return this.onecall({ lat: latitude, lon: longitude });
  }

  getDayWeather(latitude, longitude) {
    return this.weather({ lat: latitude, lon: longitude });
  }
}

export default new Weather();

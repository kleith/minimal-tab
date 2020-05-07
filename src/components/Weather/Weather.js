import React, { PureComponent } from "react";
import Tooltip from "react-tooltip";

import WeatherAPI from "services/Weather";
import WeatherIcon from "./WeatherIcon";
import WeatherInfo from "./WeatherInfo";
import { WEATHER_MINUTES_EXPIRED } from "constant";
import "./weather.scss";

class Weather extends PureComponent {
  state = {
    weather: {},
    nextDaysWeather: {},
    position: {},
  };

  constructor(props) {
    super(props);

    this.intervalHandle = "";
    this.locationHandle = "";
  }

  componentDidMount() {
    this.setCoords().then(this.setWeather);

    // each 3 minutes
    this.intervalHandle = setInterval(this.setWeather, 3 * 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle);
    navigator.geolocation.clearWatch(this.locationHandle);
  }

  setCoords = () => {
    return new Promise(resolve => {
      this.locationHandle = navigator.geolocation.watchPosition(
        position => {
          this.setState({ position: position.coords });
          resolve();
        },
        err => console.warn(`ERROR(${err.code}): ${err.message}`),
        {
          timeout: WEATHER_MINUTES_EXPIRED * 60 * 1000,
        }
      );
    });
  };

  setWeather = () => {
    const { position } = this.state;

    WeatherAPI.getDayWeather(position.latitude, position.longitude)
      .then(data => this.setState({ weather: data }))
      .catch(err => console.log(err.msg));

    WeatherAPI.getNextDaysWeather(position.latitude, position.longitude)
      .then(data => this.setState({ nextDaysWeather: data }))
      .catch(err => console.log(err.msg));
  };

  render() {
    const { weather, nextDaysWeather } = this.state;
    if (!weather.name || !nextDaysWeather.daily) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="Weather" data-tip data-event="click" data-for="weather">
          <div className="Weather-temp">
            <span>
              <WeatherIcon name={weather.weather[0].icon} />
            </span>
            {Math.round(weather.main.temp)}°C
          </div>
          <div className="Weather-placename">{weather.name}</div>
        </div>
        <Tooltip
          className="Weather-tooltip"
          id="weather"
          type="dark"
          effect="solid"
          overridePosition={({ _, top }, __, ___, node) => ({
            left: window.innerWidth - node.offsetWidth - 10,
            top,
          })}
          place="bottom"
          // globalEventOff="click"
          clickable={true}
        >
          <WeatherInfo place={weather.name} weather={nextDaysWeather} />
        </Tooltip>
      </React.Fragment>
    );
  }
}

export default Weather;

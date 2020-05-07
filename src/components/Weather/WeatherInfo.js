import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import WeatherIcon from "./WeatherIcon";
import { unix } from "utils/dates";
import "./weatherInfo.scss";

class WeatherInfo extends PureComponent {
  static propTypes = {
    weather: PropTypes.object.isRequired,
    place: PropTypes.string.isRequired,
  };

  state = {
    daySelected: 0,
  };

  selectDay = index => {
    this.setState({ daySelected: index });
  };

  render() {
    const { weather, place } = this.props;
    const { daySelected } = this.state;

    return (
      <div className="WeatherInfo">
        <div className="WeatherInfo-main">
          <div className="WeatherInfo-main--header">
            {place}
            <span>{unix(weather.daily[daySelected].dt).format("dddd")}</span>
          </div>
          <div className="WeatherInfo-main--desc">
            {weather.daily[daySelected].weather[0].description}
          </div>
          <div className="WeatherInfo-main--temp">
            <WeatherIcon name={weather.daily[daySelected].weather[0].icon} size={50} />
            <span className="WeatherInfo-main--temp-max">
              {Math.round(weather.daily[daySelected].temp.max)}°
            </span>
            <span className="WeatherInfo-main--temp-min">
              {Math.round(weather.daily[daySelected].temp.min)}°
            </span>
          </div>
        </div>
        <div className="WeatherInfo-daily">
          {weather.daily.slice(0, 5).map((day, index) => (
            <div
              className={clsx("WeatherInfo-day", { active: daySelected === index })}
              onClick={() => this.selectDay(index)}
              key={index}
              title={day.weather[0].description}
            >
              <div className="WeatherInfo-date">{unix(day.dt).format("ddd")}</div>
              <div className="WeatherInfo-temp">
                <WeatherIcon name={day.weather[0].icon} size={20} />
                <span className="WeatherInfo-temp--max">{Math.round(day.temp.max)}°</span>
                <span className="WeatherInfo-temp--min">{Math.round(day.temp.min)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default WeatherInfo;

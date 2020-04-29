import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import "./weatherIcon.scss";

class WeatherIcon extends PureComponent {
  static propTypes = {
    name: PropTypes.oneOf([
      "01d",
      "02d",
      "03d",
      "04d",
      "09d",
      "10d",
      "11d",
      "13d",
      "50d",
      "01n",
      "02n",
      "03n",
      "04n",
      "09n",
      "10n",
      "11n",
      "13n",
      "50n",
    ]).isRequired,
    size: PropTypes.number,
  };

  render() {
    const { name, size } = this.props;

    if (size && size > 0 && size <= 50) {
      const css = {
        backgroundSize: `${size}px`,
        height: `${size}px`,
        width: `${size}px`,
      };

      return <div className={`WeatherIcon icon-${name}`} style={css}></div>;
    }

    return <div className={`WeatherIcon icon-${name}`}></div>;
  }
}

export default WeatherIcon;

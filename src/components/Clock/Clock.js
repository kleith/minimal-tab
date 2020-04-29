import React, { Component } from "react";
import PropTypes from "prop-types";
import "./clock.scss";

class Clock extends Component {
  static propTypes = {
    split: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    split: false,
  };

  constructor(props) {
    super(props);

    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    this.intervalHandle = "";
    this.state = {
      hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
    };
  }

  componentDidMount() {
    // each 10 seconds
    this.intervalHandle = setInterval(() => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      this.setState({ hours, minutes: minutes < 10 ? `0${minutes}` : minutes });
    }, 10 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle);
  }

  render() {
    const { hours, minutes } = this.state;
    const time = `${hours}:${minutes}`;
    const split = hours > 12 ? "PM" : "AM";

    return (
      <div className="Clock">
        <span className="Clock-time">{time}</span>
        {this.props.split && <span className="Clock-split">{split}</span>}
      </div>
    );
  }
}

export default Clock;

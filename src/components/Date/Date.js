import React, { PureComponent } from "react";
import { date } from "../../utils/dates";

class Date extends PureComponent {
  render() {
    const today = date().format("dddd, D [de] MMMM");
    return <div className="Date">{today}</div>;
  }
}

export default Date;

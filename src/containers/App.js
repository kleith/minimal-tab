import React from "react";
import Clock from "components/Clock";
import Date from "components/Date";
import Weather from "components/Weather";

import "./app.scss";
import Feed from "components/Feed/Feed";

function App() {
  return (
    <div className="App">
      <div className="App-date">
        <Date />
      </div>
      <div className="App-weather">
        <Weather />
      </div>
      <div className="App-clock">
        <Clock />
      </div>
      <div className="App-feed">
        <Feed />
      </div>
    </div>
  );
}

export default App;

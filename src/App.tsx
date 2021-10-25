import React from "react";
import "./App.css";
import { createMeeting, getMeetingData } from "./firebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import EventView from "./components/event-view"
import CreateView from "./components/create-view";
import style from "./App.module.css";

function App() {
  getMeetingData("D1PL2j9JfnyHuTlmF5Y2").then((data) => {
    console.log(data);
  });
  createMeeting().then((meetID) => {
    console.log(meetID);
  });
  return (
    <div className={style.App}>
      <Router>
        <Switch>
          <Route path="/">
            <CreateView />
          </Route>
          <Route path="/eventView">
            <EventView />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

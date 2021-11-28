import React from "react";
import "./App.css";
import { createMeeting, getMeetingData } from "./firebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import EventView from "./components/event-view";
import CreateView from "./components/create-view";
import style from "./App.module.css";

function App() {
  return (
    <div className={style.App}>
      <Router>
        <Switch>
          <Route path="/:meetingID">
            <EventView meetingID="TEST" />
          </Route>
          <Route path="/">
            <CreateView />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

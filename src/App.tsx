import React from "react";
import "./App.css";
import { createMeeting, getMeetingData } from "./firebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import EventView from "./components/event-view";
import CreateView from "./components/create-view";
import NotFound from "./404";
import style from "./App.module.css";

function App() {
  return (
    <div className={style.App}>
      <Router>
        <Switch>
          <Route
            sensitive
            exact
            path="/m/:meetingID"
            render={({ match }) => {
              return <EventView meetingID={match.params["meetingID"]} />;
            }}
          />
          <Route exact path="/">
            <CreateView />
          </Route>
          <Route path="*">
            <NotFound></NotFound>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

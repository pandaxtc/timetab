import React from "react";
import "./App.css";
import { createMeeting, getMeetingData } from "./interface";
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";

const LandingPage = () => {
  return (
    <></>
    /*
    Timetab Header
    Event Name Input
    Date toggle
    Date picker
    Time zone picker (dropdown)
    
    CreateEventButton
    */
  );
};

const EventView = () => {
  return (
    <></>
    /*
      Timetab Header
      Event Name
      Login Prompt or Your Availability (after login)
      Availability Table
      Availability Legend
    */
  );
};

function App() {
  getMeetingData("D1PL2j9JfnyHuTlmF5Y2").then((data) => {
    console.log(data);
  });
  createMeeting().then((meetID) => {
    console.log(meetID);
  });
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <Router>
        <Switch>
          <Route path="/"></Route>
          <Route path="/eventView">
            <EventView />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

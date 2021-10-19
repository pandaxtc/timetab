import React from 'react';
import logo from './logo.svg';
import './App.css';
import {createMeeting, getMeetingData} from "./interface";

function App() {
  getMeetingData('D1PL2j9JfnyHuTlmF5Y2').then(data => {
    console.log(data)
  });
  createMeeting().then(meetID =>{
    console.log(meetID);
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
    </div>
  );
}

export default App;

import React, { ChangeEvent, useState } from "react";
import { createMeeting } from "../firebase";
import Button from "./button";
import TextInput from "./text-input";

import inputStyle from "./input.module.css";
import style from "./daterange-selector.module.css";

const DaterangeSelector = () => {
  const [type, setType] = useState("weekday");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
  };

  return (
    <>
      <label className={inputStyle.inputHeader}>Date</label>
      <div className={style.selector}>
        <input
          className={style.selector}
          type="radio"
          name="datetype"
          value="weekday"
          id="weekday"
          onChange={handleChange}
          defaultChecked
        ></input>
        <label htmlFor="weekday">Weekdays</label>
        <input
          type="radio"
          name="datetype"
          value="date"
          id="date"
          onChange={handleChange}
        ></input>
        <label htmlFor="date">Dates</label>
      </div>
      <div>
        PLACEHOLDER DATEPICKER GOES HERE
      </div>
    </>
  );
};

export default DaterangeSelector;

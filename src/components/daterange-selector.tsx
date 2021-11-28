import React, { ChangeEvent, useState } from "react";
import DayPicker from "react-day-picker";

import inputStyle from "./input.module.css";
import style from "./daterange-selector.module.css";
import WeekdaySelector from "./weekday-selector";

const DaterangeSelector = ({
  type,
  typeChange,
}: {
  type: "weekday" | "date";
  typeChange: (type: "weekday" | "date") => void;
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    typeChange(e.target.value as "weekday" | "date");
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
      <div className={style.dateInputContainer}>
        {type === "weekday" ? <WeekdaySelector /> : <DayPicker />}
      </div>
    </>
  );
};

export default DaterangeSelector;

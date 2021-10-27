import React, { useState, useRef, useCallback, useEffect } from "react";

import style from "./weekday-selector.module.css";
import { WEEKDAYS } from "../constants";

const WeekdaySelector = () => {
  const [selectedIndexes, setSelectedIndexes] = useState(new Set<number>());

  return (
    <div className={style.weekdayContainer}>
      {WEEKDAYS.map((day, i) => {
        return (
          <div
            className={`${style.dayPill} ${
              selectedIndexes.has(i) ? style.dayPillSelected : ""
            } `}
            key={i}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};

export default WeekdaySelector;

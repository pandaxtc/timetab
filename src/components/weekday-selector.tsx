import SelectionArea, { SelectionEvent } from "@viselect/react";
import React, { useEffect, useRef, useState } from "react";

import style from "./weekday-selector.module.css";
import { WEEKDAYS } from "../constants";
import { difference, union } from "../misc-functions";

const WeekdaySelector = () => {
  const savedSelectedIndexes = useRef(new Set<number>());
  const selectedIndexes = useRef(new Set<number>());
  const curElement = useRef<HTMLDivElement|null>();
  const select = useRef(true);
  const [_, setT] = useState(0);

  useEffect(() =>{
    curElement.current.parentElement.addEventListener('touchstart', (ev)=>{
      ev.preventDefault();
    });
  });

  const onStart = ({ selection, event }: SelectionEvent) => {
    // console.log(event);
    if (event?.target) {
      const el = event.target as HTMLDivElement;
      select.current = !selectedIndexes.current.has(
        parseInt(el.getAttribute("data-key") as string)
      );

      if (select.current) {
        selectedIndexes.current.add(
          parseInt(el.getAttribute("data-key") as string)
        );
      } else {
        selectedIndexes.current.delete(
          parseInt(el.getAttribute("data-key") as string)
        );
      }
    }
    setT((t) => t + 1);
    // console.log(selectedIndexes.current);
    selection.clearSelection();
  };

  const onMove = ({ store: { selected } }: SelectionEvent) => {
    const delta = new Set<number>(
      selected.map((el) => parseInt(el.getAttribute("data-key") as string))
    );

    if (select.current) {
      selectedIndexes.current = union(savedSelectedIndexes.current, delta);
    } else {
      selectedIndexes.current = difference(savedSelectedIndexes.current, delta);
    }

    setT((t) => t + 1);
    // console.log(selectedIndexes.current);
  };

  const onStop = () => {
    savedSelectedIndexes.current = selectedIndexes.current;
    console.log(`STOPPED, ${savedSelectedIndexes.current}`);
  };

  return (
    <SelectionArea
      className={style.weekdayContainer}
      onStart={onStart}
      onMove={onMove}
      onStop={onStop}
      selectables=".selectable"
    >
      {WEEKDAYS.map((day, i) => {
        return (
          <div
            className={`selectable ${style.dayPill} ${
              selectedIndexes.current.has(i) ? style.dayPillSelected : ""
            } `}
            tabIndex={0}
            role="button"
            aria-pressed={selectedIndexes.current.has(i)}
            key={i}
            data-key={i}
            ref={curElement}
            onKeyDown={(e) => {
              if (e.code !== "Space" && e.code !== "Enter") return;
              if (selectedIndexes.current.has(i)) {
                selectedIndexes.current.delete(i);
              } else {
                selectedIndexes.current.add(i);
              }
              setT((t) => t + 1);
            }}
          >
            {day}
          </div>
        );
      })}
    </SelectionArea>
  );
};

export default WeekdaySelector;

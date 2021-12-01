/**
 * @fileoverview This module provides 2 related components: TimeSelectChart
 * and TimeDisplayChart. TimeSelectChart is for the user to choose their 
 * available times and TimeDisplayChart displays the whole event group's
 * availability data. 
 * @package viselect - This package provides tools for selecting ranges of
 * cells in the TimeSelectChart with mouse events like hold and drag.
 * @package rainbowvis - This package is used to generate a color spectrum
 * mapped to numbers that correspond to the people available in a time slot.
 * 
 * 
 */
import React, { Key, useReducer, useEffect, useRef, useState } from "react";
import SelectionArea, {
  Behaviour,
  OverlapMode,
  SelectionEvent,
} from "@viselect/react";
import style from "./time-select-chart.module.css";
import Button from "./button";
import SaveDeleteSelector from "./save-delete-selector";
import { SUPPORTED_TIME_INCREMENT } from "../constants";
import { allUserDataInterface, TimeInterval } from "../firebase";
import { tableRowforEach, union, difference } from "../misc-functions";
import Rainbow from "rainbowvis.js";
import { AvailabilityLegend } from "./availability-legend";

export const TimeSelectChart = ({
  label,
  rowLabels,
  columnLabels,
  tableId,
  addTimes,
  selectedIndexes,
}: {
  label: string;
  rowLabels: Array<String>;
  columnLabels: Array<String>;
  tableId?: string;
  addTimes?: (e: React.MouseEvent<HTMLElement>) => void;
  selectedIndexes: React.MutableRefObject<Set<String>>;
}) => {
  const savedSelectedIndexes = useRef(selectedIndexes.current);
  const select = useRef(true);
  const [_, setT] = useState(0);

  const timeout = useRef<null | number>(null);

  const onBeforeStart = ({ selection, event }: SelectionEvent) => {
    if (!(event instanceof TouchEvent)) {
      return;
    }

    // const el = event.target as HTMLDivElement;
    if (timeout.current != null) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    function postTimeout() {
      selection.trigger(event);
      timeout.current = null;
    }

    function cancelTimeout() {
      console.log("test");
      if (timeout.current != null) {
        clearTimeout(timeout.current);
      }
      document
        .getElementById(tableId)
        .parentElement.removeEventListener("scroll", cancelTimeout);
      document.removeEventListener("scroll", cancelTimeout);
    }

    timeout.current = window.setTimeout(postTimeout, 500);

    document
      .getElementById(tableId)
      .parentElement.addEventListener("scroll", cancelTimeout);
    document.addEventListener("scroll", cancelTimeout);
    return false;
  };

  const onStart = ({ selection, event }: SelectionEvent) => {
    if (event?.target) {
      const el = event.target as HTMLDivElement;

      if (select.current) {
        selectedIndexes.current.add(el.getAttribute("data-key") as string);
      } else {
        selectedIndexes.current.delete(el.getAttribute("data-key") as string);
      }
    }
    setT((t) => t + 1);
    selection.clearSelection();
  };

  const onMove = ({ store: { selected } }: SelectionEvent) => {
    const delta = new Set<string>(
      selected.map((el) => el.getAttribute("data-key") as string)
    );

    if (select.current) {
      selectedIndexes.current = union(savedSelectedIndexes.current, delta);
    } else {
      selectedIndexes.current = difference(savedSelectedIndexes.current, delta);
    }
    setT((t) => t + 1);
  };
  const onStop = () => {
    if (timeout.current != null) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    savedSelectedIndexes.current = selectedIndexes.current;
  };

  let colLabels = columnLabels.map((colLabel) => {
    return (
      <th
        className={style.unselectable}
        colSpan={1 / SUPPORTED_TIME_INCREMENT}
        key={colLabel as Key}
      >
        {colLabel}
      </th>
    );
  });

  let rows = rowLabels.map((rowLabel, i) => {
    let rowElements = columnLabels.map((time, j) => {
      let key = `row${i}col${j}`;
      let hour = parseInt(time.substring(0, time.search(":")));
      return (
        <React.Fragment key={key}>
          <td
            className={`selectable ${style.half_hr} ${selectedIndexes.current.has(`${key}h`) ? style.selected : ""
              }`}
            data-key={`${key}h`}
            data-time-start={hour}
            data-time-end={hour + SUPPORTED_TIME_INCREMENT}
          ></td>
          <td
            className={`selectable ${style.hr} ${selectedIndexes.current.has(key) ? style.selected : ""
              }`}
            data-key={key}
            data-time-start={hour + SUPPORTED_TIME_INCREMENT}
            data-time-end={hour + 1}
          ></td>
        </React.Fragment>
      );
    });
    return (
      <tr key={i} data-row={i}>
        <th className={style.rowLabel} key={rowLabel as Key}>
          {rowLabel}
        </th>
        {rowElements}
      </tr>
    );
  });

  return (
    <>
      <h3>{label}</h3>
      <SelectionArea
        className={style.selection_area}
        onBeforeStart={onBeforeStart}
        onStart={onStart}
        onMove={onMove}
        onStop={onStop}
        selectables=".selectable"
      >
        <table id={tableId} className={style.table}>
          <thead>
            <tr>
              <th></th>
              {colLabels}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </SelectionArea>
      <div style={{ display: "flex" }}>
        <Button label="Save" type="submit" onClick={addTimes!}></Button>
        <div style={{ marginLeft: "auto" }}>
          <SaveDeleteSelector
            onChange={(buttonVal: string) => {
              select.current = buttonVal == "select";
            }}
          />
        </div>
      </div>
    </>
  );
};

export const TimeDisplayChart = ({
  label,
  rowLabels,
  columnLabels,
  tableId,
  userData,
}: {
  label: string;
  rowLabels: Array<String>;
  columnLabels: Array<String>;
  tableId: string;
  userData: allUserDataInterface | null | undefined;
}) => {
  var myGradient = new Rainbow();
  let maxUsers = userData ? Object.keys(userData).length : 0;
  myGradient.setNumberRange(-1, maxUsers);
  myGradient.setSpectrum('#FFE5CF', '#091094');

  useEffect(() => {
    tableKey.current += 1;
    tableRowforEach(tableId, (row, rowIndex) => {
      for (const userName in userData) {
        let userInfo = userData[userName];
        userInfo.intervals.get(rowIndex)!.forEach((interval: TimeInterval) => {
          for (
            let i = interval.start;
            i < interval.end;
            i += SUPPORTED_TIME_INCREMENT
          ) {
            let tableEntry = row?.querySelector(
              `[data-time-start="${i}"]`
            ) as HTMLElement;
            tableEntry!.style.background =
              "#" + myGradient.colourAt(parseInt(tableEntry.dataset.num) - 1);
            tableEntry!.dataset.num = (parseInt(tableEntry.dataset.num) + 1).toString();
          }
        });
      }
    });
  });

  const tableKey = useRef(0);

  let colLabels = columnLabels.map((colLabel) => {
    return (
      <th
        className={style.unselectable}
        colSpan={1 / SUPPORTED_TIME_INCREMENT}
        key={colLabel as Key}
      >
        {colLabel}
      </th>
    );
  });

  let rows = rowLabels.map((rowLabel, i) => {
    let rowElements = columnLabels.map((time, j) => {
      let key = `row${i}col${j}`;
      let hour = parseInt(time.substring(0, time.search(":")));
      return (
        <React.Fragment key={key}>
          <td
            className={`${style.half_hr}`}
            data-key={`${key}h`}
            data-time-start={hour}
            data-time-end={hour + SUPPORTED_TIME_INCREMENT}
            style={{ background: "white" }}
            data-num={0}
          ></td>
          <td
            className={`${style.hr}`}
            data-key={key}
            data-time-start={hour + SUPPORTED_TIME_INCREMENT}
            data-time-end={hour + 1}
            style={{ background: "white" }}
            data-num={0}
          ></td>
        </React.Fragment>
      );
    });
    return (
      <tr key={i} data-row={i}>
        <th className={style.rowLabel}>{rowLabel}</th>
        {rowElements}
      </tr>
    );
  });
  return (
    <>
      <h3>{label}</h3>
      <div style={{ overflow: "auto" }}>
        <table key={tableKey.current} id={tableId} className={style.table}>
          <thead>
            <tr>
              <th></th>
              {colLabels}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
      <AvailabilityLegend numUsers={maxUsers}/>
    </>
  );
};

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
import * as Rainbow from "rainbowvis.js";

export const TimeSelectChart = ({
  label,
  row_labels,
  column_labels,
  table_id,
  addTimes,
  selectedIndexes,
}: {
  label: string;
  row_labels: Array<String>;
  column_labels: Array<String>;
  table_id?: string;
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
        .getElementById(table_id)
        .parentElement.removeEventListener("scroll", cancelTimeout);
      document.removeEventListener("scroll", cancelTimeout);
    }

    timeout.current = window.setTimeout(postTimeout, 500);

    document
      .getElementById(table_id)
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

  let col_labels = column_labels.map((col_label) => {
    return (
      <th
        className={style.unselectable}
        colSpan={1 / SUPPORTED_TIME_INCREMENT}
        key={col_label as Key}
      >
        {col_label}
      </th>
    );
  });

  let rows = row_labels.map((row_label, i) => {
    let row_elements = column_labels.map((time, j) => {
      let key = `row${i}col${j}`;
      let hour = parseInt(time.substring(0, time.search(":")));
      return (
        <React.Fragment key={key}>
          <td
            className={`selectable ${style.half_hr} ${
              selectedIndexes.current.has(`${key}h`) ? style.selected : ""
            }`}
            data-key={`${key}h`}
            data-time-start={hour}
            data-time-end={hour + SUPPORTED_TIME_INCREMENT}
          ></td>
          <td
            className={`selectable ${style.hr} ${
              selectedIndexes.current.has(key) ? style.selected : ""
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
        <th className={style.row_label} key={row_label as Key}>
          {row_label}
        </th>
        {row_elements}
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
        <table id={table_id} className={style.table}>
          <thead>
            <tr>
              <th></th>
              {col_labels}
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
  row_labels,
  column_labels,
  table_id,
  userData,
}: {
  label: string;
  row_labels: Array<String>;
  column_labels: Array<String>;
  table_id: string;
  userData: allUserDataInterface | null | undefined;
}) => {
  var myGradient = new Rainbow();
  myGradient.setNumberRange(0,userData? Object.keys(userData).length : 1);
  myGradient.setSpectrum('#FFE5CF', '#091094');

  useEffect(() => {
    tableKey.current += 1;
    tableRowforEach(table_id, (row, rowIndex) => {
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
            tableEntry!.dataset.num = (parseInt(tableEntry.dataset.num) + 1).toString();
            tableEntry!.style.background =
              "#" + myGradient.colourAt(parseInt(tableEntry.dataset.num));
          }
        });
      }
    });
  });

  const tableKey = useRef(0);

  let col_labels = column_labels.map((col_label) => {
    return (
      <th
        className={style.unselectable}
        colSpan={1 / SUPPORTED_TIME_INCREMENT}
        key={col_label as Key}
      >
        {col_label}
      </th>
    );
  });

  let rows = row_labels.map((row_label, i) => {
    let row_elements = column_labels.map((time, j) => {
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
        <th className={style.row_label}>{row_label}</th>
        {row_elements}
      </tr>
    );
  });
  return (
    <div style={{ overflow: "auto" }}>
      <h3>{label}</h3>
      <table key={tableKey.current} id={table_id} className={style.table}>
        <thead>
          <tr>
            <th></th>
            {col_labels}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

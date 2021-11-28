import { ChangeEvent, useEffect, useState, useRef } from "react";
import {
  setAllUserDataListener,
  getMeetingData,
  setUserInfo,
  TimeInterval,
} from "../firebase";
import { meetingDataInterface, allUserDataInterface } from "../firebase";

import style from "./event-view.module.css";
import chartStyle from "./time-select-chart.module.css";
import { TimeSelectChart, TimeDisplayChart } from "./time-select-chart";
import Button from "./button";
import TextInput from "./text-input";
import { tableRowforEach } from "../misc-functions";
import { SUPPORTED_TIME_INCREMENT } from "../constants";

const EventView = ({ meetingID }: { meetingID: string }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState("");
  const [meetingData, setMeetingData] = useState<meetingDataInterface | null>(
    null
  );
  const [userData, setUserData] = useState<allUserDataInterface | null>(null);
  const initialTimeSelection = useRef(new Set<string>());
  let selectableTableID = "selection";
  let displayTableID = "displayTable";

  const handleLogin = () => {
    if (!meetingData || !userData) {
      alert("Data not finished loading, Try again Later");
      return;
    }
    if (userData && userData[user]) {
      let authUser = userData[user];
      tableRowforEach(displayTableID, (row, rowIndex) => {
        authUser.intervals.get(rowIndex)!.forEach((interval: TimeInterval) => {
          for (
            let i = interval.start;
            i < interval.end;
            i += SUPPORTED_TIME_INCREMENT
          ) {
            let tableEntry = row?.querySelector(
              `[data-time-start="${i}"]`
            ) as HTMLElement;
            initialTimeSelection.current?.add(tableEntry.dataset.key as string);
          }
        });
      });
    }
    setAuth(true);
  };

  useEffect(() => {
    const setData = async () => {
      let meetData = await getMeetingData(meetingID);
      setMeetingData(meetData);
      setAllUserDataListener(meetingID, setUserData);
    };
    setData();
  }, []);

  const addTimes = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    let intervals = new Map<number, Array<TimeInterval>>();
    tableRowforEach(selectableTableID, (row, rowIndex) => {
      let data_entries = row.childNodes.values() as IterableIterator<Element>;
      let startTime: number | undefined = undefined;
      let endTime: number | undefined = undefined;
      let currInterval: Array<TimeInterval> = [];
      for (const entry of data_entries) {
        if (!entry.classList.contains(chartStyle.selected)) continue;
        let entry_start = parseFloat(entry.getAttribute("data-time-start")!);
        if (startTime === undefined) {
          startTime = entry_start;
          endTime = parseFloat(entry.getAttribute("data-time-end")!);
        } else if (entry_start === endTime) {
          endTime = parseFloat(entry.getAttribute("data-time-end")!);
        } else {
          currInterval.push(new TimeInterval(startTime!, endTime!));
          startTime = entry_start;
          endTime = parseFloat(entry.getAttribute("data-time-end")!);
        }
      }
      if (startTime != undefined)
        currInterval.push(new TimeInterval(startTime, endTime!));
      intervals.set(rowIndex, currInterval);
    });
    setUserInfo(meetingID, user, intervals);
  };

  let timeArr = meetingData
    ? Array.from(
        { length: meetingData.endHour - meetingData.startHour + 1 },
        (_, time) => {
          return `${(time + meetingData.startHour)
            .toString()
            .padStart(2, "0")}:00`;
        }
      )
    : [];
  return (
    <form>
      <h2>
        time<span style={{ color: "var(--accent-color)" }}>tab</span>
      </h2>
      <h1>{meetingData?.name}</h1>
      {!auth && (
        <div style={{ display: "flex", gap: "50px" }}>
          <div>
            <TextInput
              label="Your Name"
              placeholder="Sammy Slug"
              className={style.textInput}
              onChange={(value: string) => {
                setUser(value.toLowerCase());
              }}
            ></TextInput>
          </div>
          <div className={style.loginButton}>
            <Button label="Login" type="submit" onClick={handleLogin}></Button>
          </div>
        </div>
      )}
      {auth && (
        <TimeSelectChart
          table_id={selectableTableID}
          label="Your Availability"
          column_labels={timeArr}
          row_labels={meetingData ? meetingData.days : []}
          addTimes={addTimes}
          selectedIndexes={initialTimeSelection}
        />
      )}
      <TimeDisplayChart
        table_id={displayTableID}
        label="Your Group's Availability"
        column_labels={timeArr}
        row_labels={meetingData ? meetingData.days : []}
        userData={userData}
      />
    </form>
    /*
		  Timetab Header
		  Event Name
		  Login Prompt or Your Availability (after login)
		  Availability Table
		  Availability Legend
		*/
  );
};

export default EventView;

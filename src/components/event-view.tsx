import React, { ChangeEvent, useEffect, useState, useRef } from "react";
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
import NotFound from "../404";

const EventView = ({ meetingID }: { meetingID: string }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState("");
  const [meetingData, setMeetingData] = useState<
    meetingDataInterface | null | undefined
  >(undefined);
  const [userData, setUserData] = useState<
    allUserDataInterface | null | undefined
  >(undefined);
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

      if (meetData === undefined) {
        setMeetingData(null);
        return;
      }

      setMeetingData(meetData);
      setAllUserDataListener(meetingID, setUserData);
    };
    setData();
  }, []);

  const addTimes = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    let intervals = new Map<number, Array<TimeInterval>>();
    tableRowforEach(selectableTableID, (row, rowIndex) => {
      let dataEntries = row.childNodes.values() as IterableIterator<Element>;
      let startTime: number | undefined = undefined;
      let endTime: number | undefined = undefined;
      let currInterval: Array<TimeInterval> = [];
      for (const entry of dataEntries) {
        if (!entry.classList.contains(chartStyle.selected)) continue;
        let entryStart = parseFloat(entry.getAttribute("data-time-start")!);
        if (startTime === undefined) {
          startTime = entryStart;
          endTime = parseFloat(entry.getAttribute("data-time-end")!);
        } else if (entryStart === endTime) {
          endTime = parseFloat(entry.getAttribute("data-time-end")!);
        } else {
          currInterval.push(new TimeInterval(startTime!, endTime!));
          startTime = entryStart;
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
    <>
      {meetingData === null ? (
        <NotFound></NotFound>
      ) : (
        <>
          <h2>
            time<span style={{ color: "var(--accent-color)" }}>tab</span>
          </h2>
          <form>
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
                  <Button
                    label="Login"
                    type="submit"
                    onClick={handleLogin}
                  ></Button>
                </div>
              </div>
            )}
            {auth && (
              <TimeSelectChart
                tableId={selectableTableID}
                label="Your Availability"
                columnLabels={timeArr}
                rowLabels={meetingData ? meetingData.days : []}
                addTimes={addTimes}
                selectedIndexes={initialTimeSelection}
              />
            )}
            <TimeDisplayChart
              tableId={displayTableID}
              label="Your Group's Availability"
              columnLabels={timeArr}
              rowLabels={meetingData ? meetingData.days : []}
              userData={userData}
            />
          </form>
        </>
      )}
    </>
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

/**
 * @fileoverview CreateView is the landing page for TimeTab users that are
 * looking to create a new event to schedule. Users can carry out the initial
 * configuration of their event with this page. The event name, days of the 
 * week, start and end times, and time-zone are all configured here. 
 * @package Firebase - this module acts as an adapter for the Firestore API to
 * interface with the other components in the project.
 * @package Button - generic button component with callback function for mouse
 * click event.
 * @package DaterangeSelector - Component for choosing either a range of 
 * weekdays or dates
 * @package TextInput - Generic input component used to record event name.
 * @package DropdownInput - Component used to choose time zone for event.
 * @package react-router - Package with react component for routing between
 * CreateView and EventView pages. 
 */

import React, { useState, useRef } from "react";
import { createMeeting } from "../firebase";
import Button from "./button";
import DaterangeSelector from "./daterange-selector";

import TextInput from "./text-input";

import "../vars.css";
import style from "./create-view.module.css";
import weekdayStyle from "./weekday-selector.module.css";
import DropdownInput from "./dropdown-input";
import { TIMES, TIMEZONES } from "../constants";
import { useHistory } from "react-router";

const CreateView = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  interface Time {
    value: number;
    label: string;
  }
  const history = useHistory();
  const [timeZone, setTimeZone] = useState(tz);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<"weekday" | "date">("weekday");
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);
  const selectedDates = useRef<Set<number>>(new Set<number>());

  const createEvent = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    let dates: Array<string> = [];
    for (const ele of document.getElementsByClassName(
      weekdayStyle.dayPillSelected
    )) {
      dates.push(ele.innerHTML);
    }

    const id = await createMeeting({
      name: eventName,
      type: eventType,
      tz: timeZone,
      startHour: startTime ? startTime.value : 0,
      endHour: endTime ? endTime.value : 0,
      days: dates,
    });

    history.push(`/m/${id}`);
  };

  return (
    <form>
      <h1>
        time<span style={{ color: "var(--accent-color)" }}>tab</span>
      </h1>
      <TextInput
        className={style.textInput}
        label="Event Name"
        placeholder="New Event"
        onChange={setEventName}
      ></TextInput>
      <DaterangeSelector
        type={eventType}
        typeChange={setEventType}
      ></DaterangeSelector>
      <DropdownInput
        onChange={setTimeZone}
        className={style.dropdownInputWide}
        options={TIMEZONES}
        label="Time Zone"
        defaultValue={tz}
      ></DropdownInput>
      <div className={style.dropdownContainer}>
        <DropdownInput
          onChange={setStartTime}
          className={style.dropdownInput}
          options={TIMES}
          label="Start Time"
        ></DropdownInput>
        <DropdownInput
          onChange={setEndTime}
          className={style.dropdownInput}
          options={TIMES}
          label="End Time"
        ></DropdownInput>
      </div>

      <Button type="submit" label="Create" onClick={createEvent}></Button>
    </form>
  );
  
};

export default CreateView;

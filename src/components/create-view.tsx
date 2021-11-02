import React, { useState, useRef, ChangeEvent, HtmlHTMLAttributes } from "react";
import { createMeeting } from "../firebase";
import Button from "./button";
import DaterangeSelector from "./daterange-selector";
import TextInput from "./text-input";

import "../vars.css";
import style from "./create-view.module.css";
import DropdownInput from "./dropdown-input"; 
import { TIMES, TIMEZONES } from "../constants"; 


  const CreateView = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    interface Time{
      value: number,
      label: string
    }

    const [timeZone, setTimeZone] = useState(tz);
    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState<"weekday" | "date">("weekday");
    const [startTime, setStartTime] = useState<Time | null>(null);
    const [endTime, setEndTime] = useState<Time | null>(null);
    

    const createEvent = (e : React.MouseEvent<HTMLElement>) =>{
      e.preventDefault()
      createMeeting({
        "tz" : timeZone,
        "startHour" : startTime?.value,
        "endHour" : endTime?.value,
        "type" : eventType
      });
      console.log(timeZone)
      console.log(startTime)
      console.log(endTime)
      console.log(eventName)
      console.log(eventType)
    }

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
  /*
  Timetab Header
  Event Name Input
  Date toggle
  Date picker
  Time zone picker (dropdown)
  
  CreateEventButton
  */
};

export default CreateView;

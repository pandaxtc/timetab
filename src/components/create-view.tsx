import React, {
  useState,
  useRef,
  ChangeEvent,
  HtmlHTMLAttributes,
  forwardRef,
} from "react";
import { createMeeting } from "../firebase";
import Button from "./button";
import DaterangeSelector from "./daterange-selector";
import TextInput from "./text-input";

import "../vars.css";
import style from "./create-view.module.css";
import weekdayStyle from "./weekday-selector.module.css";
import DropdownInput from "./dropdown-input";
import { TIMES, TIMEZONES } from "../constants";

const CreateView = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  interface Time {
    value: number;
    label: string;
  }

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

    await createMeeting({
      name: eventName,
      type: eventType,
      tz: timeZone,
      startHour: startTime ? startTime.value : 0,
      endHour: endTime ? endTime.value : 0,
      days: dates,
    });
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

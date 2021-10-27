import React, { useState } from "react";
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


  return (
    <form>
      <h1>
        time<span style={{ color: "var(--accent-color)" }}>tab</span>
      </h1>
      <TextInput
        className={style.textInput}
        label="Event Name"
        placeholder="New Event"
      ></TextInput>
      <DaterangeSelector></DaterangeSelector>
      <DropdownInput
        className={style.dropdownInputWide}
        options={TIMEZONES}
        label="Time Zone"
        defaultValue={tz}
      ></DropdownInput>
      <div className={style.dropdownContainer}>
        <DropdownInput
          className={style.dropdownInput}
          options={TIMES}
          label="Start Time"
        ></DropdownInput>
        <DropdownInput
          className={style.dropdownInput}
          options={TIMES}
          label="End Time"
        ></DropdownInput>
      </div>

      <Button type="submit" label="Create" onClick={() => {}}></Button>
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

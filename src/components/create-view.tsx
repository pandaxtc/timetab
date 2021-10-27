import React, { useState } from "react";
import { createMeeting } from "../firebase";
import Button from "./button";
import DaterangeSelector from "./daterange-selector";
import TextInput from "./text-input";

import '../vars.css';
import DropdownInput from "./dropdown-input";
import { TIMEZONES } from "../constants";

const CreateView = () => {
  return (
    <form>
      <h1>time<span style={{color: "var(--accent-color)"}}>tab</span></h1>
      <TextInput label="Event Name" placeholder="New Event"></TextInput>
      <DaterangeSelector></DaterangeSelector>
      <DropdownInput options={TIMEZONES} label="Time Zone"></DropdownInput>
      <Button type="submit" label="Create" onClick={()=>{}}></Button>
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
import React, { useState } from "react";
import { createMeeting } from "../firebase";
import Button from "./button";
import DaterangeSelector from "./daterange-selector";
import TextInput from "./text-input";

import '../vars.css';

const CreateView = () => {
  return (
    <>
      <h1>time<span style={{color: "var(--accent-color)"}}>tab</span></h1>
      <TextInput label="Event Name" placeholder="New Event"></TextInput>
      <DaterangeSelector></DaterangeSelector>
      <Button text="Create" onClick={()=>{}}></Button>
    </>
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
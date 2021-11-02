import { useState } from "react";
import SelectionArea, {SelectionEvent} from "@viselect/react";
import { createMeeting, getMeetingData } from "../firebase";
import {TIMES, WEEKDAYS} from "../constants"

import style from "./event-view.module.css"
import TimeSelectChart from "./time-select-chart";
import Button from "./button";
import TextInput from "./text-input";



const EventView = ({ meetingID }: { meetingID: string }) => {
	const [auth, setAuth] = useState(false);

	const handleLogin = () =>{
		setAuth(true);
	};

	return (
		<form>
			<h2>
				time<span style={{ color: "var(--accent-color)" }}>tab</span>
			</h2>
			<h1>{meetingID}</h1>
			{!auth &&
			<div style={{display:"flex", gap:"50px"}}>
				<div>
					<TextInput label="Your Name" placeholder="Sammy Slug" className={style.textInput}></TextInput>
				</div>
				<div className={style.loginButton}>
					<Button label="Login" type="submit" onClick={handleLogin}></Button>
				</div>
			</div>
			}
			{auth &&
			<TimeSelectChart label="Your Availability" column_labels={TIMES.map((time)=>time.label)} row_labels={WEEKDAYS} selectable={true}/>
			}
			<TimeSelectChart label="Your Group's Availability"column_labels={TIMES.map((time)=>time.label)} row_labels={WEEKDAYS} selectable={false}/>
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
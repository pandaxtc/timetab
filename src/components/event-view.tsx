import { ChangeEvent, useState } from "react";
import { getMeetingData, setUserInfo, TimeInterval } from "../firebase";
import {TIMES, WEEKDAYS} from "../constants"

import style from "./event-view.module.css"
import chartStyle from "./time-select-chart.module.css"
import TimeSelectChart from "./time-select-chart";
import Button from "./button";
import TextInput from "./text-input";



const EventView = ({ meetingID }: { meetingID: string }) => {
	const [auth, setAuth] = useState(false);
	const [user, setUser] = useState("");
	let selectableTableID = "selection"

	const handleLogin = () =>{
		setAuth(true);
	};


	const addTimes = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
		let selectionTable = document.getElementById(selectableTableID);
        if (selectionTable){
            let rows = selectionTable!.querySelector('tbody')?.getElementsByTagName('tr')
            let intervals = new Map<number,Array<TimeInterval>>();
            let i = 0;
            for( const row of rows!){
                let data_entries = row.childNodes.values() as IterableIterator<Element>
                let startTime: number | undefined = undefined;
                let endTime: number | undefined = undefined; 
				let currInterval:Array<TimeInterval> = [];
                for(const entry of data_entries){
                    if (!entry.classList.contains(chartStyle.selected)) continue;
                    let entry_start = parseFloat(entry.getAttribute('data-time-start')!) ; 
                    if(startTime === undefined){
                        startTime = entry_start;
                        endTime = parseFloat(entry.getAttribute('data-time-end')!) ; 
                    } else if (entry_start === endTime){
                        endTime = parseFloat(entry.getAttribute('data-time-end')!) ; 
                    }else{
                        currInterval.push(new TimeInterval(startTime!,endTime!));
                        startTime = entry_start;
                        endTime = parseFloat(entry.getAttribute('data-time-end')!) ; 
                    }
                }
                if(startTime != undefined) currInterval.push(new TimeInterval(startTime,endTime!));
				intervals.set(i,currInterval);
                i++;
            }
			setUserInfo(meetingID,user,intervals);
            console.log(user,intervals)
        }
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
					<TextInput 
						label="Your Name" 
						placeholder="Sammy Slug" 
						className={style.textInput}
						onChange={(value:string)=>{setUser(value.toLowerCase());}}
					></TextInput>
				</div>
				<div className={style.loginButton}>
					<Button label="Login" type="submit" onClick={handleLogin}></Button>
				</div>
			</div>
			}
			{auth &&
			<TimeSelectChart 
				table_id={selectableTableID}
				label="Your Availability" 
				column_labels={TIMES.map((time)=>time.label)} 
				row_labels={WEEKDAYS} 
				selectable={true}
				addTimes={addTimes}
			/>
			}
			<TimeSelectChart 
				label="Your Group's Availability"
				column_labels={TIMES.map((time)=>time.label)} 
				row_labels={WEEKDAYS} 
				selectable={false}
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
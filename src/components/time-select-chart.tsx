import React, { Key, useCallback, useEffect, useRef, useState } from 'react';
import SelectionArea, { Behaviour, OverlapMode, SelectionEvent } from "@viselect/react";
import style from "./time-select-chart.module.css"
import Button from "./button";
import SaveDeleteSelector from './save-delete-selector';
import { TimeInterval } from '../firebase';

function union<T>(setA: Set<T>, setB: Set<T>) {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

function difference<T>(setA: Set<T>, setB: Set<T>) {
    let _difference = new Set(setA);
    for (let elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}

const TimeSelectChart = ({
    label,
    row_labels,
    column_labels,
    selectable,
    table_id,
}: {
    label: string;
    row_labels: Array<String>
    column_labels: Array<String>
    selectable: boolean
    table_id?: string
}) => {
    const savedSelectedIndexes = useRef(new Set<string>());
    const selectedIndexes = useRef(new Set<string>());
    const select = useRef(true);
    const [_, setT] = useState(0);


    const addTimes = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (table_id){
            let table = document.getElementById(table_id)
            let rows = table!.querySelector('tbody')?.getElementsByTagName('tr')
            let intervals: Array<Array<TimeInterval>> = [...Array(rows?.length)].map((_) => [])
            let i = 0;
            for( const row of rows!){
                let data_entries = row.childNodes.values() as IterableIterator<Element>
                let startTime: number | undefined = undefined;
                let endTime: number | undefined = undefined; 
                for(const entry of data_entries){
                    if (!entry.classList.contains(style.selected)) continue;
                    let entry_start = parseFloat(entry.getAttribute('data-time-start')!) ; 
                    if(startTime === undefined){
                        startTime = entry_start;
                        endTime = parseFloat(entry.getAttribute('data-time-end')!) ; 
                    } else if (entry_start === endTime){
                        endTime = parseFloat(entry.getAttribute('data-time-end')!) ; 
                    }else{
                        intervals[i].push(new TimeInterval(startTime!,endTime!));
                        startTime = entry_start;
                        endTime = parseFloat(entry.getAttribute('data-time-end')!) ; 
                    }
                }
                if(startTime != undefined) intervals[i].push(new TimeInterval(startTime,endTime!));
                i++;
            }
            console.log(intervals)
        }
    };


    const onStart = ({ selection, event }: SelectionEvent) => {
        if (event?.target) {
            const el = event.target as HTMLDivElement;

            if (select.current) {
                selectedIndexes.current.add(
                    el.getAttribute("data-key") as string
                );
            } else {
                selectedIndexes.current.delete(
                    el.getAttribute("data-key") as string
                );
            }
        }
        setT((t) => t + 1);
        selection.clearSelection();
    };

    const onMove = ({ store: { selected } }: SelectionEvent) => {
        const delta = new Set<string>(
            selected.map((el) => el.getAttribute("data-key") as string)
        );

        if (select.current) {
            selectedIndexes.current = union(savedSelectedIndexes.current, delta);
        } else {
            selectedIndexes.current = difference(savedSelectedIndexes.current, delta);
        }
        setT((t) => t + 1);
    };
    const onStop = () => {
        savedSelectedIndexes.current = selectedIndexes.current;
    };

    let col_labels = column_labels.map((col_label) => {
        return <th className={style.unselectable} colSpan={2} key={col_label as Key}>{col_label}</th>
    });

    let rows = row_labels.map((row_label, i) => {
        let row_elements = column_labels.map((time, j) => {
            let key = `row${i}col${j}`;
            let hour = parseInt(time.substring(0,time.search(':')));
            return (
                <React.Fragment key={key}>
                    <td
                        className={`selectable ${style.half_hr} ${selectedIndexes.current.has(`${key}h`) ? style.selected : ""
                            }`}
                        data-key={`${key}h`}
                        data-time-start= {hour}
                        data-time-end = {hour + 0.5}
                    >
                    </td>
                    <td
                        className={`selectable ${style.hr} ${selectedIndexes.current.has(key) ? style.selected : ""
                            }`}
                        data-key={key}
                        data-time-start= {hour + 0.5}
                        data-time-end = {hour + 1}
                    >
                    </td>
                </React.Fragment>
            )
        });
        return (
            <tr key={i}>
                <th className={style.row_label} key={row_label as Key}>{row_label}</th>
                {row_elements}
            </tr>)
    });

    if (selectable) {
        return (
          <>
            <SelectionArea
                className={style.table}
                onStart={onStart}
                onMove={onMove}
                onStop={onStop}
                selectables=".selectable"
            >
                <h3>{label}</h3>
                <table id={table_id} className={style.table}>
                    <thead >
                        <tr>
                            <th></th>
                            {col_labels}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </SelectionArea>
            <div style={{"display": 'flex'}}>
                <Button label="Save" type="submit" onClick={addTimes}></Button>
                <div style={{'marginLeft': 'auto'}}>
                    <SaveDeleteSelector 
                        onChange={(buttonVal:string)=>{
                            select.current = buttonVal=="select";
                        }}
                    />
                </div>
            </div>
            </>
        );
    }else{
        return (
            <div style={{"overflow":"auto"}}>
                <h3>{label}</h3>
                <table id={table_id}className={style.table}>
                    <thead >
                        <tr>
                            <th></th>
                            {col_labels}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }


};

export default TimeSelectChart;
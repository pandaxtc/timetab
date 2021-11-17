import React, { Key, useCallback, useEffect, useRef, useState } from 'react';
import SelectionArea, { Behaviour, OverlapMode, SelectionEvent } from "@viselect/react";
import style from "./time-select-chart.module.css"
import Button from "./button";
import SaveDeleteSelector from './save-delete-selector';
import { SUPPORTED_TIME_INCREMENT } from '../constants';
import { TimeInterval } from '../firebase';
import { getAllUserData } from '../firebase';

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

export const TimeSelectChart = ({
    label,
    row_labels,
    column_labels,
    table_id,
    addTimes
}: {
    label: string
    row_labels: Array<String>
    column_labels: Array<String>
    table_id?: string
    addTimes?: (e: React.MouseEvent<HTMLElement>) => void
}) => {
    const savedSelectedIndexes = useRef(new Set<string>());
    const selectedIndexes = useRef(new Set<string>());
    const select = useRef(true);
    const [_, setT] = useState(0);

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
        return <th className={style.unselectable} colSpan={1 / SUPPORTED_TIME_INCREMENT} key={col_label as Key}>{col_label}</th>
    });

    let rows = row_labels.map((row_label, i) => {
        let row_elements = column_labels.map((time, j) => {
            let key = `row${i}col${j}`;
            let hour = parseInt(time.substring(0, time.search(':')));
            return (
                <React.Fragment key={key}>
                    <td
                        className={`selectable ${style.half_hr} ${selectedIndexes.current.has(`${key}h`) ? style.selected : ""
                            }`}
                        data-key={`${key}h`}
                        data-time-start={hour}
                        data-time-end={hour + SUPPORTED_TIME_INCREMENT}
                    >
                    </td>
                    <td
                        className={`selectable ${style.hr} ${selectedIndexes.current.has(key) ? style.selected : ""
                            }`}
                        data-key={key}
                        data-time-start={hour + SUPPORTED_TIME_INCREMENT}
                        data-time-end={hour + 1}
                    >
                    </td>
                </React.Fragment>
            )
        });
        return (
            <tr key={i} data-row={i}>
                <th className={style.row_label} key={row_label as Key}>{row_label}</th>
                {row_elements}
            </tr>)
    });


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
            <div style={{ "display": 'flex' }}>
                <Button label="Save" type="submit" onClick={addTimes!}></Button>
                <div style={{ 'marginLeft': 'auto' }}>
                    <SaveDeleteSelector
                        onChange={(buttonVal: string) => {
                            select.current = buttonVal == "select";
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export const TimeDisplayChart = ({
    label,
    row_labels,
    column_labels,
    table_id,
    userData
}: {
    label: string
    row_labels: Array<String>
    column_labels: Array<String>
    table_id: string
    userData: Map<string,any>| null
}) => {

    useEffect(() => {
        let table = document.getElementById(table_id);
        userData?.forEach((userInfo,_)=>{
            userInfo.intervals.forEach((intervals:Array<TimeInterval>, rowNum:number)=>{
                let tableRow = table!.querySelector(`[data-row="${rowNum}"]`);
                intervals.forEach((interval)=>{
                    for(let i=interval.start; i < interval.end; i+=SUPPORTED_TIME_INCREMENT){
                        let tableEntry = tableRow?.querySelector(`[data-time-start="${i}"]`) as HTMLElement;
                        tableEntry!.style.background="hotpink"; // replace with gradient?
                    }
                });
            });
        });
    },[userData]);

    let col_labels = column_labels.map((col_label) => {
        return <th className={style.unselectable} colSpan={1 / SUPPORTED_TIME_INCREMENT} key={col_label as Key}>{col_label}</th>
    });

    let rows = row_labels.map((row_label, i) => {
        let row_elements = column_labels.map((time, j) => {
            let key = `row${i}col${j}`;
            let hour = parseInt(time.substring(0, time.search(':')));
            return (
                <React.Fragment key={key}>
                    <td
                        className={`${style.half_hr}`}
                        data-key={`${key}h`}
                        data-time-start={hour}
                        data-time-end={hour + SUPPORTED_TIME_INCREMENT}
                    >
                    </td>
                    <td
                        className={`${style.hr}`}
                        data-key={key}
                        data-time-start={hour + SUPPORTED_TIME_INCREMENT}
                        data-time-end={hour + 1}
                    >
                    </td>
                </React.Fragment>
            )
        });
        return (
            <tr key={i} data-row={i}>
                <th className={style.row_label} key={row_label as Key}>{row_label}</th>
                {row_elements}
            </tr>)
    });
    return (
        <div style={{ "overflow": "auto" }}>
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
        </div>
    );
};


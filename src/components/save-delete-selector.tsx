/**
 * @fileoverview This module provides a SaveDeleteSelector component that is 
 * used to toggle between saving new available times and removing available
 * times in the EventView. 
 */
import React, { ChangeEvent, useState } from "react";

import style from "./save-delete-selector.module.css";

const SaveDeleteSelector = ({
  onChange,
}: {
  onChange: (buttonVal: string) => void;
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <>
      <div className={style.selector}>
        <input
          className={style.selector}
          type="radio"
          name="selecttype"
          value="select"
          id="select"
          onChange={handleChange}
          defaultChecked
        ></input>
        <label htmlFor="select">Select</label>
        <input
          type="radio"
          name="selecttype"
          value="remove"
          id="remove"
          onChange={handleChange}
        ></input>
        <label htmlFor="remove">Remove</label>
      </div>
    </>
  );
};

export default SaveDeleteSelector;

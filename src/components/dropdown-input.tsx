import React from "react";

import style from "./text-input.module.css";

const TextInput = ({ label }: { label: string }) => {
  return (
    <>
      <div className={style.inputHeader}>
        <label>{label}</label>
      </div>
      <input className={style.textInput}></input>
    </>
  );
};

export default TextInput;

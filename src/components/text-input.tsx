import React from "react";

import style from "./input.module.css";

const TextInput = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => {
  return (
    <>
      <div className={style.inputHeader}>
        <label>{label}</label>
      </div>
      <input className={style.textInput} placeholder={placeholder}></input>
    </>
  );
};

export default TextInput;

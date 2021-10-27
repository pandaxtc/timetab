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
      <label className={style.inputHeader}>{label}</label>
      <input className={style.textInput} placeholder={placeholder}></input>
    </>
  );
};

export default TextInput;

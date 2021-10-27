import React from "react";

import style from "./input.module.css";

const TextInput = ({
  label,
  placeholder,
  className
}: {
  label: string;
  placeholder: string;
  className: string
}) => {
  return (
    <>
      <label className={style.inputHeader}>{label}</label>
      <input className={`${style.textInput} ${className}`} placeholder={placeholder}></input>
    </>
  );
};

export default TextInput;

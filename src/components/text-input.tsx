import React, { ChangeEvent } from "react";

import style from "./input.module.css";

const TextInput = ({
  label,
  placeholder,
  className,
  onChange
}: {
  label: string;
  placeholder: string;
  className: string
  onChange?: (value:string) => void;
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
      if (onChange){
        onChange(e.target.value)
      }
  }
  return (
    <>
      <label className={style.inputHeader}>{label}</label>
      <input className={`${style.textInput} ${className}`} placeholder={placeholder} onChange={handleChange}>
      </input>
    </>
  );
};

export default TextInput;

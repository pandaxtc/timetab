import React from "react";
import Select from "react-select";
import "../vars.css";

import style from "./input.module.css";

const DropdownInput = ({ label, options }: { label: string; options: any }) => {
  return (
    <>
      <label className={style.inputHeader}>{label}</label>
      <Select
        styles={{
          control: (provided) => ({
            ...provided,
            //borderColor: "var(--accent-color)",
            height: 42,
            width: "100%",
            maxWidth: 450,
          }),
          menu: (provided) => ({
            ...provided,
            width: "100%",
            maxWidth: 450,
          }),
          indicatorSeparator: () => ({ display: "none" }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 8,
          spacing: {
            ...theme.spacing,
            controlHeight: 42,
          },
          colors: {
            ...theme.colors,
            neutral20: "var(--accent-color)",
            neutral50: "var(--weak-text-color)",
          },
        })}
        options={options}
      ></Select>
    </>
  );
};

export default DropdownInput;

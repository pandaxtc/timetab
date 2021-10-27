import React from "react";
import Select from "react-select";
import { classNames } from "react-select/dist/declarations/src/utils";
import "../vars.css";

import style from "./input.module.css";

const DropdownInput = ({
  className,
  label,
  options,
  placeholder,
  defaultValue,
}: {
  className: string;
  label: string;
  options: any;
  placeholder?: string;
  defaultValue?: string;
}) => {
  return (
    <div className={className}>
      <label className={style.inputHeader}>{label}</label>
      <Select
        defaultValue={options.find((option: any) => option.value === defaultValue)}
        placeholder={placeholder}
        styles={{
          control: (provided) => ({
            ...provided,
            height: 42,
          }),
          menu: (provided) => ({
            ...provided,
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
    </div>
  );
};

export default DropdownInput;

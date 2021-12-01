/**
 * @fileoverview This module provides the DropdownInput component for 
 * the CreateView component. The component is configured in CreateView to 
 * allow the user to choose an appropriate Time Zone for their event.
 * @package React Select - Node package that provides a highly configurable
 * Dropdown select component
 */
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
  onChange,
}: {
  className: string;
  label: string;
  options: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  defaultValue?: string;
}) => {
  return (
    <div className={className}>
      <label className={style.inputHeader}>{label}</label>
      <Select
        onChange={onChange}
        defaultValue={options.find(
          (option: any) => option.value === defaultValue
        )}
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

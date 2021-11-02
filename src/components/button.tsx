import React, { ChangeEvent, MouseEventHandler } from "react";

import style from "./button.module.css";

const Button = ({
  label,
  type = "button",
  onClick,
}: {
  label: string;
  type?: "button" | "submit" | "reset";
  onClick: (() => void)| ((e : React.MouseEvent<HTMLElement>) => void);
}) => {
  return (
    <button type={type} className={style.textButton} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;

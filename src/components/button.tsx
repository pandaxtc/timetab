import React from "react";

import style from "./button.module.css";

const Button = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return <button className={style.textButton} onClick={onClick}>{text}</button>;
};

export default Button;

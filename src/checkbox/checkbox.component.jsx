import { useState } from "react";
import "./checkbox.style.scss";
const CheckboxButton = ({ handleCheckboxClicked, id }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
    handleCheckboxClicked(id);
  };

  return (
    <button
      className={`custom-checkbox ${isChecked ? "checked" : ""}`}
      onMouseDown={() => {
        handleCheckboxClick();
      }}
    ></button>
  );
};
export default CheckboxButton;

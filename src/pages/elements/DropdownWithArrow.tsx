import React, { useState } from "react";

type DropdownOption = {
  value: string;
  label: string;
};

type DropdownWithArrowProps = {
  label: string;
  name: string;
  options: DropdownOption[];
  onDropdown: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  dropdownArrow: string;
};

const DropdownWithArrow: React.FC<DropdownWithArrowProps> = ({
  label,
  name,
  options,
  onDropdown,
  dropdownArrow,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleBlur = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="mod-setting-wrapper">
      <label>{label}</label>
      <div className="setting-dropdown-wrapper">
        <select
          className="setting-dropdown"
          name={name}
          onChange={onDropdown}
          onClick={handleClick}
          onBlur={handleBlur}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <img
          className={`setting-dropdown-arrow ${
            isDropdownOpen ? "rotated" : ""
          }`}
          src={dropdownArrow}
          alt="icon"
          style={{ pointerEvents: "none" }}
        />
      </div>
    </div>
  );
};

export default DropdownWithArrow;

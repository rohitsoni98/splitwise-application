import React, { useState, useMemo, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import OutsideClick from "../outsideClick/OutsideClick";
import "./autoComplete.scss";

const AutoComplete = ({
  value,
  options,
  isMultiSelect,
  onSelect,
  optionLabel,
  renderOption,
  onEnterPress,
  disabled,
  matchNotFoundMessage,
  placeholder,
  label,
}) => {
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [pointedOption, setPointedOption] = useState(null);

  useEffect(() => {
    if (!isInputFocus) {
      setSearchTerm("");
      setPointedOption(null);
    }
  }, [isInputFocus]);

  useEffect(() => {
    if (value && value?.length !== selectedOptions.length) {
      setSelectedOptions(isMultiSelect ? value : [value]);
    }
  }, [value]);

  const handleSelect = (option) => {
    if (!isMultiSelect) {
      onSelect(option);
      setSelectedOptions([option]);
      setSearchTerm("");
      setIsInputFocus(false);
      setPointedOption(null);
    } else {
      let newOptions = [];
      if (selectedOptionSet.has(option[optionLabel])) {
        newOptions = selectedOptions.filter(
          (oldOption) => oldOption[optionLabel] !== option[optionLabel]
        );
      } else {
        newOptions = [...selectedOptions, option];
      }
      setSelectedOptions(newOptions);
      onSelect(newOptions);
      setSearchTerm("");
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filteredOptions = options.filter((option) =>
      option[optionLabel]?.toLowerCase().includes(value.trim()?.toLowerCase())
    );
    setPointedOption(filteredOptions[0]);
  };

  const handleKeyDown = ({ code }) => {
    if (code === "Enter") {
      if (pointedOption && isInputFocus) {
        handleSelect(pointedOption);
      } else if (searchTerm.trim()) {
        onEnterPress(searchTerm.trim());
        setSearchTerm("");
        setIsInputFocus(false);
      }
      setPointedOption(null);
    }
  };

  const handleCloseBtnClick = (option) => (evt) => {
    evt.stopPropagation();
    handleSelect(option);
  };

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option[optionLabel]
          ?.toLowerCase()
          .includes(searchTerm?.trim()?.toLowerCase())
      ),
    [searchTerm, options]
  );

  const selectedOptionSet = useMemo(
    () => new Set(selectedOptions.map((_) => _[optionLabel])),
    [JSON.stringify(selectedOptions)]
  );

  return (
    <OutsideClick handleClickOutside={() => setIsInputFocus(false)}>
      <p className="autocomplete-label">{label}</p>
      <div
        className={`autocomplete ${isInputFocus ? "focus" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onFocus={() => setIsInputFocus(true)}
        tabIndex={-1}
      >
        <div className="options_input_container">
          {selectedOptions.map((option) => (
            <span className="selected_option">
              <span>{option?.[optionLabel]}</span>
              <button onClick={handleCloseBtnClick(option)}>
                <CloseIcon fontSize="small" />
              </button>
            </span>
          ))}

          <input
            className={`textField ${disabled ? "disabled" : ""}`}
            disabled={disabled}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {isInputFocus && (
          <ul className="list">
            {!filteredOptions.length && searchTerm.trim() && (
              <li>{matchNotFoundMessage}</li>
            )}
            {filteredOptions.map((option) => {
              const isSelected = selectedOptionSet.has(option[optionLabel]);
              const isBeingPointed =
                option[optionLabel] === pointedOption?.[optionLabel];
              return (
                <li
                  className={`listItem ${isSelected ? "selected" : ""} ${
                    isBeingPointed ? "pointed" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setPointedOption(option)}
                >
                  {renderOption ? renderOption(option) : option[optionLabel]}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </OutsideClick>
  );
};

AutoComplete.defaultProps = {
  optionLabel: "label",
  isMultiSelect: false,
  matchNotFoundMessage: "",
};

export default AutoComplete;

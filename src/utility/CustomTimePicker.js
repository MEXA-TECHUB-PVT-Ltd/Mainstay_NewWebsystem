import React, { useState, useRef, useEffect } from "react";
import "./CustomTimeInput.css"; // Ensure styles are correctly imported

function CustomTimeInput({ label, value, onChange, timeError }) {
  const [isOpen, setIsOpen] = useState(false);
  const refContainer = useRef(null);

  // Parse initial values or default them
  const initialValueParts = value.split(" ");
  const initialTimeParts = initialValueParts[0].split(":");
  const initialHour = initialTimeParts[0] || "00";
  const initialMinute = initialTimeParts[1] || "00";
  const initialPeriod = initialValueParts[1] || "PM";

  const hours = Array.from({ length: 24 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0")
  );
  // const periods = ["AM", "PM"];

  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  const handleClickOutside = (event) => {
    if (refContainer.current && !refContainer.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTimeSelect = (hour, minute, period) => {
    const newHour = hour !== null ? hour : selectedHour; // Keep current hour unless a new one is provided

    const newMinute = minute !== null ? minute : selectedMinute || "0o0"; // Keep current minute unless a new one is provided
    // const newPeriod = period !== null ? period : selectedPeriod; // Keep current period unless a new one is provided
    setSelectedHour(newHour);
    if (parseInt(newHour) !== 24) {
      setSelectedMinute(newMinute);
    }
    // setSelectedPeriod(newPeriod);
    onChange(`${newHour}:${newMinute}`);
  };

  return (
    <div ref={refContainer} className="custom-time-picker-custom">
      <label>{label}</label>
      <input
        type="text"
        value={`${selectedHour}:${selectedMinute}`}
        readOnly
        onFocus={() => setIsOpen(true)}
        placeholder="Select time"
        className="time-input-custom"
      />
      {isOpen && (
        <div className="dropdown-custom">
          <div className="time-select-custom">
            {hours.map((h) => (
              <div
                key={h}
                className={`time-item-custom ${
                  selectedHour === h ? "selected" : ""
                }`}
                onClick={() => handleTimeSelect(h, null, null)}
              >
                {h}
              </div>
            ))}
          </div>
          <div className="time-select-custom">
            {minutes.map((m) => (
              <div
                key={m}
                className={`time-item-custom ${
                  selectedMinute === m ? "selected" : ""
                }`}
                onClick={() => handleTimeSelect(null, m, null)}
              >
                {m}
              </div>
            ))}
          </div>
          {/* <div className="time-select-custom">
            {periods.map((p) => (
              <div
                key={p}
                className={`time-item-custom ${
                  selectedPeriod === p ? "selected" : ""
                }`}
                onClick={() => handleTimeSelect(null, null, p)}
              >
                {p}
              </div>
            ))}
          </div> */}
        </div>
      )}
      {timeError?.start && (
        <span className="error-custom">{timeError?.start}</span>
      )}
      {timeError?.end && <span className="error-custom">{timeError?.end}</span>}
    </div>
  );
}

export default CustomTimeInput;

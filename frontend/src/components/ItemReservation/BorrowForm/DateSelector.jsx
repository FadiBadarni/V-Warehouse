import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DateSelector = ({
  disabled,
  label,
  selectedDate,
  handleDateChange,
  minDate,
  maxDate,
  shouldDisableDate,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        disabled={disabled}
        className="borrow-form__date-picker"
        label={label}
        value={selectedDate}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
        shouldDisableDate={shouldDisableDate}
      />
    </LocalizationProvider>
  );
};

export default DateSelector;

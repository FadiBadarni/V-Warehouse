import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

const InstanceSelector = ({
  quantity,
  selectedInstanceIds,
  handleInstanceIdChange,
}) => {
  const availableInstances = [];

  for (let i = 1; i <= quantity; i++) {
    availableInstances.push({
      value: i,
      label: i.toString(),
    });
  }

  return (
    <FormControl fullWidth>
      <Select
        labelId="instance-select-label"
        id="instance-select"
        value={selectedInstanceIds}
        onChange={handleInstanceIdChange}
        label="Instances"
      >
        {availableInstances.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default InstanceSelector;

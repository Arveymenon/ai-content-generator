import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function CustomSelect({ onChange, options, required=false, label = "Drop Down", className="" }) {
  return (
    <FormControl required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        className={className}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CustomSelect;
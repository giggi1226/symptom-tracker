import React, {useCallback, useState} from "react";
import {
  TextField,
  Button
} from '@mui/material';

export type FoodInput = {
  name: string;
};

const FoodInput = ({value, onChangeFood}) => {
  const food = useState('')

  return (
    <div>
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        value={value}
        onChange={onChangeFood}
      />
    </div>
  );
};

export default FoodInput;

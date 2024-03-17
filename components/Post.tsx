import React from "react";
import {
  TableCell,
  TableRow,
} from '@mui/material';


export type FoodProps = {
  id: string;
  name: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  } | null;
};

export type SymptomProps = {
  id: string;
  name: string;
  userId: string;
  createdAt: string
};

type Props = FoodProps | SymptomProps

const Food: React.FC<{ food: FoodProps | SymptomProps }> = ({ food }) => {
  const date = new Date(food.createdAt).toLocaleDateString()
  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell align="right" component="th" scope="row">
        {food.name}
      </TableCell>
      <TableCell align="right" component="th" scope="row">
        {date}
      </TableCell>
    </TableRow>
  );
};

export default Food;

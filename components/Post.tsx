import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
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
};

const Food: React.FC<{ food: FoodProps }> = ({ food }) => {
  const authorName = food.author ? food.author.name : "Unknown author";
  console.log({food})
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

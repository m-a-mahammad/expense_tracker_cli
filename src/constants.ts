import { readFileSync } from "fs";

const expensesOrigin = readFileSync("expenses.xlsx", "utf-8");
const expensesRaws = expensesOrigin.split("\n");
const expensesCells = expensesRaws.map((e) => {
  return e.split(";");
});
const egDate =
  String(new Date().getUTCDate()).padStart(2, "0") +
  "-" +
  String(new Date().getMonth() + 1).padStart(2, "0") +
  "-" +
  new Date().getFullYear();

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export { expensesOrigin, expensesRaws, expensesCells, egDate, monthNames };

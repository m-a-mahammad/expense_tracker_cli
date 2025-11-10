export default function toExcelFormat(expensesCells: string[][]) {
  const title = expensesCells[0]?.join(";");
  const data = expensesCells
    .slice(1)
    .map((row) => row.join(";"))
    .join("\n");
  return { title, data };
}

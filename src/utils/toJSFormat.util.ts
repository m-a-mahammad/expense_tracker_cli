export default function toJSFormat(
  expensesCells: string[][],
  cb: (arr: any, e?: string[]) => void
) {
  expensesCells.slice(1).map((e, idx) => {
    if (idx === e.length - 1) {
      cb(expensesCells, e);
    }
  });

  return expensesCells.map((row) => row.join(";")).join("\n");
}

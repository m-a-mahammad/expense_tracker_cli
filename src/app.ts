import { Command, program } from "commander";
import { existsSync, writeFileSync } from "fs";
import { expensesCells, egDate, monthNames } from "./constants.js";
import toExcelFormat from "./utils/toExcelFormat.util.js";
import toJSFormat from "./utils/toJSFormat.util.js";

console.clear();

// expense-tracker add --description "Lunch" --amount 20
// expense-tracker add [options] <string>

if (!existsSync("expenses.xlsx"))
  writeFileSync("expenses.xlsx", "ID  Date  Description  Amount\n");

program
  .name("expense-tracker")
  .description("CLI to manage your finances")
  .version("0.1.1");

program
  .command("list")
  .description("List all expenses")
  .action(function () {
    expenseCLI(this);
  });

program
  .command("add")
  .description("Add to expenses")
  .option("-d, --description <desc>")
  .option("-m, --amount <amt>")
  .action(function () {
    expenseCLI(this);
  });

program
  .command("update")
  .description("Update expenses")
  .option("-i, --id <id>")
  .option("-d, --description <desc>")
  .option("-m, --amount <amt>")
  .action(function () {
    expenseCLI(this);
  });

program
  .command("delete")
  .description("Delete expenses")
  .option("-i, --id <id>")
  .action(function () {
    expenseCLI(this);
  });

program
  .command("summary")
  .description("Get total expenses")
  .option("--month <month>")
  .action(function () {
    expenseCLI(this);
  });

program.parse();

function expenseCLI(cmdObj: Command) {
  const { description } = cmdObj.opts();
  const { amount } = cmdObj.opts();
  const { id } = cmdObj.opts();
  const { month } = cmdObj.opts();

  if (
    (!description || !amount) &&
    cmdObj.name() !== "list" &&
    cmdObj.name() !== "update" &&
    cmdObj.name() !== "delete" &&
    cmdObj.name() !== "summary"
  )
    throw new Error("description & amount are required");

  if (cmdObj.name() === "list") {
    console.log(
      toExcelFormat(expensesCells).title?.replaceAll(";", " | ") +
        "\n" +
        "---------------------------------------------" +
        "\n" +
        toExcelFormat(expensesCells).data.replaceAll(";", " | ")
    );
  }

  if (cmdObj.name() === "add") {
    expensesCells.map((e, idx) => {
      if (idx === expensesCells.length - 1) {
        expensesCells.push([
          idx !== 0 ? String(Number(e[0]) + 1) : 1,
          egDate,
          description,
          `$${amount}`,
        ]);
        console.log(
          `Expense added successfully (ID: ${String(Number(e[0]) + 1)})`
        );
      }
    });

    writeFileSync(
      "expenses.xlsx",
      `${
        toExcelFormat(expensesCells).title +
        "\n" +
        toExcelFormat(expensesCells).data
      }`
    );
  }

  if (cmdObj.name() === "update") {
    const expenseById = expensesCells.find((e) => e[0] === id);
    if (!expenseById) throw new Error(`No such expense with id`);

    if (cmdObj.opts().amount) {
      expenseById[3] = amount;
    } else if (cmdObj.opts().description) {
      expenseById[2] = description;
    } else {
      throw new Error("You can update either description or amount");
    }

    writeFileSync(
      "expenses.xlsx",
      toExcelFormat(expensesCells).title +
        "\n" +
        toExcelFormat(expensesCells).data
    );
  }

  if (cmdObj.name() === "delete") {
    const expenseById = expensesCells.filter((e) => e[0] !== id);
    writeFileSync(
      "expenses.xlsx",
      toExcelFormat(expenseById).title + "\n" + toExcelFormat(expenseById).data
    );
  }

  if (cmdObj.name() === "summary") {
    if (month) {
      if (isNaN(parseInt(month))) {
        console.error("Month should be between 1:12");
        return;
      }

      const expensesByMonth = expensesCells
        .slice(1)
        .map((e) => {
          return e;
        })
        .map((el) => {
          return el[1];
        })
        .map((txt) => {
          return txt?.split("-")[1];
        });

      const filteredByMonth = expensesCells.slice(1).filter((e, idx) => {
        return (
          expensesByMonth[idx] === String(parseInt(month)).padStart(2, "0")
        );
      });

      if (
        filteredByMonth.length === 0 &&
        parseInt(month) - 1 >= 0 &&
        parseInt(month) - 1 < 12
      ) {
        console.log(`No expenses found in ${monthNames[parseInt(month) - 1]}`);
        return;
      } else if (filteredByMonth.length === 0) {
        console.log("No expenses found");
        return;
      }

      const totalExpenses = filteredByMonth
        .map((e) => {
          return Number(e[3]?.slice(1));
        })
        .reduce(function (acc, el) {
          return acc + el;
        });

      console.log(
        `Total expenses for ${
          monthNames[parseInt(month) - 1]
        }: $${totalExpenses}`
      );
    } else {
      const totalExpenses = expensesCells
        .slice(1)
        .map((e) => Number(e[3]?.slice(1)))
        .reduce(function (acc, el) {
          return acc + el;
        });
      console.log(`Total expenses: $${totalExpenses}`);
    }
  }
}

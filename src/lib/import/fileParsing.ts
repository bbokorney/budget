import { TransactionToImport } from "./importSlice";
import { Transaction } from "../budget/models";

export default async function parseTransactions(files: FileList): Promise<TransactionToImport[]> {
  const transactions: TransactionToImport[] = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files.item(i);
    if (file) {
      // eslint-disable-next-line no-await-in-loop
      const text = await file.text();
      const lines = parseText(text);
      transactions.push(...parseLines(file.name, lines));
    }
  }
  transactions.sort((a, b) => (a.transaction.date ?? 0) - (b.transaction.date ?? 0));
  return transactions;
}

function parseText(text: string): string[] {
  return text.split("\n").filter((line) => line !== "");
}

function parseLines(fileName: string, lines: string[]): TransactionToImport[] {
  return lines
    .filter((line) => !line.startsWith("Transaction Date,"))
    .map((line) => parseLine(fileName, line))
    .filter((t) => t.transaction.amount && t.transaction.amount < 0);
}

function parseLine(fileName: string, line: string): TransactionToImport {
  const tokens = lineToArray(line);
  let transaction: Transaction = {};

  if (tokens.length === 5 && tokens[3] === "Payment") {
    transaction = {
      date: Date.parse(tokens[0]),
      amount: parseAmount(tokens[4]),
      vendor: tokens[2],
    };
  } else if (tokens.length === 5) {
    transaction = {
      date: Date.parse(tokens[0]),
      amount: parseAmount(tokens[1]),
      vendor: tokens[4],
    };
  } else if (tokens.length === 6) {
    transaction = {
      date: Date.parse(tokens[0]),
      amount: parseAmount(tokens[5]),
      vendor: tokens[2],
    };
  } else {
    throw new Error(`Unrecognized file format. ${tokens.length} tokens in line '${line}'`);
  }

  return {
    sourceFile: fileName,
    transaction,
  };
}

function trimDoubleQuotes(s: string): string {
  return s.replace(/^"/, "").replace(/"$/, "");
}

function parseAmount(s: string) {
  const amount = Number.parseFloat(s);
  if (Number.isNaN(amount)) {
    throw new Error(`Unable to parse amount: ${s}`);
  }
  return amount;
}

function lineToArray(line: string): string[] {
  const valuesRegExp = /(?:"([^"]*(?:""[^"]*)*)")|([^",]+)/g;
  const tokens: string[] = [];

  // eslint-disable-next-line
  while (true) {
    const matches = valuesRegExp.exec(line);
    if (!matches) {
      break;
    }
    tokens.push(trimDoubleQuotes(matches[0]));
  }

  return tokens;
}

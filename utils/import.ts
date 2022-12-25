// eslint-disable-next-line import/no-unresolved
import { initializeApp, cert } from "firebase-admin/app";
// eslint-disable-next-line import/no-unresolved
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "node:fs";
import * as csv from "csv-parser";
import { Transaction } from "../src/lib/budget/models";

initializeApp({
  credential: cert("./.creds/firestore-service-account-key.json"),
});

const db = getFirestore();

const main = async () => {
  const transactions: Transaction[] = [];
  const fileName = process.argv[2];
  fs.createReadStream(fileName)
    .pipe(csv(["Date", "Amount", "Category", "Vendor"]))
    .on("data", (data) => {
      const t: Transaction = {};
      if (data.Date) {
        t.date = new Date(data.Date).getTime();
      }
      if (data.Amount && typeof data.Amount === "string") {
        t.amount = Number.parseFloat(data.Amount.replace(/^\$/, ""));
      }
      if (data.Category) {
        t.category = data.Category;
      }
      if (data.Vendor) {
        t.vendor = data.Vendor;
      }
      transactions.push(t);
    })
    .on("end", () => {
      const collectionRef = db.collection("z-test-budget-transactions");
      transactions.forEach((t) => collectionRef.add(t));
      console.log(transactions.length);
    });
};

main().catch((error) => console.log(error));

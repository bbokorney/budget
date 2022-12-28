// eslint-disable-next-line import/no-unresolved
import { initializeApp, cert } from "firebase-admin/app";
// eslint-disable-next-line import/no-unresolved
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "node:fs";
import * as readline from "node:readline";
import { Category } from "../src/lib/budget/models";

initializeApp({
  credential: cert("./.creds/firestore-service-account-key.json"),
});

const db = getFirestore();

const main = async () => {
  const fileName = process.argv[2];
  const collectionRef = db.collection("z-test-budget-categories");
  readline.createInterface({
    input: fs.createReadStream(fileName),
    terminal: false,
  }).on("line", (line) => {
    const cat: Category = { name: line };
    collectionRef.add(cat);
  });
};

main().catch((error) => console.log(error));

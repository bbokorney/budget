import {
  addDoc, collection, getDocs,
  QueryDocumentSnapshot, Firestore, query, orderBy,
  setDoc, doc, deleteDoc, limit, where, QueryConstraint,
} from "firebase/firestore";
import { Transaction } from "./models";
import getDB from "./firebase";

export default class BudgetFirebaseAPI {
  collectionName = process.env.REACT_APP_TRANSACTIONS_COLLECTION_NAME
     ?? "budget-transactions";

  db: Firestore = getDB();

  docReference = (t: Transaction) => {
    if (!t.id) {
      throw new Error("Transaction has no ID");
    }
    return doc(this.db, this.collectionName, t.id);
  };

  listTransactions = async (after?: string): Promise<Transaction[]> => {
    const transactionsRef = collection(this.db, this.collectionName);
    const constraints: QueryConstraint[] = [orderBy("date", "desc")];
    if (after) {
      constraints.push(where("date", "<", after));
    }
    constraints.push(limit(10));
    const q = query(transactionsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map((snapshot: QueryDocumentSnapshot) => ({ id: snapshot.id, ...snapshot.data() }));
  };

  upsert = async (t: Transaction): Promise<Transaction> => {
    t = { ...t, source: "app" };
    if (t.id) {
      await setDoc(this.docReference(t), t);
      return t;
    }
    const docRef = await addDoc(collection(this.db, this.collectionName), t);
    return {
      id: docRef.id,
      ...t,
    };
  };

  delete = async (t: Transaction): Promise<void> => deleteDoc(this.docReference(t));
}
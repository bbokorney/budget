import {
  addDoc, collection, getDocs,
  QueryDocumentSnapshot, Firestore, query, orderBy,
  setDoc, doc, deleteDoc, limit, where, QueryConstraint, getDoc,
} from "firebase/firestore";
import { Transaction, Category, ImportAutoActionRule } from "./models";
import getDB from "./firebase";

export default class BudgetFirebaseAPI {
  transactionsCollectionName = process.env.REACT_APP_TRANSACTIONS_COLLECTION_NAME
     ?? "budget-transactions";

  categoriesCollectionName = process.env.REACT_APP_CATEGORIES_COLLECTION_NAME
     ?? "budget-categories";

  importAutoActionRuleCollectionName = process.env.REACT_APP_IMPORT_RULES_COLLECTION_NAME
     ?? "budget-importAutoActionRules";

  db: Firestore = getDB();

  docReference = (t: Transaction) => {
    if (!t.id) {
      throw new Error("Transaction has no ID");
    }
    return doc(this.db, this.transactionsCollectionName, t.id);
  };

  categoryDocReference = (c: Category) => {
    if (!c.id) {
      throw new Error("Category has no ID");
    }
    return doc(this.db, this.categoriesCollectionName, c.id);
  };

  importAutoActionRuleDocReference = (r: ImportAutoActionRule) => {
    if (!r.id) {
      throw new Error("Import auto action rule has no ID");
    }
    return doc(this.db, this.importAutoActionRuleCollectionName, r.id);
  };

  listTransactionsWithConstraints = async (...constraints: QueryConstraint[]): Promise<Transaction[]> => {
    const transactionsRef = collection(this.db, this.transactionsCollectionName);
    const q = query(transactionsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map((snapshot: QueryDocumentSnapshot) => ({ id: snapshot.id, ...snapshot.data() }));
  };

  listTransactions = async (after?: Transaction): Promise<Transaction[]> => {
    const constraints: QueryConstraint[] = [orderBy("date", "desc")];
    if (after?.date) {
      constraints.push(where("date", "<", after.date));
    }
    constraints.push(limit(25));
    return this.listTransactionsWithConstraints(...constraints);
  };

  listTransactionsInDateRange = async (startDate: number, endDate: number): Promise<Transaction[]> => this
    .listTransactionsWithConstraints(
      where("date", ">=", startDate),
      where("date", "<=", endDate),
    );

  upsertTransaction = async (t: Transaction): Promise<Transaction> => {
    t = { ...t, source: "app" };
    if (t.id) {
      await setDoc(this.docReference(t), t);
      return t;
    }
    const docRef = await addDoc(collection(this.db, this.transactionsCollectionName), t);
    return {
      id: docRef.id,
      ...t,
    };
  };

  getTransaction = async (id: string): Promise<Transaction> => {
    const docRef = await getDoc(this.docReference({ id }));
    return {
      id: docRef.id,
      ...docRef.data(),
    };
  };

  deleteTransaction = async (t: Transaction): Promise<Transaction> => {
    await deleteDoc(this.docReference(t));
    return t;
  };

  listCategories = async (): Promise<Category[]> => {
    const collectionRef = collection(this.db, this.categoriesCollectionName);
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map((snapshot: QueryDocumentSnapshot) => ({ id: snapshot.id, ...snapshot.data() }));
  };

  upsertCategory = async (c: Category): Promise<Category> => {
    if (c.id) {
      await setDoc(this.categoryDocReference(c), c);
      return c;
    }
    const docRef = await addDoc(collection(this.db, this.categoriesCollectionName), c);
    return {
      id: docRef.id,
      ...c,
    };
  };

  listImportAutoActionRules = async (): Promise<ImportAutoActionRule[]> => {
    const collectionRef = collection(this.db, this.importAutoActionRuleCollectionName);
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map((snapshot: QueryDocumentSnapshot) => ({ id: snapshot.id, ...snapshot.data() }));
  };

  upsertImportAutoActionRule = async (r: ImportAutoActionRule): Promise<ImportAutoActionRule> => {
    if (r.id) {
      await setDoc(this.importAutoActionRuleDocReference(r), r);
      return r;
    }
    const docRef = await addDoc(collection(this.db, this.importAutoActionRuleCollectionName), r);
    return {
      id: docRef.id,
      ...r,
    };
  };
}

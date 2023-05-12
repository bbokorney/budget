import Container from "@mui/material/Container";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../home/Home";
import TopBar from "../../ui/layout/TopBar";
import BottomNavBar from "../../ui/layout/BottomNavBar";
import Settings from "../settings/Settings";
import Account from "../account/Account";
import TransactionsList from "../transactions/List";
import ViewTransaction from "../transactions/View";
import TransactionsImport from "../transactions/Import";
import TransactionsStats from "../transactions/Stats";
import FloatingAddTransactionButton from "../../ui/layout/FloatingAddTransactionButton";
import FullScreenDialogTransactionForm from "../transactions/FullscreenDialogForm";
import Categories from "../settings/Categories";
import Tags from "../settings/Tags";
import Import from "../settings/Import";

const Main = () => (
  <BrowserRouter>
    <TopBar />
    <Container sx={{ paddingBottom: "72px" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transactions">
          <Route path="list" element={<TransactionsList />} />
          <Route path="stats" element={<TransactionsStats />} />
          <Route path="import" element={<TransactionsImport />} />
          <Route path=":id" element={<ViewTransaction />} />
        </Route>
        <Route path="/settings">
          <Route path="" element={<Settings />} />
          <Route path="categories" element={<Categories />} />
          <Route path="tags" element={<Tags />} />
          <Route path="import" element={<Import />} />
        </Route>
        <Route path="/account" element={<Account />} />
      </Routes>
      <FullScreenDialogTransactionForm />
      <FloatingAddTransactionButton />
      <BottomNavBar />
    </Container>
  </BrowserRouter>
);
export default Main;

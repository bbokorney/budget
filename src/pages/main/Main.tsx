import Container from "@mui/material/Container";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../home/Home";
import TopBar from "../../ui/layout/TopBar";
import BottomNavBar from "../../ui/layout/BottomNavBar";
import Settings from "../settings/Settings";
import Account from "../account/Account";
import TransactionsList from "../transactions/List";
import ViewTransaction from "../transactions/View";
import TransactionsStats from "../transactions/Stats";
import FloatingAddTransactionButton from "../../ui/layout/FloatingAddTransactionButton";
import TransactionForm from "../transactions/Form";

const Main = () => (
  <BrowserRouter>
    <TopBar />
    <Container sx={{ paddingBottom: "72px" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transactions">
          <Route path="list" element={<TransactionsList />} />
          <Route path="stats" element={<TransactionsStats />} />
          <Route path=":id" element={<ViewTransaction />} />
        </Route>
        <Route path="/settings" element={<Settings />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <TransactionForm />
      <FloatingAddTransactionButton />
      <BottomNavBar />
    </Container>
  </BrowserRouter>
);
export default Main;

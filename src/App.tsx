import "./lib/auth/auth";
import { useAppSelector } from "./lib/store/hooks";
import { selectAuth } from "./lib/auth/authSlice";
import Main from "./pages/main/Main";
import Login from "./pages/login/Login";

const App = () => {
  const { user } = useAppSelector(selectAuth);
  return (
    (user == null) ? <Login /> : <Main />
  );
};

export default App;

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppSelector } from "../../lib/store/hooks";
import { selectAuth } from "../../lib/auth/authSlice";
import { signUserIn } from "../../lib/auth/auth";

const Login = () => {
  const { status } = useAppSelector(selectAuth);
  const initialized = status === "initialized";

  const onLoginClick = () => {
    signUserIn();
  };

  let elem;
  if (initialized) {
    elem = (
      <>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontStyle: "italic",
            color: "primary.main",
          }}
        >
          Budget
        </Typography>
        <Typography>
          Sign in and start saving!
        </Typography>
        <Button onClick={onLoginClick} variant="contained">Sign in with Google</Button>
      </>
    );
  } else {
    elem = (
      <>
        <Typography variant="body1">Loading up the good stuff!</Typography>
        <CircularProgress />
      </>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {elem}
      </Box>
    </Container>
  );
};

export default Login;

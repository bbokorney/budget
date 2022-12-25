import {
  getAuth,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { updateUser, updateError } from "./authSlice";
import { store } from "../store/store";

const { dispatch } = store;

const auth = getAuth();
const provider = new GoogleAuthProvider();

onAuthStateChanged(auth, (user) => {
  if (user) {
    const { uid, email, displayName } = user;
    dispatch(updateUser({ id: uid, email, displayName }));
  } else {
    dispatch(updateUser(null));
  }
});

export const signUserIn = () => {
  signInWithRedirect(auth, provider)
    .catch((error) => dispatch(updateError(JSON.stringify(error))));
};

export const signUserOut = () => {
  signOut(auth)
    .then(() => window.location.reload())
    .catch((error) => dispatch(updateError(JSON.stringify(error))));
};

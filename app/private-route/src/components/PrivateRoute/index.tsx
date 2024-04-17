//@ts-ignore
import useHasUserLogged from "../../hooks/hasUser.hook";
import { navigateToUrl } from "single-spa";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { hasUser } = useHasUserLogged();

  if (hasUser === null) {
    return null;
  }

  if (!hasUser) {
    navigateToUrl("/auth/login");
    return null;
  }

  return children;
};

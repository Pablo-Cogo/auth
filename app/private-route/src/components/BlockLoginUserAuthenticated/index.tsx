//@ts-ignore
import useHasUserLogged from "../../hooks/hasUser.hook";
import { navigateToUrl } from "single-spa";

export const BlockLoginUserAuthenticated = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { hasUser } = useHasUserLogged();

  if (hasUser === null) {
    return null;
  }

  if (hasUser) {
    navigateToUrl("/app");
    return null;
  }

  return children;
};

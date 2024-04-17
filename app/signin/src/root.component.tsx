import LoginPage from "./pages";
//@ts-ignore
import { BlockLoginUserAuthenticated } from "@app/private-route";
export default function Root(props) {
  return (
    <BlockLoginUserAuthenticated>
      <LoginPage />
    </BlockLoginUserAuthenticated>
  );
}

import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import SignUp from "./pages";
import MailSignUp from "./pages/mail";
import { SignUpContainer } from "@app/util-ui";
//@ts-ignore
import { BlockLoginUserAuthenticated } from "@app/private-route";

export default function Root(props) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth/signup"
            element={
              <BlockLoginUserAuthenticated>
                <SignUpContainer>
                  <Outlet />
                </SignUpContainer>
              </BlockLoginUserAuthenticated>
            }
          >
            <Route index element={<SignUp />} />
            <Route path="mail" element={<MailSignUp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

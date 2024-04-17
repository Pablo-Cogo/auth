//@ts-ignore
import { Button, GoogleButton, Input, Link, LogoDefault } from "@app/util-ui";
import { useRef } from "react";
import { AuthService } from "@app/util-auth";
import { navigateToUrl } from "single-spa";

export default function LoginPage(props) {
  const userEmailRef = useRef<HTMLInputElement | null>(null);
  const userPasswordRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_email = userEmailRef.current.value;
    const user_password = userPasswordRef.current.value;
    const retorno = await AuthService.login({ user_email, user_password });
    if (retorno) {
      navigateToUrl("/app");
    }
  };

  return (
    <section className="flex min-h-full overflow-hidden">
      <article className="flex w-full justify-center sm:my-6">
        <div className="flex flex-col grow w-full sm:max-w-[350px]">
          <form
            onSubmit={handleSubmit}
            className="px-14 py-10 sm:border sm:border-solid sm:border-[rgb(219,219,219)] sm:mb-2.5 sm:py-2.5 sm:px-10 sm:rounded-sm sm:flex sm:flex-col sm:items-center sm:px-6"
          >
            <h1 className="text-center text-3xl font-medium tracking-tight text-gray-900 md:my-6">
              <LogoDefault className="max-w-[175px] md:scale-[1.4] w-full m-auto" />
            </h1>
            <Input
              ref={userEmailRef}
              id={"userEmail"}
              label="Email"
              type="email"
              className="mt-3"
              required
            />
            <Input
              ref={userPasswordRef}
              type="password"
              id="userPassword"
              label="Senha"
              className="mt-3"
              required
            />
            <Link
              className="w-full flex justify-end mt-2 mb-2 font-semibold"
              typing="danger"
              href="/#"
            >
              Esqueceu a senha?
            </Link>
            <Button type="submit" className="mt-3 w-full" typing="primary">
              Entrar
            </Button>
            <span className="w-full flex justify-center mt-4 md:mt-6 font-semibold">
              Não tem uma conta?
              <Link
                className="ml-0.5 uppercase font-semibold"
                href="/auth/signup"
                typing="danger"
              >
                cadastre-se
              </Link>
            </span>
            <div className="mx-auto my-4 mb:my-6 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
              ou
            </div>
            <GoogleButton
              // onClick={() => getUrlGoogleLogin("/auth/callback")}
              type="button"
              className="sm:mb-5 md:mb-7"
            />
          </form>
        </div>
      </article>
    </section>
  );
}

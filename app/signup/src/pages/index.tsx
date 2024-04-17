import { Button, GoogleButton, Link, SignUpContainer } from "@app/util-ui";
const SignUp = () => {
  return (
    <>
      <h2 className="mb-[40px] font-bold text-2xl">Cadastrar-se</h2>
      <GoogleButton
        className="!h-[56px] !rounded-full"
        // onClick={() => getUrlGoogleLogin("/auth/callback")}
      />
      <div className="mx-auto my-4 mb:my-6 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        ou
      </div>
      <Button
        href="/auth/signup/mail"
        variant="outline"
        typing="primary"
        className="w-full font-medium !h-[56px] !rounded-full"
      >
        Continue com Email
      </Button>
      <span className="w-full flex justify-center mt-4 md:mt-6">
        Já tem uma conta?
        <Link
          typing={"danger"}
          className="ml-0.5 font-medium uppercase"
          href="/auth/login"
        >
          Faça login
        </Link>
      </span>
    </>
  );
};

export default SignUp;

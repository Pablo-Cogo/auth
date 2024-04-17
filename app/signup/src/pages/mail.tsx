import { Back, Button, Input, Link, SignUpContainer } from "@app/util-ui";
import { useEffect, useState } from "react";

export interface SignUpMailProps {
  userName: string;
  userEmail: string;
  personPhone?: string;
  userCpf?: string;
  userDate?: string;
  userPassword?: string;
  userConfirmPassword?: string;
  userImage?: string;
}

export interface SignUpMailMasksProps {
  userCpf?: string;
}

const MailSignUp = () => {
  const [userSignUp, setUserSignUp] = useState<SignUpMailProps | null>(null);
  const [hasGoogle, setHasGoogle] = useState<boolean | null>(false);
  const [userSignUpMarkered, setUserSignUpMaskered] =
    useState<SignUpMailMasksProps | null>(null);

  return (
    <form>
      <Back href="./" />
      <h2 className="mb-[20px] font-bold text-2xl">Cadastrar-se</h2>
      <Input
        id={"userName"}
        label="Nome completo"
        type="text"
        className="mt-4"
        required={true}
        val={userSignUp?.userName ?? ""}
        value={userSignUp?.userName ?? ""}
        // onChange={(e) => change.noMask(e, setUserSignUp)}
      />
      <Input
        id={"userCpf"}
        label="CPF"
        type="tel"
        className="mt-4"
        required={true}
        val={userSignUpMarkered?.userCpf ?? ""}
        value={userSignUpMarkered?.userCpf ?? ""}
        // onChange={(e) =>
        //   change.valuesMaskered(
        //     e,
        //     setUserSignUpMaskered,
        //     setUserSignUp,
        //     masks.cpfMask,
        //     masks.resetMask
        //   )
        // }
      />
      <Input
        id={"userDate"}
        label="Data de nascimento"
        type="text"
        className="mt-4"
        required={true}
        val={userSignUp?.userDate ?? ""}
        value={userSignUp?.userDate ?? ""}
        // onChange={(e) => change.valuesMask(e, setUserSignUp, masks.dataMask)}
      />
      <Input
        id={"userEmail"}
        label="Email"
        type="email"
        className="mt-4"
        val={userSignUp?.userEmail ?? ""}
        value={userSignUp?.userEmail ?? ""}
        // onChange={(e) => change.noMask(e, setUserSignUp)}
      />
      {hasGoogle === false ? (
        <>
          <Input
            type="password"
            id="userPassword"
            label="Senha"
            className="mt-4"
            required={true}
            val={userSignUp?.userPassword ?? ""}
            // onChange={(e) => change.noMask(e, setUserSignUp)}
          />
          <Input
            type="password"
            id="userConfirmPassword"
            label="Confirmar senha"
            className="mt-4"
            required={true}
            val={userSignUp?.userConfirmPassword ?? ""}
            // onChange={(e) => change.noMask(e, setUserSignUp)}
          />
        </>
      ) : null}
      <Button type="submit" className="mt-[20px] w-full" typing="primary">
        Cadastrar-se
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
    </form>
  );
};

export default MailSignUp;

import { useEffect, useState } from "react";
//@ts-ignore
import { AuthService } from "@app/util-auth";

const useHasUserLogged = () => {
  const [hasUser, setHasUser] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const isAuthenticated = await AuthService.validateToken();
      setHasUser(isAuthenticated);
    };

    fetchData();
  }, []);

  return {
    hasUser,
  };
};

export default useHasUserLogged;

import React, { createContext, useEffect, useState } from "react";
import { GetUser, SingIn, SingOut, SingUp } from "../services/supabase/auth";
import { showToast } from "../services/toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [auth, setAuth] = useState(!!user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { user } = await GetUser();

        if (!user) throw new Error();

        setUser(user);
        setAuth(!!user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  async function singIn(email, password) {
    try {
      const { user, session } = await SingIn({
        email: email,
        password: password,
      });

      if (!user) throw new Error();
      if (!session) throw new Error();

      setUser(user);
      setSession(session);
      showToast({
        type: "success",
        title: "Sucesso!",
        subtitle: "Login realizado com sucesso",
      });
      setAuth(!!user);
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro ao conectar-se!",
        subtitle: "Email ou senha inválido!",
      });
    }
  }

  async function singUp(name, email, password) {
    try {
      const { user, session } = await SingUp({ email, password, name });

      if (!user) throw new Error();
      if (!session) throw new Error();

      setUser(user);
      setSession(session);
      showToast({
        type: "success",
        title: "Sucesso!",
        subtitle: "Conta criada!",
      });
      setAuth(!!user);
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro ao criar conta!",
        subtitle: "Tente novamente mais tarde!",
      });
    }
  }

  async function singOut() {
    try {
      await SingOut();
      setUser(null);
      setSession(false);

      showToast({
        type: "success",
        title: "Sucesso!",
        subtitle: "Sessão encerrada!",
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Erro ao desconectar!",
        subtitle: "Tente novamente mais tarde!",
      });
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, session, auth, singIn, singUp, singOut }}>
      {children({ auth })}
    </AuthContext.Provider>
  );
};
export default AuthContext;

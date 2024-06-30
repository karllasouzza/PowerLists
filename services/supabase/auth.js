import { supabase } from "../../lib/supabase";

export const GetUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;
    if (!data) throw new Error("Data not found");
    if (!data.user) throw Error("User not found");

    return { user: data.user };
  } catch (error) {
    return new Error(error);
  }
};

export const SingUp = async ({ email, password, name }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) throw error;
    if (!data.session) throw new Error("Data not found");
    if (!data.user && data.user !== null) throw Error("User not found");

    return { user: data.user, session: data.session };
  } catch (error) {
    return new Error(error);
  }
};

export const SingIn = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;
    if (!data) throw new Error("Data not found");
    if (!data.user && data.user !== null) throw Error("User not found");

    return { user: data.user, session: data.session };
  } catch (error) {
    return new Error(error);
  }
};

export const SingOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return true;
  } catch (error) {
    return new Error(error);
  }
};

export const ResetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "powerlists.project://PasswordRecovery",
    });
    if (error) throw error;

    return true;
  } catch (error) {
    return new Error(error);
  }
};

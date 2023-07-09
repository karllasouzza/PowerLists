import { supabase } from "../../lib/supabase";

export const GetUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    console.log("DATA", data);

    if (error) throw error;
    if (!data) throw new Error("Data not found");
    if (!data.user) throw Error("User not found");

    return { user: data.user };
  } catch (error) {
    console.log(error);
    return false;
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

    console.log("DATA", data);

    if (error) throw error;
    if (!data.session) throw new Error("Data not found");
    if (!data.user) throw Error("User not found");

    return { user: data.user, session: data.session };
  } catch (error) {
    console.log(error);
    return false;
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
    if (!data.user) throw Error("User not found");

    return { user: data.user, session: data.session };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const SingOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

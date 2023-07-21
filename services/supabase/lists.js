import { supabase } from "../../lib/supabase";
import { GetUser } from "./auth";

export const GetLists = async () => {
  try {
    const { user } = await GetUser();
    const { data, error } = await supabase
      .from("Lists")
      .select(
        `*, List_item (
        price,
        amount,
        status
      )`
      )
      .eq("user_id", user.id);

    if (error) throw error;
    if (!data) throw new Error("Data not found");

    return { data };
  } catch (error) {
    return new Error(error);
  }
};

export const NewList = async (title) => {
  try {
    const { user } = await GetUser();

    const { error } = await supabase
      .from("Lists")
      .insert({ user_id: user.id, title: title });

    if (error) throw error;

    return true;
  } catch (error) {
    return new Error(error);
  }
};

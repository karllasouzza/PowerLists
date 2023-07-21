import { supabase } from "../../lib/supabase";

export const GetListItems = async (list_id) => {
  try {
    const { data, error } = await supabase
      .from("List_item")
      .select(`*`)
      .eq("lists_id", list_id);

    if (error) throw error;
    if (!data) throw new Error("Data not found");

    return { data };
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};

export const NewItem = async (title, price, amount, list_id) => {
  try {

    console.log({ title: title, price: price, status: false, amount: amount, lists_id: list_id })
    const { error } = await supabase
      .from("List_item")
      .insert({ title: title, price: price, status: false, amount: amount, lists_id: list_id });

      console.log(error)
    if (error) throw error;

    return true;
  } catch (error) {
    return new Error(error);
  }
};

export const DeleteListItems = async (itemId) => {
  try {
    const { error } = await supabase
      .from("List_item")
      .delete()
      .eq("id", itemId);

    if (error) throw error;

    return true;
  } catch (error) {
    return new Error(error);
  }
};

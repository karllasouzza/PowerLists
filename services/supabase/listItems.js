import { supabase } from "../../lib/supabase";
import { showToast } from "../toast";

export const GetItems = async (list_id) => {
  try {
    const { data, error } = await supabase
      .from("List_item")
      .select(`*`)
      .eq("lists_id", list_id)
      .order("status", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    if (!data) throw new Error("Data not found");

    return { data };
  } catch (error) {
    showToast({
      type: "error",
      title: "Erro ao listar os produtos!",
      subtitle: "Tente reiniciar o APP!",
    });
  }
};

export const NewItem = async (title, price, amount, list_id) => {
  try {
    const { error } = await supabase.from("List_item").insert({
      title: title,
      price: price,
      status: false,
      amount: amount,
      lists_id: list_id,
    });

    if (error) throw error;

    return true;
  } catch (error) {
    showToast({
      type: "error",
      title: "Erro ao inserir o produto!",
      subtitle: "Tente reiniciar o APP!",
    });
  }
};

export const CheckItem = async (id, status) => {
  try {
    const { error } = await supabase
      .from("List_item")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return false;
  } catch (error) {
    showToast({
      type: "error",
      title: "Erro ao marcar produto!",
      subtitle: "Tente reiniciar o APP!",
    });
  }
};

export const EditItem = async (id, title, price, amount) => {
  try {
    const { error } = await supabase
      .from("List_item")
      .update({ title, price, amount })
      .eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    showToast({
      type: "error",
      title: "Erro ao editar produto!",
      subtitle: "Tente reiniciar o APP!",
    });
  }
};

export const DeleteItems = async (itemId) => {
  try {
    const { error } = await supabase
      .from("List_item")
      .delete()
      .eq("id", itemId);

    if (error) throw error;

    return true;
  } catch (error) {
    showToast({
      type: "error",
      title: "Erro ao deletar o produto!",
      subtitle: "Tente reiniciar o APP!",
    });
  }
};

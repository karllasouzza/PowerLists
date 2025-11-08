import { supabase } from "../../lib/supabase";
import { showToast } from "../toast";
import { GetUser } from "./auth";

export const GetLists = async () => {
  try {
    const { user } = await GetUser();
    const { data, error } = await supabase
      .from("Lists")
      .select(
        `*, List_item (
        id,
        price,
        amount,
        status
      )`
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    if (!data) throw new Error("Data not found");

    return { data };
  } catch (error) {
    showToast({
      type: "error",
      title: "Erro ao carregar as listas!",
      subtitle: "Tente reiniciar o APP!",
    });
  }
};

export const NewList = async (title, color, icon) => {
  try {
    const { user } = await GetUser();

    const { error } = await supabase
      .from("Lists")
      .insert({
        user_id: user.id,
        title: title,
        accent_color: color,
        icon: icon,
      });

    if (error) throw error;

    return true;
  } catch (error) {
    showToast({
      type: "error",
      title: "Erro ao criar lista!",
      subtitle: "Tente reiniciar o APP!",
    });
  }
};

export const EditList = async (id, title, color, icon) => {
  try {
    const { error } = await supabase
      .from("Lists")
      .update({ title: title, accent_color: color, icon: icon })
      .eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    showToast({
      type: "error",
      title: "Erro ao editar lista!",
      subtitle: "Tente reiniciar o APP!",
    });
  }
};

export const DeleteList = async (id) => {
  try {
    const { error } = await supabase.from("Lists").delete().eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    showToast({
      type: "error",
      title: "Erro ao deletar lista!",
      subtitle: "Tente reiniciar o APP!",
    });
  }
};

import { supabase } from "../../../lib/supabase";
import { GetUser } from "../auth";

export const UseRealtimeItems = async (list_id, items, setItems) => {
  try {
    const { user } = await GetUser();
    if (!user) throw new Error();

    supabase
      .channel("List_item")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "List_item",
          filter: `lists_id=eq.${list_id}`,
        },
        (payload) => {
          setItems([...items, payload.new]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "List_item",
          filter: `lists_id=eq.${list_id}`,
        },
        (payload) => {
          console.log(payload);
          setItems(
            items.map((item) =>
              item.id !== payload.old.id ? item : payload.new
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "List_item",
          filter: `lists_id=eq.${list_id}`,
        },
        (payload) => {
          const newItem = items.filter((item) => item.id !== payload.old.id);
          setItems(newItem);
        }
      )
      .subscribe();
  } catch (error) {}
};

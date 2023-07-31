import { supabase } from "../../../lib/supabase";
import { GetUser } from "../auth";

export const UseRealtimeLists = async (lists, setLists) => {
  const { user } = await GetUser();

  supabase
    .channel("Lists")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "Lists",
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        setLists([...lists, { ...payload.new, List_item: [] }]);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "Lists",
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        setLists(
          lists.map((list) =>
            list.id !== payload.old.id
              ? list
              : { ...payload.new, List_item: list.List_item }
          )
        );
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "Lists",
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        const newList = lists.filter((list) => list.id !== payload.old.id);
        setLists(newList);
      }
    )
    .subscribe();
};

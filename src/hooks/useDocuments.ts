import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type DocumentRow = {
  id: string;
  title: string;
  file_type: string;
  pages: number;
  created_at: string;
};

export function useDocuments(enabled = true) {
  return useQuery({
    queryKey: ["documents"],
    enabled,
    queryFn: async (): Promise<DocumentRow[]> => {
      const { data, error } = await supabase
        .from("documents")
        .select("id, title, file_type, pages, created_at")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

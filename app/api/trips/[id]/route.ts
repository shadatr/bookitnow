import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const data = await supabase
        .from("tb_reservations")
        .select("*")
        .eq("user_id", params.id).order('id', { ascending: true });
  
      return new Response(JSON.stringify({ message: data }), {
        status: 200,
        headers: { revalidate: dynamic },
      });
    } catch (error) {
      console.error("Error fetching files: ", error);
      return new Response(JSON.stringify({ message: "An error occurred" }), {
        status: 500,
      });
    }
  }
  
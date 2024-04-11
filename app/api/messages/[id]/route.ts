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
      const messages = await supabase
        .from("tb_messages")
        .select("*")
        .eq("place_id", params.id).order('id', { ascending: true });

      return new Response(JSON.stringify({ message: messages }), {
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
  
export async function POST(request: Request) {
    const data = await request.json();
  
    try {
      const res=await supabase.from("tb_messages").insert([data]);
  
      return new Response(
        JSON.stringify({ message: "Account created successfully" }),
        {
          headers: { "content-type": "application/json" },
        }
      );
    } catch (error) {
      return new Response(JSON.stringify({ message: "There is a problem" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    }
  }
  
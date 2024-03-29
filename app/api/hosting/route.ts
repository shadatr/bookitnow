import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(request: Request) {
  const dataReq = await request.json();

  try {
    const data = await supabase.from("tb_places").insert(dataReq).select();

    return new Response(JSON.stringify({ message: data }), {
      status: 200,
      headers: { revalidate: dynamic },
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
    return new Response(JSON.stringify({ message: "An error occurred" }), {
      status: 500,
    });
  }
}


export async function GET(request: Request) {
  try {

    const data = await supabase
      .from("tb_places")
      .select("*");

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

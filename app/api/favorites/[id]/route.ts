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
      .from("tb_favorites")
      .select("*")
      .eq("user_id", params.id);

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

export async function POST(request: Request) {
  const dataReq = await request.json();

  try {
    const data1 = await supabase
      .from("tb_favorites")
      .select("*")
      .eq("user_id", dataReq.user_id)
      .eq("place_id", dataReq.place_id);

    const parsedData = JSON.parse(JSON.stringify(data1));
    const favData = parsedData.data;
    const datafav = favData;
    console.log(datafav.length);
    if (datafav.length != 0) {
      const data2 = await supabase
        .from("tb_favorites")
        .delete()
        .eq("user_id", dataReq.user_id)
        .eq("place_id", dataReq.place_id);
      return new Response(
        JSON.stringify({
          message: "The place removed from the favorites successfully",
        })
      );
    } else {
      const data2 = await supabase
        .from("tb_favorites")
        .insert(dataReq)
        .select();
      return new Response(
        JSON.stringify({
          message: "The place added to the favorites successfully",
        })
      );
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return new Response(JSON.stringify({ message: "An error occurred" }), {
      status: 500,
    });
  }
}

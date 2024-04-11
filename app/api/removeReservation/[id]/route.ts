import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(request: Request,  { params }: { params: { id: string } }
    ) {
  const dataReq = await request.json();
        console.log(dataReq)
  try {
    await Promise.all(
        dataReq.map(async (item: any) => {
          await supabase.from("tb_reservations").delete().eq("date", item).eq("place_id", params.id);
        })
      )

    return new Response(JSON.stringify("succsess"), {
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

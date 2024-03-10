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
    const dataRes = await supabase
      .from("tb_reservations")
      .select("*")
      .eq("user_email", params.id)
      .order("id", { ascending: true });

    const parsedDataRes = JSON.parse(JSON.stringify(dataRes));
    const messageDataRes = parsedDataRes.data;
    const dataReservations = messageDataRes;

    const dataMes = await supabase
      .from("tb_messages")
      .select("*");

    const parsedData = JSON.parse(JSON.stringify(dataMes));
    const messageData = parsedData.data;
    const dataMessages = messageData;

    const uniqueRes = new Set(dataReservations.map((item:any) => item.place_id));
    const uniqueResArray = [...uniqueRes];

    const prerequisitePromises = uniqueResArray.map(async (item: any) => {
      const response = await supabase
        .from("tb_places")
        .select("*")
        .eq("id", item);

      const data2: { [key: string]: any }[] = response.data || [];

      return data2.map((sectionData) => ({
        place: sectionData,
        messages:dataMessages.filter((i:any)=>i.reciever_id==params.id||i.sender_id==params.id&&i.place_id==sectionData.id),
        reservations: dataReservations.filter((i:any)=>i.place_id==sectionData.id&&i.user_email==params.id),
      }));
    });

    const prerequisiteData = await Promise.all(prerequisitePromises);
    const prerequisites = prerequisiteData.flat();

    console.log(prerequisites)

    return new Response(JSON.stringify({ message: prerequisites }), {
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

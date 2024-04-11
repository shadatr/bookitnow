import { ReservationsType } from "@/types";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET(
  request: Request,
  { params }: { params: { params: string } }
) {
  try {
    const searchParams = new URLSearchParams(params.params);
    const country = searchParams.get("country");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const guest_number = searchParams.get("guest_number");
    const placeType = searchParams.get("placeType");
    const startPrice = searchParams.get("startPrice");
    const endPrice = searchParams.get("endPrice");
    const bedRoomNumber = searchParams.get("bedRoomNumber");
    const bedNumber = searchParams.get("bedNumber");
    const bathroomNumber = searchParams.get("bathroomNumber");
    const PlaceAmenities = searchParams.get("amenities");
    const amenityList = PlaceAmenities ? PlaceAmenities.split(",") : [];

    let resData:ReservationsType[] = [];
    if(startDate&&endDate){
      const days = [];
      let currentDate = new Date(startDate);
      const endDateFormat = new Date(endDate);
  
      while (currentDate <= endDateFormat) {
        const dateTimeString = currentDate.toISOString();
        const parts = dateTimeString.split("T");
        const dateString = parts[0];
        days.push(dateString);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      const {data}= await supabase.from("tb_reservations").select("*").in("date",days);
      if(data){
        resData.push(data as unknown as ReservationsType);
      }
    }

    const query = supabase.from("tb_places").select("*");

    if (country) {
      query.eq("country", country);
    }

    if (guest_number) {
      query.eq("guest_number", guest_number);
    }

    if (placeType) {
      query.eq("placeType", placeType);
    }

    if (startPrice) {
      query.gte("price", startPrice);
    }

    if (endPrice) {
      query.lte("price", endPrice);
    }

    if (bedRoomNumber) {
      query.eq("bed_room_number", bedRoomNumber);
    }

    if (bedNumber) {
      query.eq("bed_number", bedNumber);
    }

    if (bathroomNumber) {
      query.eq("bath_room_number", bathroomNumber);
    }

    if (amenityList.length > 0) {
      query.contains("amenities", amenityList);
    }

    if (resData.length > 0) {
      const excludedIds = resData.flat().map((i) => i.place_id);
      excludedIds.map((i)=>
      query.neq('id',i)
      )
    }

    const data = await query;
    console.log(data)
    console.log(query)

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

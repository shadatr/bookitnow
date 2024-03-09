
export const dynamic = "force-dynamic";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY||"");
const host = process.env.NEXT_PUBLIC_HOST;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(request: Request) {
    const {data, amount ,name} = await request.json();
  
    try {

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: name,
              },
              unit_amount: amount * 100 || 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        cancel_url: `${host}/payment/error`,
        success_url: `${host}/payment/success`,
      });

      console.log(data)

      await Promise.all(
        data.days.map(async (item: any) => {
            const data2={
              user_id:data.user_id,
                place_id:data.place_id,
                date:item
            }
          await supabase.from("tb_reservations").insert(data2);
        })
      )

      return new Response(JSON.stringify({ sessionId: session.id }), {
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
  

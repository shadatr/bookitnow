"use client";
import SearchBar from "@/components/SearchBar";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { FavoritesType, PlaceType } from "@/types";
import { Session } from "@supabase/supabase-js";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function Home() {
  const [hostedPlaces, setHostedPlaces] = useState<PlaceType[]>([]);
  const [favorites, setFavorites] = useState<FavoritesType[]>([]);
  const [session, setSession] = useState<Session | null>();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const handleUpload = async () => {
      const data = await axios.get(`/api/hosting`);
      setHostedPlaces(data.data.message.data);
      const data3 = await supabase.auth.getSession();
      setSession(data3.data.session);
      const data4 = await axios.get(
        `/api/favorites/${data3.data.session?.user.id}`
      );
      setFavorites(data4.data.message.data);
    };
    handleUpload();
  }, [refresh]);

  const handleAddToFavorites = (hostedPlace_id?:number) =>{
    const data={
      user_id:session?.user.id,
      place_id:hostedPlace_id
    }
    axios.post("/api/favorites/1",data).then((res)=>{
    toast({
      className: "rounded-[5px] p-4 text-green-600",
      description:  res.data.message
    })
    setRefresh(!refresh)}
    )
    
  }
  
  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <SearchBar />
      <div className="mt-10 text-[15px] grid grid-cols-4">
        {hostedPlaces.map((item, index) => (
            [<FaHeart
            size={30}
            onClick={()=>handleAddToFavorites(item.id)}
              className={`absolute cursor-pointer m-3 z-10
               ${ favorites.find((i) => i.place_id == item?.id)
                  ? "text-pink"
                  : "" }
              `}
            />,
          <Link href={`/place/${item.id}`} className="w-[280px] " key={index}>
            <Image
              alt="image"
              src={item.images[0]}
              width={50}
              height={50}
              className="w-[280px] h-[280px] rounded-[10px]"
            />
            <p className="font-bold pt-2">{item.place_name}</p>
            <p>
              {item.country}, {item.province}
            </p>
            <p className="font-bold">{item.price}$ night</p>
          </Link>]
        ))}
      </div>
    </div>
  );
}

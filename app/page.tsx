"use client";
import SearchBar from "@/components/SearchBar";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { FavoritesType, PlaceType } from "@/types";
import { Session } from "@supabase/supabase-js";
import axios from "axios";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import "ldrs/dotWave";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";

function Home() {
  const [hostedPlaces, setHostedPlaces] = useState<PlaceType[]>([]);
  const [favorites, setFavorites] = useState<FavoritesType[]>([]);
  const [session, setSession] = useState<Session | null>();
  const [refresh, setRefresh] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleUpload = async () => {
      let url;
      if (searchParams.toString()) {
        url = `/api/searchBar/${searchParams.toString()}`;
      } else {
        url = "/api/hosting";
      }

      const data = await axios.get(url);
      setHostedPlaces(data.data.message.data);
      const data3 = await supabase.auth.getSession();
      setSession(data3.data.session);
      const data4 = await axios.get(
        `/api/favorites/${data3.data.session?.user.id}`
      );
      setFavorites(data4.data.message.data);
      setLoaded(true);
      console.log(searchParams.toString());
    };
    handleUpload();
  }, [refresh, searchParams]);

  console.log(session?.user);

  const handleAddToFavorites = (hostedPlace_id?: number) => {
    const data = {
      user_id: session?.user.id,
      place_id: hostedPlace_id,
    };
    axios.post("/api/favorites/1", data).then((res) => {
      toast({
        className: "rounded-[5px] p-4 text-green-600",
        description: res.data.message,
      });
      setRefresh(!refresh);
    });
  };


  return (
    <>
      <Header />
      <div className="w-full flex flex-col items-center justify-center ">
        {loaded ? (
          <div className="w-full flex flex-col items-center justify-center ">
            <SearchBar />
            <div className="mt-5 text-[15px] grid lg:grid-cols-4 gap-3 pb-10">
              {hostedPlaces?.map((item, index) => (
                <div className="w-[300px] ">
                  {session?.user.id && (
                    <FaHeart
                      size={30}
                      onClick={() => handleAddToFavorites(item.id)}
                      className={`absolute cursor-pointer m-3 z-10
               ${
                 favorites.find((i) => i.place_id == item?.id)
                   ? "text-pink"
                   : ""
               }
              `}
                    />
                  )}
                  <Link
                    href={`/user/place/${item.id}`}
                    className="w-[280px] flex-col flex"
                    key={index}
                  >
                    <div className=" relative flex items-center justify-center">
                      <DirectionAwareHover imageUrl={item.images[0]}>
                        <p className="font-bold text-[18px]">
                          {item.country}, {item.province}
                        </p>
                        <p className="font-normal text-sm">
                          ${item.price} / night
                        </p>
                      </DirectionAwareHover>
                    </div>
                    <span className="font-bold text-[17px] px-2">
                      {item.place_name}
                    </span>
                    <span className="px-2 text-xsm text-gray-500">
                      Hosted by {item.host_name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[80vh] flex items-center justify-center">
            <div className="container">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}

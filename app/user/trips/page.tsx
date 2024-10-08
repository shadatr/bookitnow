"use client";
import { supabase } from "@/lib/supabase";
import { PlaceType, ReservationsType } from "@/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const Page = () => {
  const [trips, setTrips] = useState<ReservationsType[]>([]);
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [uniquePlaces, setUniquePlaces] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleUpload = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/auth/login");
      }
      const session = await supabase.auth.getSession();
      const id = session.data.session?.user.id;

      const data1 = await axios.get(`/api/trips/${id}`);
      setTrips(data1.data.message.data);

      const placesPromises = data1.data.message.data.map(async (place: any) => {
        const responseReq = await axios.get(
          `/api/hosted_place/${place.place_id}`
        );
        const placeMessage = responseReq.data.message.data;
        return placeMessage;
      });

      const placesData = await Promise.all(placesPromises);
      setPlaces(placesData.flat());

      const uniquePl = new Set(
        data1.data.message.data.map((item: ReservationsType) => item.place_id)
      );
      const uniqueArray = [...uniquePl];
      const uniqueStringArray = uniqueArray.map((item) => item as number);
      setUniquePlaces(uniqueStringArray);
      setLoaded(true)
    };
    handleUpload();
  }, []);

  return (
    <div className="w-[100%] flex justify-start items-center pt-10">
      {loaded? 
      <div className="flex flex-col">
        <div className="text-xmd font-bold lg:px-10 sm:px-5">Your Trips</div>
        <div className="border-b border-lightGray w-screen" />
        {uniquePlaces.length ? (
          uniquePlaces.map((item, index) => {
            const selectedPlace = places.find((i) => i?.id == item);
            const selectedTrips = trips.filter((i) => i.place_id == item);
            return (
              <>
                <Link
                  className="flex gap-5 lg:p-10 sm:p-5 sm:flex-col lg:flex-row"
                  href={`/user/hosted-place/${selectedPlace?.id}`}
                >
                  <Image
                    src={selectedPlace?.images[0] || ""}
                    alt="image"
                    width={100}
                    height={100}
                    className="w-[200px] h-[140px] rounded-[10px]"
                  />
                  <div>
                    <div className="lg:text-md sm:text-sm font-medium">
                      {selectedPlace?.place_name}
                    </div>
                    <div className="font-bold">
                      {selectedPlace?.price
                        ? selectedPlace?.price * selectedTrips.length * 0.1 +
                          selectedPlace?.price * selectedTrips.length
                        : ""}
                      $
                    </div>
                    <div>
                      {selectedPlace?.country}, {selectedPlace?.province}
                    </div>
                  </div>
                  <div className="flex flex-col lg:pl-20">
                    {selectedTrips.map((i) => (
                      <p>{i.date}</p>
                    ))}
                  </div>
                </Link>
                <div className="border-b border-lightGray w-screen" />
              </>
            );
          })
        ) : (
          <div className="lg:p-10 sm:p-5 w-full items-center justify-center">
            <div className="p-3">You don't have any trips yet!</div>
          </div>
        )}
      </div>
      :<div className="h-[60vh] flex items-center justify-center w-[90%]">
      <div className="container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>}
    </div>
  );
};

export default Page;

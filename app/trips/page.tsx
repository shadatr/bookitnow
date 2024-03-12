"use client"
import { supabase } from '@/lib/supabase';
import { PlaceType, ReservationsType } from '@/types';
import axios from 'axios';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = async () => {
    const [trips, setTrips] = useState<ReservationsType[]>([]);
    const [places, setPlaces] = useState<PlaceType[]>([]);
    const [uniquePlaces, setUniquePlaces] = useState<number[]>([]);

    const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/')
  }
  useEffect(() => {
    const handleUpload = async () => {
      const session = await supabase.auth.getSession();
      const id = session.data.session?.user.id;

      const data = await axios.get(`/api/trips/${id}`);
      setTrips(data.data.message.data);

      const placesPromises = data.data.message.data.map(async (place:any) => {
        const responseReq = await axios.get(`/api/hosted_place/${place.place_id}`);
        const placeMessage  =
          responseReq.data.message.data;
        return placeMessage;
      });

      const placesData = await Promise.all(placesPromises);
      setPlaces(placesData.flat())

      const uniquePl = new Set(data.data.message.data.map((item: ReservationsType) => item.place_id));
      const uniqueArray = [...uniquePl];
      const uniqueStringArray = uniqueArray.map(item => item as number); // Explicit cast
      setUniquePlaces(uniqueStringArray);
    };
    handleUpload();
  }, []);

  return (
    <div className='w-[100%] flex justify-center items-center pt-40'><table className="w-[1200px] border-collapse border border-gray-200 rounded-[10px]">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-3 text-left">NAME</th>
        <th className="p-3 text-left">PRICE</th>
        <th className="p-3 text-left">LOCATION</th>
        <th className="p-3 text-left">BOOKED NIGHTS</th>
      </tr>
    </thead>
    <tbody>
      {uniquePlaces.length ? (
        uniquePlaces.map((item, index) => {
            const selectedPlace=places.find((i)=> i.id==item)
            const selectedTrips= trips.filter((i)=>i.place_id==item)
            return(
          <tr className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
            <td className="p-3">
              <Link href={`/hosted-place/${selectedPlace?.id}`}>
                {selectedPlace?.place_name}
              </Link>
            </td>
            <td className="p-3">{selectedPlace?.price
                  ? selectedPlace?.price * selectedTrips.length * 0.1 +
                  selectedPlace?.price *selectedTrips.length
                  : ""}</td>
            <td className="p-3">
              {selectedPlace?.country}, {selectedPlace?.province}
            </td>
            <td className="p-3">
              {selectedTrips.map((i)=>i.date+"/")}
            </td>
          </tr>
        )})
      ) : (
        <tr className="p-3 w-full items-center justify-center">
          <td colSpan={7} className="p-3">You didn't host any place yet!</td>
        </tr>
      )}
    </tbody>
  </table></div>
  )
}

export default Page
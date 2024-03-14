"use client";
import { supabase } from "@/lib/supabase";
import { PlaceType } from "@/types";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";


const Page = () => {
  const [hostedPlaces, setHostedPlaces] = useState<PlaceType[]>([]);
  const router = useRouter()

  useEffect(() => {
    const handleUpload = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.push('/login')
      }
      const session = await supabase.auth.getSession();
      const id = session.data.session?.user.id;

      const data1 = await axios.get(`/api/hosting/${id}`);
      setHostedPlaces(data1.data.message.data);
      console.log(data1.data.message.data);
    };
    handleUpload();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-screen pt-24 ">
      <motion.div
              whileHover={{ y: 3 }}
              transition={{ duration: 0.5 }} className="flex justify-end items-center w-[80vw]">
        <Link
          href="/hosting/become-a-host"
          className="bg-pink rounded-[20px] p-3 my-5 font-bold text-secondary-50 shadow-lg"
        >
          Add new place
        </Link>
      </motion.div>
      <table className="w-[1200px] border-collapse border border-gray-200 rounded-[10px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">NAME</th>
            <th className="p-3 text-left">STATUS</th>
            <th className="p-3 text-left">PRICE</th>
            <th className="p-3 text-left">BEDROOMS</th>
            <th className="p-3 text-left">BEDS</th>
            <th className="p-3 text-left">BATHS</th>
            <th className="p-3 text-left">LOCATION</th>
          </tr>
        </thead>
        <tbody>
          {hostedPlaces.length ? (
            hostedPlaces.map((item, index) => (
              <tr className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-3">
                  <Link href={`/hosted-place/${item.id}`}>
                    {item.place_name}
                  </Link>
                </td>
                <td className="p-3">{item.status}</td>
                <td className="p-3">{item.price}</td>
                <td className="p-3">{item.bed_room_number}</td>
                <td className="p-3">{item.bed_number}</td>
                <td className="p-3">{item.bath_room_number}</td>
                <td className="p-3">
                  {item.country}, {item.province}
                </td>
              </tr>
            ))
          ) : (
            <tr className="p-3 w-full items-center justify-center">
              <td colSpan={7} className="p-3">You didn't host any place yet!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default Page;

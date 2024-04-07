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
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleUpload = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/auth/login");
      }
      const session = await supabase.auth.getSession();
      const id = session.data.session?.user.id;

      const data1 = await axios.get(`/api/hosting/${id}`);
      setHostedPlaces(data1.data.message.data);
      setLoading(true);
    };
    handleUpload();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-screen lg:pt-24 sm:pt-16">
      {loading? 
      <><motion.div
          whileHover={{ y: 3 }}
          transition={{ duration: 0.5 }}
          className="flex justify-end items-center w-[80vw]"
        >
          <Link
            href="/user/hosting/become-a-host"
            className="bg-pink rounded-[20px] lg:p-3 lg:my-5 sm:p-2 sm:my-2 lg:text-sm sm:text-xsm font-bold text-secondary-50 shadow-lg"
          >
            Add new place
          </Link>
        </motion.div><table className="lg:w-[1200px] sm:w-[200px] overflow-x-auto border-collapse border border-gray-200 rounded-[10px] lg:text-sm sm:text-xxsm">
            <thead className="bg-gray-100">
              <tr>
                <th className="lg:p-3 sm:p-1 text-left">NAME</th>
                <th className="lg:p-3 sm:p-1 text-left">STATUS</th>
                <th className="lg:p-3 sm:p-1 text-left">PRICE</th>
                <th className="lg:p-3 sm:p-1 text-left">BEDROOMS</th>
                <th className="lg:p-3 sm:p-1 text-left">BEDS</th>
                <th className="lg:p-3 sm:p-1 text-left">BATHS</th>
                <th className="lg:p-3 sm:p-1 text-left">LOCATION</th>
              </tr>
            </thead>
            <tbody>
              {hostedPlaces.length ? (
                hostedPlaces.map((item, index) => (
                  <tr className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-3">
                      <Link href={`/user/hosted-place/${item.id}`}>
                        {item.place_name}
                      </Link>
                    </td>
                    <td className="lg:p-3 sm:p-1">{item.status}</td>
                    <td className="lg:p-3 sm:p-1">{item.price}</td>
                    <td className="lg:p-3 sm:p-1">{item.bed_room_number}</td>
                    <td className="lg:p-3 sm:p-1">{item.bed_number}</td>
                    <td className="lg:p-3 sm:p-1">{item.bath_room_number}</td>
                    <td className="lg:p-3 sm:p-1">
                      {item.country}, {item.province}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="p-3 w-full items-center justify-center">
                  <td colSpan={7} className="p-3">
                    You didn't host any place yet!
                  </td>
                </tr>
              )}
            </tbody>
          </table></>
      :
      <div className="h-[60vh] flex items-center justify-center">
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

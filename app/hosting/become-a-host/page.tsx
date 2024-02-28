'use client'
import React, { useState } from "react";
import Image from "next/image";

const places = [
  { name: "House", icon: "/home.png" },
  { name: "Apartment", icon: "/apartment.png" },
  { name: "Bed & breakfast", icon: "/breakfast.png" },
  { name: "Boat", icon: "/boat.png" },
  { name: "Cabin", icon: "/cabin.png" },
  { name: "Hotel", icon: "/hotel.png" },
];

const page = () => {
    const [place,setPlace]=useState("")

  return (
    <div className="w-screen flex justify-center items-center">
      <div className="w-[950px] flex flex-col justify-center items-center">
        <p className="text-lg font-black p-5">
          Which of these best describes your place?
        </p>
        <div className=" grid grid-cols-3 w-full gap-10">
          {places.map((item) => (
            <div className={`flex flex-col justify-center items-center gap-3 p-16 border rounded-xl hover:cursor-pointer ${place==item.name&&'border-primary border-2'}`} onClick={()=> setPlace(item.name)}>
              <Image src={item.icon} alt={item.name} width={70} height={70} />
              <p className="text-md font-bold">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;

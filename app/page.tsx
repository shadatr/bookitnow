'use client'
import SearchBar from "@/components/SearchBar";
import { PlaceType } from "@/types";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [hostedPlaces, setHostedPlaces] = useState<PlaceType[]>([]);


  useEffect(() => {
    const handleUpload = async () => {
        const data = await axios.get(`/api/hosting`);
        setHostedPlaces(data.data.message.data);   
    };
    handleUpload();
}, []);

  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <SearchBar/>
      <div className="mt-10 text-[15px] grid grid-cols-4">
        {hostedPlaces.map((item, index)=>
          <Link href={`/place/${item.id}`}  className="w-[280px] " key={index}>
            <Image alt="image" src={item.images[0]} width={50} height={50} className="w-[280px] h-[280px] rounded-[10px]"/>
            <p className="font-bold pt-2">{item.place_name}</p>
            <p>{item.country}, {item.province}</p>
            <p className="font-bold">{item.price}$ night</p>
          </Link>
        )}
      </div>
    </div>
  );
}

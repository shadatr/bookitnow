"use client"
import { supabase } from '@/lib/supabase'
import { PlaceType } from '@/types'
import { Select, SelectItem } from '@nextui-org/react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Page = () => {
  const [hostedPlaces, setHostedPlaces]= useState<PlaceType[]>([])
  const placeRef = useRef<HTMLSelectElement>(null);
  const [place, setPlace]= useState<PlaceType>()

  useEffect(()=>{
    const handleUpload=async ()=>{
      const session = await supabase.auth.getSession()
      const id= session.data.session?.user.id;

      const data = await axios.get(`/api/hosting/${id}`);
      setHostedPlaces(data.data.message.data)
      console.log(data.data.message.data)
    }
    handleUpload()
  },[])


  const handlePlaceChange = () => {
    const selectedPlace = hostedPlaces.find((i) => i.place_name === placeRef.current?.value);
    setPlace(selectedPlace);
    console.log(selectedPlace)
    console.log( placeRef.current?.value)
};

return (
    <div className='flex flex-col justify-center items-center w-screen pt-32 '>
      <div className='flex justify-between items-center w-[80vw]'>

        <Select ref={placeRef} label="Select your place" onChange={handlePlaceChange} className='w-[500px]'>
            {hostedPlaces.map((item) => (
                <SelectItem key={item.place_name||1} value={item.place_name}>
                    {item.place_name}
                </SelectItem>
            ))}
        </Select>
        <Link href="/hosting/become-a-host">add host</Link>
      </div>

        <div className=''>
            {place  ? (
                <Tabs defaultValue="account" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">Make changes to your account here.</TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
              </Tabs>
              
            ) : (
                <div>No image available</div>
            )}
        </div>
    </div>
);
}
export default Page
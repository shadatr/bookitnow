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
import { IoFilter } from "react-icons/io5";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { Checkbox } from "@/components/ui/checkbox";
import { dotWave } from "ldrs";

const places = [
  { name: "House", icon: "/home.png" },
  { name: "Apartment", icon: "/apartment.png" },
  { name: "Bed & breakfast", icon: "/breakfast.png" },
  { name: "Boat", icon: "/boat.png" },
  { name: "Cabin", icon: "/cabin.png" },
  { name: "Hotel", icon: "/hotel.png" },
];

const Amenities = [
  { name: "Wifi", icon: "/wifi.png" },
  { name: "TV", icon: "/tv.png" },
  { name: "Kitchen", icon: "/kitchen-set.png" },
  { name: "Washer", icon: "/washer.png" },
  { name: "Parking", icon: "/car.png" },
  { name: "Air conditioning", icon: "/snowflake.png" },
  { name: "WorkSpace", icon: "/desk.png" },
  { name: "Pool", icon: "/pool.png" },
  { name: "Hot tub", icon: "/hot-bath.png" },
  { name: "BBQ grill", icon: "/grill.png" },
  { name: "Exercise equipment", icon: "/gym.png" },
  { name: "Beach access", icon: "/beach.png" },
  { name: "Smoke alarm", icon: "/alarm.png" },
  { name: "First aid kit", icon: "/first-aid-kit.png" },
  { name: "Fire extinguisher", icon: "/fire.png" },
  { name: "Carbon monoxide alarm", icon: "/carbon.png" },
];

export default function Home() {
  const [hostedPlaces, setHostedPlaces] = useState<PlaceType[]>([]);
  const [favorites, setFavorites] = useState<FavoritesType[]>([]);
  const [session, setSession] = useState<Session | null>();
  const [refresh, setRefresh] = useState(false);
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(0);
  const [bedRoomNumber, setBedRoomNumber] = useState(0);
  const [bedNumber, setBedNumber] = useState(1);
  const [bathroomNumber, setBathroomNumber] = useState(1);
  const [PlaceAmenities, setPlaceAmenities] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

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
      setLoaded(true);
    };
    handleUpload();
  }, [refresh]);

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

  const handleAddPlaceAmenities = (item: string) => {
    setPlaceAmenities((prevState) => [...prevState, item]);
  };
  const handleRemovePlaceAmenities = (item: string) => {
    const index = PlaceAmenities.indexOf(item);
    if (index !== -1) {
      setPlaceAmenities((prevState) => prevState.filter((_, i) => i !== index));
    }
  };
  dotWave.register();

  return (
    <div className="w-full flex flex-col items-center justify-center ">
      {loaded ? (
        <div className="w-full flex flex-col items-center justify-center ">
          <SearchBar />
          <div className="border border-lightGray mt-10 border-b w-full" />
          <div className="flex gap-10 p-4 ">
            {places.map((place) => (
              <span className="flex flex-col items-center justify-center text-darkGray">
                <Image width={20} height={20} alt="icon" src={place.icon} />
                <p>{place.name}</p>
              </span>
            ))}
            <Dialog>
              <DialogTrigger asChild>
                <span className="cursor-pointer">
                  <IoFilter size={30} /> <p>Filter</p>
                </span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] h-[600px] overflow-y-auto bg-secondary">
                <DialogHeader>
                  <DialogTitle>Filter</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <p className="text-md font-black">Price range</p>
                  <span>
                    <input
                      className="border py-2 px-4 focus:outline-none rounded-large"
                      placeholder="$50"
                      onChange={(e) => setStartPrice(parseInt(e.target.value))}
                    />{" "}
                    -{" "}
                    <input
                      className="border py-2 px-4 focus:outline-none rounded-large"
                      placeholder="$400"
                      onChange={(e) => setEndPrice(parseInt(e.target.value))}
                    />
                  </span>
                  <p className="text-md font-black">Rooms and beds</p>
                  <div className="flex items-center justify-between border-b border-lightGray p-4 ">
                    <p className="">Bedroom</p>
                    <span className="flex items-center gap-2">
                      <CiCircleMinus
                        className="hover:cursor-pointer"
                        onClick={() =>
                          bedRoomNumber != 0 &&
                          setBedRoomNumber(bedRoomNumber - 1)
                        }
                        size={40}
                      />
                      <p>{bedRoomNumber}</p>
                      <CiCirclePlus
                        className="hover:cursor-pointer"
                        onClick={() => setBedRoomNumber(bedRoomNumber + 1)}
                        size={40}
                      />
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-lightGray p-4 ">
                    <p className="">Beds</p>
                    <span className="flex items-center gap-2">
                      <CiCircleMinus
                        className="hover:cursor-pointer"
                        onClick={() =>
                          bedNumber != 1 && setBedNumber(bedNumber - 1)
                        }
                        size={40}
                      />
                      <p>{bedNumber}</p>
                      <CiCirclePlus
                        className="hover:cursor-pointer"
                        onClick={() => setBedNumber(bedNumber + 1)}
                        size={40}
                      />
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 ">
                    <p className="">Bathrooms</p>
                    <span className="flex items-center gap-2">
                      <CiCircleMinus
                        className="hover:cursor-pointer"
                        onClick={() =>
                          bathroomNumber != 1 &&
                          setBathroomNumber(bathroomNumber - 1)
                        }
                        size={40}
                      />
                      <p>{bathroomNumber}</p>
                      <CiCirclePlus
                        className="hover:cursor-pointer"
                        onClick={() => setBathroomNumber(bathroomNumber + 1)}
                        size={40}
                      />
                    </span>
                  </div>
                  <p className="text-md font-black">Amenities</p>
                  <div className="grid grid-cols-2 gap-10 ">
                    {Amenities.map((item, index) => (
                      <span className="flex gap-2">
                        <Checkbox
                          id={item.name}
                          onClick={() =>
                            PlaceAmenities.find((i) => i == item.name)
                              ? handleRemovePlaceAmenities(item.name)
                              : handleAddPlaceAmenities(item.name)
                          }
                        />
                        <label
                          htmlFor={item.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {item.name}
                        </label>
                      </span>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button
                      className="bg-pink rounded-large px-10 py-3 font-black text-secondary"
                      type="submit"
                    >
                      Filter
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-5 text-[15px] grid grid-cols-4 gap-5">
            {hostedPlaces?.map((item, index) => (
              <div className="w-[300px] h-[280px] ">
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
                <Link
                  href={`/place/${item.id}`}
                  className="w-[280px] "
                  key={index}
                >
                  <Image
                    alt="image"
                    src={item.images[0]}
                    width={50}
                    height={50}
                    className="w-[300px] h-[280px] rounded-[10px] "
                  />
                  <p className="font-bold pt-2">{item.place_name}</p>
                  <p>
                    {item.country}, {item.province}
                  </p>
                  <p className="font-bold">{item.price}$ night</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[80vh] flex items-center justify-center">
          <l-dot-wave size="100" speed="1.25" color="#EE3080"></l-dot-wave>
        </div>
      )}
    </div>
  );
}

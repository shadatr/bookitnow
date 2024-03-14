"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { BsSearch } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "./countries";
import CountrySelector from "./selector";
import { SelectMenuOption } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const SearchBar = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [placeType, setPlaceType] = useState("");
  const [adultNumber, setAdultNumber] = useState(0);
  const [childrenNumber, setChildrenNumber] = useState(0);
  const [infantsNumber, SetInfantsNumber] = useState(0);
  const [scroll, setScroll] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(0);
  const [bedRoomNumber, setBedRoomNumber] = useState(0);
  const [bedNumber, setBedNumber] = useState(0);
  const [bathroomNumber, setBathroomNumber] = useState(0);
  const [PlaceAmenities, setPlaceAmenities] = useState<string[]>([]);
  const country = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (placeT?:string) => {
    const params = new URLSearchParams(searchParams);
    console.log(country.current?.innerText);
    if (startDate) {
      params.set("startDate", String(startDate));
    } else {
      params.delete("startDate");
    }
    if (endDate) {
      params.set("endDate", String(endDate));
    } else {
      params.delete("endDate");
    }
    if (country.current&&country.current?.innerText!="Select a country/region") {
      params.set("country", String(country.current?.innerText));
    } else {
      params.delete("country");
    }
    if (adultNumber) {
      params.set("guest_number", String(adultNumber));
    } else {
      params.delete("guest_number");
    }
    if (placeT) {
      params.set("placeType", String(placeT));
    } else {
      params.delete("placeType");
    }
    if (startPrice) {
      params.set("startPrice", String(startPrice));
    } else {
      params.delete("startPrice");
    }
    if (endPrice) {
      params.set("endPrice", String(endPrice));
    } else {
      params.delete("endPrice");
    }
    if (bedRoomNumber) {
      params.set("bed_room_number", String(bedRoomNumber));
    } else {
      params.delete("bed_room_number");
    }
    if (bedNumber) {
      params.set("bed_number", String(bedNumber));
    } else {
      params.delete("bed_number");
    }
    if (bathroomNumber) {
      params.set("bath_room_number", String(bathroomNumber));
    } else {
      params.delete("bath_room_number");
    }
    if (PlaceAmenities.length) {
      params.set("amenities", String(PlaceAmenities));
    } else {
      params.delete("amenities");
    }

    replace(`${pathname}?${params.toString()}`);
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

  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <div
        className={` flex items-center border border-lightGray shadow-lg w-[1050px] py-2 px-10 rounded-full z-20 mt-3 text-xsm ${
          scroll ? "fixed top-0" : ""
        }`}
      >
        <div className="w-[280px] flex flex-col justify-center">
          <p className="px-6 font-bold text-xsm">Where</p>
          <Select >
            <SelectTrigger className=" text-xsm border-none">
              <SelectValue placeholder="Select a country/region" ref={country} />
            </SelectTrigger>
            <SelectContent className="bg-secondary" >
              <SelectGroup>
                <SelectLabel> countries</SelectLabel>
                {COUNTRIES.map((item) => (
                  <SelectItem
                    key={item.title}
                    className="p-1"
                    value={item.title}
                    >
                    {item.title}
                  </SelectItem>
                ))}{" "}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[280px] flex flex-col justify-center">
          <p className="px-6 font-bold text-xsm">Check In</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className={cn(
                  "w-[180px] text-[13px] justify-start text-left font-normal hover:bg-lightGray transtion-bg rounded-xl ",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Add dates</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-secondary">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-[280px] flex flex-col">
          <p className="px-6 font-bold text-xsm">Check Out</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className={cn(
                  "w-[180px] text-[13px] justify-start text-left font-normal hover:bg-lightGray transtion-bg rounded-xl",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Add dates</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-secondary ">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-[280px] flex flex-col justify-start">
          <p className="px-6 font-bold text-xsm">who</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className={cn(
                  "w-[180px] justify-start text-left font-normal hover:bg-lightGray transtion-bg px-6 rounded-xl text-[13px]"
                )}
              >
                {adultNumber + childrenNumber + infantsNumber
                  ? adultNumber + childrenNumber + infantsNumber
                  : "Add Guests"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("rounded-3xl bg-secondary")}>
              <div className="flex items-center justify-between border-b border-lightGray p-2">
                <span>
                  <p className="font-bold">Adult</p>
                  <p className="text-xsm">Ages 13 or above</p>
                </span>
                <span className="flex items-center gap-2">
                  <CiCircleMinus
                    className="hover:cursor-pointer"
                    onClick={() =>
                      adultNumber != 0 && setAdultNumber(adultNumber - 1)
                    }
                    size={30}
                  />
                  <p>{adultNumber}</p>
                  <CiCirclePlus
                    className="hover:cursor-pointer"
                    onClick={() => setAdultNumber(adultNumber + 1)}
                    size={30}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-lightGray p-2">
                <span>
                  <p className="font-bold">Adult</p>
                  <p className="text-xsm">Ages 2-12</p>
                </span>
                <span className="flex items-center gap-2">
                  <CiCircleMinus
                    className="hover:cursor-pointer"
                    onClick={() =>
                      childrenNumber != 0 &&
                      setChildrenNumber(childrenNumber - 1)
                    }
                    size={30}
                  />
                  <p>{childrenNumber}</p>
                  <CiCirclePlus
                    className="hover:cursor-pointer"
                    onClick={() => setChildrenNumber(childrenNumber + 1)}
                    size={30}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span>
                  <p className="font-bold">Adult</p>
                  <p className="text-xsm">Under 2</p>
                </span>
                <span className="flex items-center gap-2">
                  <CiCircleMinus
                    className="hover:cursor-pointer"
                    onClick={() =>
                      infantsNumber != 0 && SetInfantsNumber(infantsNumber - 1)
                    }
                    size={30}
                  />
                  <p>{infantsNumber}</p>
                  <CiCirclePlus
                    className="hover:cursor-pointer"
                    onClick={() => SetInfantsNumber(infantsNumber + 1)}
                    size={30}
                  />
                </span>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <BsSearch
          size={60}
          className="pr-5 cursor-pointer"
          color="#EE3080"
          onClick={()=>handleSearch(placeType)}
        />
      </div>
      <div className=" border-lightGray mt-8 border-b w-full" />
      <div className="flex gap-10 p-4 ">
        {places.map((place) => (
          <span
            className={`flex flex-col items-center justify-center text-darkGray ${
              place.name == placeType
                ? "text-primary font-medium"
                : "text-darkGray"
            }`}
            onClick={() => {
              setPlaceType(place.name);
                handleSearch(place.name);
            }}
                    
            >
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
                      bedRoomNumber != 0 && setBedRoomNumber(bedRoomNumber - 1)
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
                  onClick={()=>handleSearch(placeType)}
                >
                  Filter
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SearchBar;

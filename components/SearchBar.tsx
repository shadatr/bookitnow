"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { COUNTRIES } from "./countries";
import CountrySelector from "./selector";
import { SelectMenuOption } from "@/types";

const SearchBar = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState("AU");
  const [adultNumber, setAdultNumber] = useState(0);
  const [childrenNumber, setChildrenNumber] = useState(0);
  const [infantsNumber, SetInfantsNumber] = useState(0);


  return (
    <div className=" flex items-center border border-lightGray shadow-lg w-[750px] py-1 px-4 rounded-full z-40 mt-10">
      <div className="w-[280px] flex flex-col justify-center">
        <p className="px-6 font-bold text-xsm">Where</p>
        <CountrySelector
          id={"countries"}
          open={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          onChange={(val) => setCountry(val)}
          selectedValue={
            COUNTRIES.find(
              (option) => option.value === country
            ) as SelectMenuOption
          }
        />
      </div>
      <div className="w-[280px] flex flex-col justify-center">
        <p className="px-6 font-bold text-xsm">Check In</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn(
                "w-[180px] justify-start text-left font-normal hover:bg-lightGray transtion-bg rounded-xl",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Add dates</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-[280px] flex flex-col justify-">
        <p className="px-6 font-bold text-xsm">Check Out</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn(
                "w-[180px] justify-start text-left font-normal hover:bg-lightGray transtion-bg rounded-xl",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>Add dates</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
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
                "w-[180px] justify-start text-left font-normal hover:bg-lightGray transtion-bg px-6 rounded-xl ",
              )}
            >
            {adultNumber+childrenNumber+infantsNumber?adultNumber+childrenNumber+infantsNumber:"Add Guests"}
            </Button>
            </PopoverTrigger>
          <PopoverContent className={cn("rounded-3xl")}>
            <div className="flex items-center justify-between border-b border-lightGray p-2">
            <span>
              <p className="font-bold">Adult</p>
              <p className="text-xsm">Ages 13 or above</p>
            </span>
            <span className="flex items-center gap-2">
              <CiCircleMinus className="hover:cursor-pointer" onClick={()=>adultNumber!=0&&setAdultNumber(adultNumber-1)} size={30}/>
              <p>
                {adultNumber}
              </p>
            <CiCirclePlus className="hover:cursor-pointer" onClick={()=>setAdultNumber(adultNumber+1)} size={30}/>
            </span>
            </div>
            <div className="flex items-center justify-between border-b border-lightGray p-2">
            <span>
              <p className="font-bold">Adult</p>
              <p className="text-xsm">Ages 2-12</p>
            </span>
            <span className="flex items-center gap-2">
              <CiCircleMinus className="hover:cursor-pointer" onClick={()=>childrenNumber!=0&&setChildrenNumber(childrenNumber-1)} size={30}/>
              <p>
                {childrenNumber}
              </p>
            <CiCirclePlus className="hover:cursor-pointer" onClick={()=>setChildrenNumber(childrenNumber+1)} size={30}/>
            </span>
            </div>
            <div className="flex items-center justify-between p-2">
            <span>
              <p className="font-bold">Adult</p>
              <p className="text-xsm">Under 2</p>
            </span>
            <span className="flex items-center gap-2">
              <CiCircleMinus className="hover:cursor-pointer" onClick={()=>infantsNumber!=0&&SetInfantsNumber(infantsNumber-1)} size={30}/>
              <p>
                {infantsNumber}
              </p>
            <CiCirclePlus className="hover:cursor-pointer" onClick={()=>SetInfantsNumber(infantsNumber+1)}  size={30}/>
            </span>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SearchBar;

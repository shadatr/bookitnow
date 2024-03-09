"use client";
import { PlaceType, reserved } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import Image from "next/image";
import { FiPlus } from "react-icons/fi";
import Calendar from "@demark-pro/react-booking-calendar";

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

const Page = ({ params }: { params: { id: string } }) => {
  const [activeTab, setActiveTab] = useState<string>("Tab 1");
  const [hostedPlaces, setHostedPlaces] = useState<PlaceType>();
  const [reserved, setReserved] = useState<reserved[]>([]);
  const [imagesOpened, setImagesOpened] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const handleChange = (e: any) => setSelectedDates(e);

  useEffect(() => {
    const handleUpload = async () => {
      const data = await axios.get(`/api/hosted_place/${params.id}`);
      setHostedPlaces(data.data.message.data[0]);
      const data2 = await axios.get(`/api/reserve/${params.id}`);
      setReserved(data2.data.message.data);

      let datares: reserved[] = [];
      data2.data.message.data.map(
        (dateString: { date: string | number | Date }) => {
          const startDate = new Date(dateString.date);
          const endDate = new Date(startDate);
          startDate.setDate(startDate.getDate() - 1);
          datares.push({ startDate, endDate });
        }
      );
      if (datares.length > 0) setReserved(datares);
    };
    handleUpload();
  }, [refresh]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAvailable = () => {
    if (selectedDates.length < 2) {
      console.error("Selected dates are not available.");
      return;
    }

    const endDate: Date = selectedDates[1];
    const startDate: Date = selectedDates[0];

    const days = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateTimeString = currentDate.toISOString();
      const parts = dateTimeString.split("T");
      const dateString = parts[0];
      days.push(dateString);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    axios.post(`/api/removeReservation/${hostedPlaces?.id}`, days);
    setSelectedDates([]);
    setRefresh(!refresh);
  };

  const handleBlock = () => {
    if (selectedDates.length < 2) {
      console.error("Selected dates are not available.");
      return;
    }

    const endDate: Date = selectedDates[1];
    const startDate: Date = selectedDates[0];

    const days = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateTimeString = currentDate.toISOString();
      const parts = dateTimeString.split("T");
      const dateString = parts[0];
      days.push(dateString);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const data = {
      days: days,
    };

    axios.post(`/api/reserve/${hostedPlaces?.id}`, data);
    setSelectedDates([]);
    setRefresh(!refresh);
  };

  return (
    <div className="flex justify-between items-center w-[100%] pt-24">
      <div className="flex w-full justify-center items-center flex-col">
        <div className="lg:text-sm sm:text-xsm flex flex-row space-x-2 p-5">
          <button
            onClick={() => handleTabClick("Tab 1")}
            className={`py-2 px-4 rounded-[10px] w-[200px] border transtion-bg ${
              activeTab === "Tab 1"
                ? "bg-pink text-secondary "
                : "bg-gray-300 border-lightGray"
            }`}
          >
            Place
          </button>
          <button
            onClick={() => handleTabClick("Tab 2")}
            className={`py-2 px-4 rounded-[10px]  w-[200px] border transtion-bg ${
              activeTab === "Tab 2"
                ? "bg-pink text-secondary border-pink"
                : "bg-gray-300 border-lightGray"
            }`}
          >
            Calender
          </button>
          <button
            onClick={() => handleTabClick("Tab 3")}
            className={`py-2 px-4 rounded-[10px] w-[200px] border transtion-bg ${
              activeTab === "Tab 3"
                ? "bg-pink text-secondary border-pink"
                : "bg-gray-300 border-lightGray"
            }`}
          >
            Reservations
          </button>
          <button
            onClick={() => handleTabClick("Tab 4")}
            className={`py-2 px-4 rounded-[10px]  w-[200px] border transtion-bg ${
              activeTab === "Tab 4"
                ? "bg-pink text-secondary border-pink"
                : "bg-gray-300 border-lightGray"
            }`}
          >
            Inbox
          </button>
        </div>
        {activeTab == "Tab 1" && (
          <div className="flex flex-col gap-5 py-10">
            {hostedPlaces?.images && (
              <div className="flex gap-1">
                <Image
                  onClick={() => setImagesOpened(true)}
                  width={700}
                  height={500}
                  src={hostedPlaces?.images[0]}
                  alt="Selected"
                  className={`w-[550px] h-[360px] cursor-pointer`}
                />
                <div className="grid grid-cols-2 gap-1">
                  {hostedPlaces.images.slice(0, 4).map((pic, index) => (
                    <span>
                      {index == 3 && hostedPlaces?.images.length > 5 ? (
                        <p className="absolute items-center justify-center w-[280px] h-[175px] p-2 bg-image">
                          <p
                            className="hover:cursor-pointer flex items-center justify-center w-full h-full text-secondary"
                            onClick={() => setImagesOpened(true)}
                          >
                            <FiPlus
                              className="hover:cursor-pointer  text-secondary"
                              size={40}
                            />
                          </p>
                        </p>
                      ) : (
                        ""
                      )}
                      <Image
                        onClick={() => setImagesOpened(true)}
                        width={300}
                        height={180}
                        src={pic}
                        alt="Selected"
                        className={`w-[280px] h-[175px] cursor-pointer `}
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}
            {imagesOpened && (
              <div className="absolute right-0 top-0 bg-secondary w-screen z-60">
                <HiOutlineXMark
                  className="cursor-pointer  m-5 "
                  size="30"
                  onClick={() => setImagesOpened(false)}
                />
                <div className="w-full flex flex-col gap-4 items-center justify-center">
                  {hostedPlaces?.images.map((pic, index) => (
                    <span>
                      <Image
                        onClick={() => setImagesOpened(true)}
                        width={300}
                        height={180}
                        src={pic}
                        alt="Selected"
                        className={`w-[1000px] h-[650px] `}
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col">
              <span className=" text-xmd font-bold">
                {hostedPlaces?.place_name}, {hostedPlaces?.country}
              </span>
              <span className="text-darkGray">
                {hostedPlaces?.guest_number} guests •{" "}
                {hostedPlaces?.bed_room_number} bedroom •{" "}
                {hostedPlaces?.bed_number} bed •{" "}
                {hostedPlaces?.bath_room_number} baths
              </span>
            </div>
            <span className="w-[700px]">{hostedPlaces?.place_description}</span>
            <span className="grid gap-5">
              <p className="text-md font-bold">What this place offers</p>
              <div className="grid grid-cols-2 gap-10 w-[600px]">
                {hostedPlaces?.amenities.map((item) => {
                  const amt = Amenities.find((i) => i.name == item);
                  return (
                    <span className="flex items-center gap-2">
                      <Image
                        src={amt?.icon || ""}
                        alt={amt?.name || ""}
                        width={30}
                        height={30}
                      />
                      <p className="text-sm font-bold">{amt?.name}</p>
                    </span>
                  );
                })}
              </div>
            </span>
          </div>
        )}
        {activeTab == "Tab 2" && (
          <div className="w-[1000px] flex flex-col items-center justify-center py-10">
            <div className="flex gap-5 pb-10">
              <button
                onClick={handleAvailable}
                className="p-3 bg-pink rounded-full text-secondary font-bold"
              >
                Open the nights
              </button>
              <button
                onClick={handleBlock}
                className="p-3 bg-darkGray rounded-full text-secondary font-bold"
              >
                Block the nights
              </button>
            </div>
            <Calendar
              classNamePrefix="calendar"
              selected={selectedDates}
              onChange={handleChange}
              onOverbook={(e, err) => alert(err)}
              components={{
                DayCellFooter: ({ innerProps, date }) => (
                  <div
                    {...innerProps}
                    className={`calendar__dayCell-footer ${
                      reserved.some(
                        (reservation) =>
                          date >= reservation.startDate &&
                          date <= reservation.endDate
                      ) && "booked"
                    }`}
                  >
                    {reserved.some(
                      (reservation) =>
                        date >= reservation.startDate &&
                        date <= reservation.endDate
                    )
                      ? "Booked"
                      : ""}
                  </div>
                ),
              }}
              reserved={reserved}
              variant="events"
              dateFnsOptions={{ weekStartsOn: 1 }}
              range={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

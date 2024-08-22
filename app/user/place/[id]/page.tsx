"use client";
import { FavoritesType, PlaceType, ReservedType } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Image, { ImageLoader } from "next/image";
import { HiOutlineXMark } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import { Calendar } from "@demark-pro/react-booking-calendar";
import { useRouter } from "next/navigation";
import asyncStripe from "@/lib/stripe";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { FaHeart } from "react-icons/fa";
import { toast } from "@/components/ui/use-toast";
import { dotWave } from "ldrs";
import { Modal, ModalTrigger } from "@/components/ui/animated-modal";

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
  const [hostedPlace, setHostedPlace] = useState<PlaceType>();
  const [imagesOpened, setImagesOpened] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [reserved, setReserved] = useState<ReservedType[]>([]);
  const [favorites, setFavorites] = useState<FavoritesType[]>([]);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [session, setSession] = useState<Session | null>();
  const [refresh, setRefresh] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  const handleChange = (e: any) => {
    setSelectedDates(e);

    const endDate = new Date(e[1]);
    const startDate = new Date(e[0]);
    if (e[1]) {
      const startTimeStamp = startDate.getTime();
      const endTimeStamp = endDate.getTime();

      const timeDifference = Math.abs(endTimeStamp - startTimeStamp);

      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      setNumberOfDays(daysDifference);
    }
  };

  useEffect(() => {
    const handleUpload = async () => {
      const data = await axios.get(`/api/hosted_place/${params.id}`);
      setHostedPlace(data.data.message.data[0]);
      const data2 = await axios.get(`/api/reserve/${params.id}`);
      setReserved(data2.data.message.data);
      const data3 = await supabase.auth.getSession();
      setSession(data3.data.session);

      const data4 = await axios.get(
        `/api/favorites/${data3.data.session?.user.id}`
      );
      setFavorites(data4.data.message.data);

      let datares: ReservedType[] = [];
      data2.data.message.data.map(
        (dateString: { date: string | number | Date }) => {
          const startDate = new Date(dateString.date);
          const endDate = new Date(startDate);
          startDate.setDate(startDate.getDate() - 1);
          datares.push({ startDate, endDate });
        }
      );
      if (datares.length > 0) setReserved(datares);
      setLoaded(true);
    };
    handleUpload();
  }, [refresh]);
  console.log(session?.access_token);

  const isReserved = (date: Date) => {
    for (let i = 0; i < reserved.length; i++) {
      if (date >= reserved[i].startDate && date <= reserved[i].endDate) {
        return true;
      }
    }
    return false;
  };

  const handleReserve = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      router.push("/login");
    }

    if (selectedDates.length == 2) {
      const amount = hostedPlace?.price
        ? hostedPlace?.price * numberOfDays * 0.1 +
          hostedPlace?.price * numberOfDays
        : 0;
      const name = hostedPlace?.place_name;
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
        place_id: hostedPlace?.id,
        user_id: session?.user.id,
        user_email: session?.user.email,
        days: days,
      };

      try {
        const stripe = await asyncStripe;

        const res = await axios.post("/api/payment", {
          amount,
          name,
          data,
        });
        const sessionId = await res.data.sessionId;
        await stripe?.redirectToCheckout({ sessionId });

        router.push("/payment/succsess");
      } catch (err) {
        console.log(err);
        router.push("/payment/error");
      }
    } else {
      toast({
        className: "rounded-[5px] p-4 text-red-600 bg-secondary",
        description: "You should select the reservesions dates",
      });
    }
  };

  const handleAddToFavorites = () => {
    const data = {
      user_id: session?.user.id,
      place_id: hostedPlace?.id,
    };
    axios.post("/api/favorites/1", data).then((res) =>
      toast({
        className: "rounded-[5px] p-4 text-green-600 bg-secondary",
        description: res.data.message,
      })
    );
    setRefresh(!refresh);
  };

  dotWave.register();

  const imageUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    hostedPlace?.host_name || ""
  )}`;

  const loaderProp: ImageLoader = ({ src }: { src: string }) => {
    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      src
    )}`;
  };

  return (
    <div className="w-[100%] flex justify-center items-center">
      {loaded ? (
        <div className="flex flex-col gap-5 py-10 lg:w-[1100px] sm:w-[350px]">
          <div className="flex justify-between items-center gap-4">
            <span className=" lg:text-xmd sm:text-sm font-bold">
              {hostedPlace?.place_name}
            </span>
            {session?.user && (
              <button
                onClick={handleAddToFavorites}
                className="flex items-center lg:text-sm sm:text-xsm"
              >
                <FaHeart
                  className={
                    favorites.find((i) => i.place_id == hostedPlace?.id)
                      ? "text-pink"
                      : ""
                  }
                />
                Add to favorites
              </button>
            )}
          </div>
          {hostedPlace?.images && (
            <div className="flex lg:flex-row sm:flex-col gap-1">
              <span className=" inline-block overflow-hidden lg:w-[650px] lg:h-[450px] sm:w-[350px] sm:h-[250px]">
                <Image
                  onClick={() => setImagesOpened(true)}
                  width={100}
                  height={100}
                  src={hostedPlace?.images[0]}
                  alt="Selected"
                  className={`w-full h-full cursor-pointer object-cover`}
                />
              </span>
              <div className="grid grid-cols-2 gap-1">
                {hostedPlace.images.slice(1, 5).map((pic, index) => (
                  <span key={index}>
                    {index == 3 && hostedPlace?.images.length > 5 ? (
                      <span className="absolute items-center justify-center  p-2 bg-image">
                        <p
                          className="hover:cursor-pointer flex items-center justify-center w-full h-full text-secondary"
                          onClick={() => setImagesOpened(true)}
                        >
                          <FiPlus
                            className="hover:cursor-pointer  text-secondary"
                            size={40}
                          />
                        </p>
                      </span>
                    ) : (
                      ""
                    )}
                    <span className=" inline-block overflow-hidden lg:w-[225px] lg:h-[220px] sm:w-[170px] sm:h-[140px] ">
                      <Image
                        onClick={() => setImagesOpened(true)}
                        width={300}
                        height={180}
                        src={pic}
                        alt="Selected"
                        className={`cursor-pointer w-full h-full object-cover`}
                      />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {imagesOpened && (
            <div className="absolute right-0 top-0 bg-secondary w-screen h-[100h] z-20">
              <HiOutlineXMark
                className="cursor-pointer  m-5"
                size="30"
                onClick={() => setImagesOpened(false)}
              />
              <div className="w-full flex flex-col gap-4 items-center justify-center">
                {hostedPlace?.images.map((pic, index) => (
                  <span key={index}>
                    <Image
                      onClick={() => setImagesOpened(true)}
                      width={300}
                      height={180}
                      src={pic}
                      alt="Selected"
                      className={`lg:w-[600px] sm:w-[300px] h-auto `}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col ">
            <span className=" text-md font-bold">
              {hostedPlace?.country} , {hostedPlace?.province}
            </span>
            <span className="text-darkGray lg:text-sm sm:text-xsm">
              {hostedPlace?.guest_number} guests •{" "}
              {hostedPlace?.bed_room_number} bedroom • {hostedPlace?.bed_number}{" "}
              bed • {hostedPlace?.bath_room_number} baths
            </span>
          </div>
          <div className=" border-b w-full border-lightGray" />
          <div className="flex gap-3 items-center  ">
            <div className="relative lg:w-[40px] lg:h-[40px] sm:w-[20px] sm:h-[20px] overflow-hidden rounded-l-2xl z-0">
              <Image
                src={imageUrl}
                alt={"image"}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-full bg-lightBlue z-0"
                loader={loaderProp}
              />
            </div>
            <p className="lg:py-2 sm:py-1 lg:text-sm sm:text-xsm font-medium">
              Hosted by {hostedPlace?.host_name}
            </p>
          </div>
          <div className="flex lg:flex-row sm:flex-col ">
            <div>
              <div className=" border-b w-full border-lightGray" />
              <span className="lg:w-[700px] sm:w-[300px] sm:text-xxsm lg:text-sm flex">
                {hostedPlace?.place_description}
              </span>
              <div className=" border-b w-full border-lightGray py-5" />

              <div className="flex lg:justify-between sm:flex-col lg:flex-row w-full">
                <div>
                  <span className="grid gap-5">
                    <p className="sm:text-sm lg:text-md font-bold">
                      What this place offers
                    </p>
                    <div className="grid grid-cols-2 lg:gap-10 sm:gap-5 lg:w-[600px] sm:w-[300px]">
                      {hostedPlace?.amenities.map((item, index) => {
                        const amt = Amenities.find((i) => i.name == item);
                        return (
                          <span className="flex items-center gap-2" key={index}>
                            <Image
                              src={amt?.icon || ""}
                              alt={amt?.name || ""}
                              width={30}
                              height={30}
                              className="lg:w-30 lg:h-30 sm:w-5 sm:h-5"
                            />
                            <p className="lg:text-sm sm:text-xsm font-bold">
                              {amt?.name}
                            </p>
                          </span>
                        );
                      })}
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div className=" flex flex-col lg:gap-10 sm:gap-3 w-full justify-center items-center">
              <div className="border border-lightGray rounded-2xl shadow-lg lg:p-8 sm:p-4 sm:mt-10 lg:mx-6 sm:mx-3 flex flex-col gap-3 lg:h-[400px] sm:h-[300px] lg:w-[400px] sm:w-[300px] lg:text-sm sm:text-xsm ">
                <p className="font-bold lg:text-md sm:text-sm">
                  {hostedPlace?.price} $ night
                </p>
                <div className="flex justify-center items-center">
                  <span className="border rounded-l-[10px] py-2 px-8 lg:text-xsm sm:text-xxsm">
                    <p className="font-bold">CHECK-IN</p>
                    <p>
                      {selectedDates[0]
                        ? new Date(
                            selectedDates[0].getTime() + 24 * 60 * 60 * 1000
                          )
                            .toISOString()
                            .split("T")[0]
                        : "--"}
                    </p>
                  </span>
                  <span className="border py-2 rounded-r-[10px] px-8 lg:text-xsm sm:text-xxsm">
                    <p className="font-bold">CHECK-OUT</p>
                    <p>
                      {selectedDates[1]
                        ? selectedDates[1]?.toISOString().split("T")[0]
                        : "--"}
                    </p>
                  </span>
                </div>
                <div
                  className="flex justify-center items-center"
                  onClick={handleReserve}
                >
                  <Modal>
                    <ModalTrigger className="bg-pink text-secondary lg:p-3 sm:p-2 lg:text-sm sm:text-xsm font-bold rounded-[10px] items-center flex justify-center group/modal-btn w-[250px]">
                      <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                        Reserve
                      </span>
                      <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                        ✈️
                      </div>
                    </ModalTrigger>
                  </Modal>
                </div>
                <div className="flex justify-between font-medium">
                  <span>
                    {hostedPlace?.price}$ x {numberOfDays} nights
                  </span>
                  <span>
                    {hostedPlace?.price
                      ? hostedPlace?.price * numberOfDays
                      : ""}
                    $
                  </span>
                </div>
                <div className="flex justify-between font-medium ">
                  <span>Service fees</span>
                  <span>
                    {hostedPlace?.price
                      ? hostedPlace?.price * numberOfDays * 0.1
                      : ""}
                    $
                  </span>
                </div>
                <div className="border border-b " />
                <div className="flex justify-between font-medium lg:text-md sm:text-xsm">
                  <span>Total</span>
                  <span>
                    {hostedPlace?.price && selectedDates.length > 1
                      ? hostedPlace?.price * numberOfDays * 0.1 +
                        hostedPlace?.price * numberOfDays
                      : 0}
                    $
                  </span>
                </div>
              </div>
              <div className="lg:w-[400px] sm:w-[300px] z-10">
                <Calendar
                  classNamePrefix="calendar z-10"
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
                  disabled={(date, state) =>
                    !state.isSameMonth || isReserved(date)
                  }
                  reserved={reserved}
                  variant="events"
                  dateFnsOptions={{ weekStartsOn: 1 }}
                  range={true}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[80vh] flex items-center justify-center">
          <l-dot-wave size="100" speed="1.25" color="#EE3080"></l-dot-wave>
        </div>
      )}
    </div>
  );
};

export default Page;

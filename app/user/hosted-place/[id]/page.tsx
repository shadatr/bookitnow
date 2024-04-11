"use client";
import {
  PlaceType,
  UserMessagesType,
  ReservationsType,
  ReservedType,
} from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import Image from "next/image";
import { FiPlus } from "react-icons/fi";
import Calendar from "@demark-pro/react-booking-calendar";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

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
  const [reservedDays, setReservedDays] = useState<ReservedType[]>([]);
  const [reservations, setReservations] = useState<ReservationsType[]>([]);
  const [imagesOpened, setImagesOpened] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>();
  const [msgText, setMsgText] = useState("");
  const [session, setSession] = useState<Session | null>();
  const [messages, setMessages] = useState<UserMessagesType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const changes = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tb_messages",
          filter: `place_id=eq.${hostedPlaces?.id}`,
        },
        (payload: any) => {
          setMessages((prevMessages: any) => {
            if (!prevMessages) return prevMessages;
            const updatedMessages = [...prevMessages];
            updatedMessages.push(payload.new);
            return updatedMessages;
          });
        }
      )
      .subscribe();

    return () => {
      changes.unsubscribe();
    };
  }, [refresh]);

  const handleChange = (e: any) => setSelectedDates(e);

  useEffect(() => {
    const handleUpload = async () => {
      const data1 = await axios.get(`/api/hosted_place/${params.id}`);
      setHostedPlaces(data1.data.message.data[0]);

      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);

      const data2 = await axios.get(`/api/reserve/${params.id}`);
      const res: ReservationsType[] = data2.data.message.data;
      setReservations(res);

      const res2 = await axios.get(
        `/api/messages/${data1.data.message.data[0]?.id}`
      );
      const data3: UserMessagesType[] = res2.data.message.data;
      setMessages(data3);

      const uniqueEmails = new Set(res.map((item) => item.user_email));
      const uniqueEmailsArray = [...uniqueEmails];
      setEmails(uniqueEmailsArray);

      let datares: ReservedType[] = [];
      data2.data.message.data.map(
        (dateString: { date: string | number | Date }) => {
          const startDate = new Date(dateString.date);
          const endDate = new Date(startDate);
          startDate.setDate(startDate.getDate() - 1);
          datares.push({ startDate, endDate });
        }
      );
      if (datares.length > 0) setReservedDays(datares);
      setLoading(true);
    };
    handleUpload();
  }, [refresh]);

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

    console.log(days)

    axios.post(`/api/reserve/${hostedPlaces?.id}`, data);
    setSelectedDates([]);
    setRefresh(!refresh);
  };

  const handelSend = () => {
    if (!msgText) {
      return;
    }
    const data = {
      place_id: hostedPlaces?.id,
      text: msgText,
      sender_id: session?.user.email,
      reciever_id: selectedEmail,
    };
    axios.post("/api/messages/1", data);
    setMsgText("");
    setRefresh(!refresh);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex justify-between items-center w-[100%] pt-10">
      {loading ? (
        <>
          <div className="flex w-full justify-center items-center flex-col">
            <div className="lg:text-sm sm:text-xxsm flex flex-row space-x-2 p-5 ">
              <button
                onClick={() => handleTabClick("Tab 1")}
                className={`py-2 px-4 rounded-[10px] lg:w-[200px] sm:w-[80px] border transtion-bg ${
                  activeTab === "Tab 1"
                    ? "bg-pink text-secondary "
                    : "bg-gray-300 border-lightGray"
                }`}
              >
                Place
              </button>
              <button
                onClick={() => handleTabClick("Tab 2")}
                className={`py-2 px-4 rounded-[10px] lg:w-[200px] sm:w-[80px] border transtion-bg ${
                  activeTab === "Tab 2"
                    ? "bg-pink text-secondary border-pink"
                    : "bg-gray-300 border-lightGray"
                }`}
              >
                Calender
              </button>
              <button
                onClick={() => handleTabClick("Tab 3")}
                className={`py-2 px-4 rounded-[10px] lg:w-[200px] sm:w-[80px] border transtion-bg ${
                  activeTab === "Tab 3"
                    ? "bg-pink text-secondary border-pink"
                    : "bg-gray-300 border-lightGray"
                }`}
              >
                Reservations
              </button>
              <button
                onClick={() => handleTabClick("Tab 4")}
                className={`py-2 px-4 rounded-[10px] lg:w-[200px] sm:w-[80px] border transtion-bg ${
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
                  <div className="flex lg:flex-row sm:flex-col gap-1">
                    <Image
                      onClick={() => setImagesOpened(true)}
                      width={700}
                      height={500}
                      src={hostedPlaces?.images[0]}
                      alt="Selected"
                      className={`lg:w-[550px] lg:h-[360px] sm:w-[350px] sm:h-[250px] cursor-pointer`}
                    />
                    <div className="grid grid-cols-2 gap-1">
                      {hostedPlaces.images.slice(0, 4).map((pic, index) => (
                        <span key={index}>
                          {index == 3 && hostedPlaces?.images.length > 5 ? (
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
                          <Image
                            onClick={() => setImagesOpened(true)}
                            width={300}
                            height={180}
                            src={pic}
                            alt="Selected"
                            className={`lg:w-[280px] lg:h-[175px] sm:w-[170px] sm:h-[140px]  cursor-pointer `}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {imagesOpened && (
                  <div className="absolute right-0 top-0 bg-secondary w-screen h-[100h] z-100">
                    <HiOutlineXMark
                      className="cursor-pointer  m-5 "
                      size="30"
                      onClick={() => setImagesOpened(false)}
                    />
                    <div className="w-full flex flex-col gap-4 items-center justify-center">
                      {hostedPlaces?.images.map((pic, index) => (
                        <span key={index}>
                          <Image
                            onClick={() => setImagesOpened(true)}
                            width={300}
                            height={180}
                            src={pic}
                            alt="Selected"
                            className={`lg:w-[800px] sm:w-[300px] h-auto `}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className=" text-md font-bold">
                    {hostedPlaces?.country} , {hostedPlaces?.province}
                  </span>
                  <span className="text-darkGray lg:text-sm sm:text-xsm">
                    {hostedPlaces?.guest_number} guests •{" "}
                    {hostedPlaces?.bed_room_number} bedroom •{" "}
                    {hostedPlaces?.bed_number} bed •{" "}
                    {hostedPlaces?.bath_room_number} baths
                  </span>
                </div>
                <div className=" border-b w-full border-lightGray" />
                <p className="lg:py-5 sm:py-2 lg:text-md sm:text-sm font-medium">
                  Hosted by {hostedPlaces?.user_email}
                </p>
                <div className=" border-b w-full border-lightGray" />
                <span className="lg:w-[700px] sm:w-[300px] sm:text-xxsm lg:text-sm flex">
                  {hostedPlaces?.place_description}
                </span>
                <div className=" border-b w-full border-lightGray" />
                <span className="grid gap-5">
                  <p className="sm:text-sm lg:text-md font-bold">
                    What this place offers
                  </p>
                  <div className="grid grid-cols-2 lg:gap-10 sm:gap-5 lg:w-[600px] sm:w-[300px]">
                    {hostedPlaces?.amenities.map((item, index) => {
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
            )}
            {activeTab == "Tab 2" && (
              <div className="lg:w-[1000px] sm:w-[350px] flex flex-col items-center justify-center py-10">
                <div className="flex gap-5 pb-10 lg:text-sm sm:text-xsm">
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
                          reservedDays.some(
                            (reservation) =>
                              date >= reservation.startDate &&
                              date <= reservation.endDate
                          ) && "booked"
                        }`}
                      >
                        {reservedDays.some(
                          (reservation) =>
                            date >= reservation.startDate &&
                            date <= reservation.endDate
                        )
                          ? "Booked"
                          : ""}
                      </div>
                    ),
                  }}
                  reserved={reservedDays}
                  variant="events"
                  dateFnsOptions={{ weekStartsOn: 1 }}
                  range={true}
                />
              </div>
            )}
            {activeTab == "Tab 3" && (
              <div>
                <table className="lg:w-[1200px] sm:w-[320px] border-collapse border border-gray-200 rounded-[10px] lg:text-sm sm:text-xsm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">NAME</th>
                      <th className="p-3 text-left">DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.length ? (
                      reservations.map((item, index) => (
                        <tr
                          className={
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }
                          key={index}
                        >
                          <td className="p-3">{item.user_email}</td>
                          <td className="p-3">{item.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="p-3 w-full items-center justify-center">
                        <td colSpan={7} className="p-3">
                          You don't have any reservations yet!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "Tab 4" && (
              <div className="flex lg:w-[1000px] sm:w-[350px] h-[600px] shadow-large rounded-large my-10">
                <div className="flex flex-col w-[40%] h-full bg-lightGray overflow-y-auto">
                  {emails.length? emails.map((item, index) => (
                    <span
                      key={index}
                      onClick={() => {
                        setSelectedEmail(item);
                      }}
                      className={` flex flex-col transition-bg p-4 rounded-large lg:text-sm sm:text-xxsm ${
                        selectedEmail === item &&
                        "bg-secondary font-bold border border-darkGray "
                      }`}
                    >
                      <span className="lg:text-xsm sm:text-xxsm">{item}</span>
                    </span>
                  )):<div className="font-black p-4">There is no user to connect yet!</div>}
                </div>
                <div className="flex flex-col w-[60%] h-full overflow-y-auto lg:text-sm sm:text-xsm">
                  {messages.length && selectedEmail ? (
                    <div className="flex flex-col h-[600px] overflow-y-auto lg:p-5 sm:p-2">
                      {messages
                        .filter(
                          (i) =>
                            i.reciever_id == selectedEmail ||
                            i.reciever_id == session?.user.email
                        )
                        .sort((a, b) => a.id - b.id)
                        .map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex p-2 w-full rounded-md ${
                              msg.sender_id === session?.user?.email
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div className="flex flex-row items-center">
                              <span
                                className={`py-2 px-4 rounded-large mx-2 ${
                                  msg.sender_id === session?.user?.email
                                    ? "bg-secondary border"
                                    : "bg-lightGray"
                                }`}
                              >
                                {msg.text}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    selectedEmail && (
                      <div className="flex h-[600px] justify-center items-center font-bold">
                        There is no messages yet!
                      </div>
                    )
                  )}
                  {selectedEmail && (
                    <div className="flex items-center rounded-large focus:bg-lightGray">
                      <span className="w-full rounded-[20px] lg:p-5 sm:p-3">
                        <textarea
                          className="w-full outline-none lg:h-[50px] sm:h-[30px] bg-lightGray p-2 rounded-large"
                          placeholder="write your message here..."
                          value={msgText}
                          onChange={(e) => setMsgText(e.target.value)}
                        />
                      </span>
                      <span
                        className="bg-pink rounded-[20px] text-secondary lg:py-4 lg:px-6 sm:py-2 sm:px-3 font-bold cursor-pointer"
                        onClick={handelSend}
                      >
                        Send
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="h-[60vh] flex items-center justify-center w-[100%]">
          <div className="container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

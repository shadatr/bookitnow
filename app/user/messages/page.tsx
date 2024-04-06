"use client";
import { supabase } from "@/lib/supabase";
import { PlaceType, UserMessagesDetailsType } from "@/types";
import { Session } from "@supabase/supabase-js";
import axios from "axios";
import {  useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page =  () => {
  const [refresh, setRefresh] = useState(false);
  const [emails, setEmails] = useState<PlaceType[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>();
  const [selectedPlace, setSelectedPlace] = useState<number>();
  const [msgText, setMsgText] = useState("");
  const [session, setSession] = useState<Session | null>();
  const [messages, setMessages] = useState<UserMessagesDetailsType[]>([]);
  const router = useRouter()

  useEffect(() => {
    const changes = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tb_messages",
          filter: `sender_id=eq.${session?.user?.email || selectedEmail}`,
        },
        (payload: any) => {
          console.log(payload);
          setMessages((prevMessages: UserMessagesDetailsType[]) => {
            const updatedMessages = prevMessages.map(
              (msgDetails: UserMessagesDetailsType) => {
                if (msgDetails.place.id === payload.new.place_id) {
                  return {
                    ...msgDetails,
                    messages: [...msgDetails.messages, payload.new],
                  };
                }
                return msgDetails;
              }
            );

            return updatedMessages;
          });
        }
      )
      .subscribe();

    return () => {
      changes.unsubscribe();
    };
  }, [refresh]);

  useEffect(() => {
    const handleUpload = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.push('/auth/login')
      }
      const session = await supabase.auth.getSession();
      const id = session.data.session?.user.email;
      setSession(session.data.session);

      const data2 = await axios.get(`/api/userMessages/${id}`);
      const res: UserMessagesDetailsType[] = data2.data.message;
      setMessages(res);

      const uniqueEmails: PlaceType[] = Array.from(
        new Set(res.flatMap((msg) => msg.place ?? []))
      );
      setEmails(uniqueEmails.filter((email) => email !== undefined));
    };
    handleUpload();
  }, [refresh]);

  const handelSend = () => {
    if (!msgText) {
      return;
    }
    const data = {
      place_id: selectedPlace,
      text: msgText,
      sender_id: session?.user.email,
      reciever_id: selectedEmail,
    };
    axios.post("/api/messages/1", data);
    setMsgText("");
    setRefresh(!refresh);
  };

  const filteredMessages = messages.flatMap((msgs) =>
    msgs.messages.filter((msg) =>
      selectedEmail
        ? msg.reciever_id == selectedEmail || msg.sender_id == selectedEmail
        : false
    )
  );

  return (
    <div className="flex justify-center items-center w-[100%] lg:p-20 sm:pt-20">
      <div className="flex lg:w-[1000px] sm:w-[350px] h-[600px] shadow-large rounded-large">
        <div className="flex flex-col w-[40%] h-full bg-lightGray overflow-y-auto">
          {emails.map((item, index) => (
            <span
              key={index}
              onClick={() => {
                setSelectedEmail(item.user_email), setSelectedPlace(item.id);
              }}
              className={` flex flex-col transition-bg p-4 rounded-large lg:text-sm sm:text-xxsm ${
                selectedEmail === item.user_email &&
                "bg-secondary font-bold border border-darkGray "
              }`}
            >
                <span>
              {item.place_name}
                </span>
                <span className="lg:text-xsm sm:text-xxsm">
              {item.user_email} 
                </span>
            </span>
          ))}
        </div>
        <div className="flex flex-col w-[60%] h-full overflow-y-auto lg:text-sm sm:text-xsm">
          {filteredMessages.length? (
            <div className="flex flex-col h-[600px] overflow-y-auto lg:p-5 sm:p-2">
              {filteredMessages
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
            selectedEmail&& <div className="flex h-[600px] justify-center items-center font-bold">
              There is no messages yet!
            </div>
          )}
          {selectedEmail&&
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
          }
        </div>
      </div>
    </div>
  );
};

export default Page;

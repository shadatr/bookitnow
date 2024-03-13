"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { LuMessageSquare } from "react-icons/lu";
import { RiNotification4Line } from "react-icons/ri";
import { TbPlaneInflight } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { BiHomeAlt } from "react-icons/bi";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { IoMdLogOut } from "react-icons/io";
import { useRouter } from "next/navigation";

const Header = () => {
  const [session, setSession] = useState<Session | null>();
  const router = useRouter();
  const isActive = typeof window !== "undefined" ? window.location.pathname : "";
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      if(data.session?.user.identities&&data.session?.user.identities[1]) console.log(data.session?.user.identities[1].identity_data?.avatar_url);

    };
    getSession();
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 30) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  },[]);

  const logout = async () => {
    const { error } = await supabase.auth.signOut({});
    if (!error) {
      router.replace("/");
      window.location.reload(); 
    } else {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className={` flex z-0 justify-between items-center w-screen pt-5 px-60 ${isActive=='/login'||isActive=='/signup'?"absolute":"flex"}`}>
      <Link href={'/'}><Image src={'/BookItNow.png'} width={100} height={100} alt={"logo"} /></Link>
      {session?.user||session ? (
        <Sheet>
          <SheetTrigger>
            <Avatar>
              <AvatarImage src={session?.user.identities&&session?.user.identities[1]?.identity_data?session?.user.identities[1].identity_data.avatar_url:"https://github.com/shadcn.png" }/>
            </Avatar>
          </SheetTrigger>
          <SheetContent className="bg-secondary flex flex-col text-md font-bold gap-0 m-0 px-0 py-10">
            <Link
              href="/messages"
              className="hover:bg-lightGray p-3 transtion-bg flex items-center gap-3"
            >
              <LuMessageSquare color="#EE3080" size={25} />
              <p>Messages</p>
            </Link>
            
            <Link
              href="/trips"
              className="hover:bg-lightGray p-3 transtion-bg flex items-center gap-3"
            >
              <TbPlaneInflight color="#EE3080" size={25} />
              <p>Trips</p>
            </Link>
            <Link
              href="/favorites"
              className="hover:bg-lightGray p-3 transtion-bg flex items-center gap-3"
            >
              <FaRegHeart color="#EE3080" size={25} />
              <p>Favorites</p>
            </Link>
            <Link
              href="/hosting"
              className="hover:bg-lightGray p-3 transtion-bg flex items-center gap-3"
            >
              <BiHomeAlt color="#EE3080" size={25} />
              <p>Manage Hosting</p>
            </Link>
            <div
              className="hover:bg-lightGray p-3 transition-bg flex items-center gap-3 cursor-pointer"
              onClick={logout}
            >
              <IoMdLogOut color="#EE3080" size={25} />
              <p>Logout</p>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        isActive=='/login'
        ||isActive=='/signup'?""
        :<Link href="/login" className="px-7 py-2 bg-primary text-secondary rounded-[5px]">Login</Link>
      )}
    </div>
  );
};

export default Header;

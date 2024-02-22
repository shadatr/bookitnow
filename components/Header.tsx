import React from "react";
import logo from "../public/BookItNow.png";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

const Header = () => {
  return (
    <div className=" flex justify-between items-center w-screen py-5 px-20">
      <Image src={logo} alt={"logo"} />

      <Sheet>
        <SheetTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
        </SheetTrigger>
        <SheetContent className="bg-secondary flex flex-col text-md font-bold gap-0 m-0 px-0 py-10">
            <Link href="/messages" className="hover:bg-lightGray p-3 transtion-bg">Messages</Link>
            <Link  href="/notification" className="hover:bg-lightGray p-3 transtion-bg">Notification</Link>
            <Link  href="/trips" className="hover:bg-lightGray p-3 transtion-bg">Trips</Link>
            <Link href="/favorites" className="hover:bg-lightGray p-3 transtion-bg">Favorites</Link>
            <Link href="/hosting" className="hover:bg-lightGray p-3 transtion-bg">Manage Hosting </Link>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;

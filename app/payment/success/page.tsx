import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="w-[100%] flex items-center justify-center pt-60 ">
      <div className="flex flex-col justify-center items-center gap-5 bg-lightGray p-20 rounded-large shadow-large">
        <div className="flex items-center gap-5 text-xmd font-black">
          <Image width={100} height={100} src={"/checked.png"} alt="checked" />
          <span>Reservation done successfully!</span>
        </div>
        <Link href={'/trips'} className="bg-pink text-secondary p-3 font-bold rounded-[10px]">Check your trips</Link>
      </div>
    </div>
  );
};

export default page;

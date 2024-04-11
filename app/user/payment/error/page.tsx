import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="w-[100%] flex items-center justify-center pt-60 ">
      <div className="flex flex-col justify-center items-center gap-5 bg-lightGray p-20 rounded-large shadow-large">
        <div className="flex items-center gap-5 text-xmd font-black">
          <Image width={100} height={100} src={"/cancel.png"} alt="checked" />
          <span>The reservation couldn't be completed!</span>
        </div>
      </div>
    </div>
  );
};

export default page;

"use client";
import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { SparklesCore } from "@/components/ui/sparkles";
import { useRouter } from "next/navigation";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signInWithEmail = async () => {
    if (!password || !email) {
      toast({
        className: "rounded-[5px] p-4 text-red-600",
        description: "You should fill all the fields",
      });
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      console.log(data.user);
      if (data.user) {
        router.replace("/");
      }
      if (error) {
        toast({
          className: "rounded-[5px] p-4 text-red-600",
          description: "The email or password are incorrect",
        });
      }
    }
  };

  const signInWithGoogle = async () => {
    const data = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="flex justify-center items-center w-[100vw] lg:flex-row sm:flex-col">
      <div className="flex flex-col justify-center items-center gap-5  py-20 px-10  lg:w-[50vw]">
        <p className="text-xmd font-black">Login To You Account</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="lg:w-[350px] sm:w-[300px] border border-lightGray focus:outline-mediumGray px-4 py-2 rounded-[5px]"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="lg:w-[350px] sm:w-[300px]  border border-lightGray focus:outline-mediumGray px-4 py-2 rounded-[5px]"
        />
        <Button
          className={cn("lg:w-[350px] sm:w-[300px]  text-secondary rounded-[5px]")}
          onClick={signInWithEmail}
        >
          Login
        </Button>
        <Button
          className={cn(
            "lg:w-[350px] sm:w-[300px] bg-secondary text-primary border border-primary hover:bg-lightGray rounded-[5px] flex gap-3"
          )}
          onClick={signInWithGoogle}
        >
          <FaGoogle /> <p>Login using google</p>
        </Button>
        <p>
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-bold underline">
            Sign up
          </Link>
        </p>
      </div>
      <div className="h-screen bg-black flex flex-col items-center justify-center overflow-hidden rounded-md lg:w-[60vw] sm:w-auto">
        <h1 className=" font-bold text-center text-white relative z-20 lg:text-md sm:text-sm lg:px-20 sm:px-5 ">
          Welcome to BookItNow – your passport to extraordinary stays! Log in
          now to explore unique accommodations and unbeatable deals. Whether
          you're planning a weekend escape or a long-term adventure, BookItNow
          has you covered. Join us and start planning your next unforgettable
          journey today!
        </h1>

        <div className="lg:w-[40rem] h-40 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
      </div>
    </div>
  );
};

export default page;

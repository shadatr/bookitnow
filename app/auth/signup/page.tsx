"use client";
import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { SparklesCore } from "@/components/ui/sparkles";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setmessage] = useState("");
  
  const signUpNewUser = async () => {
    if (password != confirmPassword) {
      toast({
        className: "rounded-[5px] p-4 text-red-600",
        description: "The passwords doesn't match",
      });
    } else if (!password || !email) {
      toast({
        className: "rounded-[5px] p-4 text-red-600",
        description: "You should fill all the fields",
      });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: "http://localhost:3000",
        },
      });
      setmessage("Check Your email for the link")
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="flex justify-center items-center w-[100vw] lg:flex-row sm:flex-col">
      <div className="flex flex-col justify-center items-center gap-5  py-20 px-10  lg:w-[50vw]">
        <p className="text-xmd font-black">Create New Account</p>
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
          className="lg:w-[350px] sm:w-[300px] border border-lightGray focus:outline-mediumGray px-4 py-2 rounded-[5px]"
        />
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Confirm Password"
          className="lg:w-[350px] sm:w-[300px] border border-lightGray focus:outline-mediumGray px-4 py-2 rounded-[5px]"
        />
        <div className="text-pink text-medium">{message}</div>
        <Button
          className={cn("lg:w-[350px] sm:w-[300px] text-secondary rounded-[5px]")}
          onClick={signUpNewUser}
        >
          Login
        </Button>
        <Button
          className={cn(
            "lg:w-[350px] sm:w-[300px] bg-secondary text-primary border border-primary hover:bg-lightGray rounded-[5px] flex gap-3"
          )}
          onClick={signInWithGoogle}
        >
          <FaGoogle /> <p>Sign up using google</p>
        </Button>
        <p>
          Have an account?{" "}
          <Link href="/auth/login" className="font-bold underline">
            Login
          </Link>
        </p>
      </div>
      <div className="h-screen bg-black flex flex-col items-center justify-center overflow-hidden rounded-md lg:w-[60vw] sm:w-auto">
        <h1 className=" font-bold text-center text-white relative z-20 lg:text-md sm:text-sm lg:px-20 sm:px-5 ">
          Join BookItNow for access to amazing stays! Sign up now to start
          planning your next adventure with ease.
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

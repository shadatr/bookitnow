"use client";
import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    }
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    console.log(data);
  };

  return (
    <div className="flex justify-center items-cente pt-40">
      <div className="flex flex-col justify-center items-center gap-5 border border-lightGray py-20 px-10 rounded-3xl shadow-md">
        <p className="text-xmd font-black">Create New Account</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-[350px] border border-lightGray focus:outline-mediumGray px-4 py-2 rounded-[5px]"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-[350px] border border-lightGray focus:outline-mediumGray px-4 py-2 rounded-[5px]"
        />
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Confirm Password"
          className="w-[350px] border border-lightGray focus:outline-mediumGray px-4 py-2 rounded-[5px]"
        />
        <Button
          className={cn("w-[350px] text-secondary rounded-[5px]")}
          onClick={signUpNewUser}
        >
          Login
        </Button>
        <Button
          className={cn(
            "w-[350px] bg-secondary text-primary border border-primary hover:bg-lightGray rounded-[5px] flex gap-3"
          )}
          onClick={signInWithGoogle}
        >
          <FaGoogle /> <p>Sign up using google</p>
        </Button>
        <p>
          Have an account?{" "}
          <Link href="/login" className="font-bold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;

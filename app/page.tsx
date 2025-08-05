'use client'


import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import { useEffect, useState } from "react";

export default function LoginPage() {


  const [data,setData]=useState(null);




  useEffect(()=>{

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`)
    .then(res=>res.json())
  .then(data=>console.log(data));

 

  },[]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
         
         
           Indesign Dashboard
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image src={"/placeholder.svg"} alt="Image" fill className="object-cover dark:brightness-[0.2] dark:grayscale" />
      
      </div>
    </div>
  )
}

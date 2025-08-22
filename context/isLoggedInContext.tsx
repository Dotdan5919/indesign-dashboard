'use client'
import { useRouter } from 'next/navigation';
import React, { createContext, useState,useEffect, ReactNode } from 'react'



interface isloggedinType{

    islogged:boolean,
    isloading:boolean
}


interface isloggedincontext
{
isloggedin:boolean,
isLoading: boolean,
setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>



}


interface LoggedInType
{
    children:ReactNode
}

export const isLoggedInContext=createContext<isloggedincontext | null>(null);





export default function LoggedInProvider({children}:LoggedInType) {

const [isloggedin,setIsLoggedin]=useState(false);


git

  const [isLoading, setIsLoading] = useState(true);

    
      const router=useRouter();

    
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile`, {
          method: "GET",
          credentials: "include"
        })
          .then(res => {
            if (!res.ok) throw new Error('Not authenticated');
            return res.json();
          })
          .then(data=>{
             
            setIsLoading(false);
            router.push('/dashboard');
            console.log(data)
            }
          )
          .catch(() => { setIsLoading(false); router.push('/login')});
      }, [router]);




      const values={

        
isloggedin,
isLoading,
setIsLoading,
setIsLoggedin
      }


  return (
   <isLoggedInContext.Provider value={values}>
     {!isLoading && children}
   </isLoggedInContext.Provider>
  )
}

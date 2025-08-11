'use client'
import React, { createContext, ReactNode } from 'react'

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';




interface Profile{

username:string,
id:string,
role:string,
email:string

}

interface ProfileType
{
    children:ReactNode
}

interface ProfileContextType
{
profile: Profile | undefined;
isLoading: boolean;
setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;


}

export const ProfileContext=createContext<ProfileContextType|null>(null);
export default function ProfileProvider({children}:ProfileType) {

  const[profile,setProfile]=useState<Profile>()
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
             setProfile(data);
            setIsLoading(false);
          console.log(data)
            }
          )
          .catch(() => { setIsLoading(false); router.push('/login')});
      }, [router]);


      const values={

        profile,
        isLoading,
        setIsLoading
      }

  return (
   <ProfileContext.Provider value={values}>
{children}

   </ProfileContext.Provider>
  )
}

import { isLoggedInContext } from '@/context/IsloggedinContext'
import React, { useContext } from 'react'

export default function useLoggedin() {

const context=useContext(isLoggedInContext);

if(!context){

     throw new Error('Logged in context must be in Logged in Provider')
}

  return  context;
}

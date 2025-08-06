// Usage:
// 1. Wrap your app or page with <ProfileContext.Provider value={...}> in your layout or _app file.
// 2. Only call useProfile() inside a React function component or another custom hook.
//
// Example:
// <ProfileContext.Provider value={profile}>
//   <AppSidebar />
//   ...
// </ProfileContext.Provider>
//
// function MyComponent() {
//   const profile = useProfile();
//   ...
// }

import React, { useContext } from 'react'
import { ProfileContext } from '@/context/ProfileContext';

export default function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be under Profile context provider')
  }
  return context
}

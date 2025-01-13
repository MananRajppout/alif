// src/components/ClientComponents.tsx
'use client';

import { Toaster } from "react-hot-toast";
import PopupLogin from "./register/popup-login";
import PopupRegister from "./register/popup-register";
import LostPassword from "./register/lost-password";

export default function ClientComponents({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <>
      {children}
      <Toaster />
      <PopupLogin />
      <PopupRegister />
      <LostPassword />
    </>
  );
}
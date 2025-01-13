// src/components/ThemeProviderWrapper.tsx
"use client"; // This makes the component a client component

import ThemeContextProvider from "../context/ThemeContext"; // Adjust the path if necessary
import { SessionProvider } from "next-auth/react"; // Import Session Provider from Next Auth

import { ReactNode } from "react";
import { SocketProvider } from "../context/SocketContext";

const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeContextProvider>
        {/* <SocketProvider> */}
          {children}

        {/* </SocketProvider> */}
      </ThemeContextProvider>
    </SessionProvider>
  );
};

export default ThemeProviderWrapper;

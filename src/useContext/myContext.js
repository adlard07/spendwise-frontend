"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { decodeAccessToken } from "@/lib/globalHelpers";

const MyContext = createContext(null);

export function MyContextProvider({ children }) {
  const [user, setUser] = useState(null); // { userId, email, exp }
  const [ready, setReady] = useState(false);
  const [insightPage, setInsightPage] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("access_token");

      if (token) {
        const decoded = decodeAccessToken(token);
        setUser(decoded ?? null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Token decode failed:", err);
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  function clearUser() {
    localStorage.removeItem("access_token");
    setUser(null);
  }

  return (
    <MyContext.Provider
      value={{
        user,
        setUser,
        clearUser,
        ready,
        setReady,
        insightPage,
        setInsightPage,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const ctx = useContext(MyContext);
  if (!ctx)
    throw new Error("useMyContext must be used inside MyContextProvider");
  return ctx;
}

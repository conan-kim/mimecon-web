"use client";

import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {isLoading && (
        <div
          className="w-100 fixed right-0 top-0 z-100 z-[200] flex h-full w-full items-center justify-center text-xl"
          style={{ backgroundColor: "black", opacity: 0.5 }}
        >
          <div className="flex h-16 w-16 gap-1">
            <div className="h-6 w-2 animate-bounce rounded-full bg-[#627fff]"></div>
            <div
              className="h-6 w-2 animate-bounce rounded-full bg-[#627fff]"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-6 w-2 animate-bounce rounded-full bg-[#627fff]"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

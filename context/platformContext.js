"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const PlatformContext = createContext();

export const usePlatform = () => useContext(PlatformContext);

export const PlatformProvider = ({ children }) => {
  const [platform, setPlatform] = useState("desktop");

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    console.log("userAgent", userAgent);
    if (/android/i.test(userAgent)) {
      setPlatform("android");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setPlatform("ios");
    } else {
      setPlatform("desktop");
    }
  }, []);

  const getDownloadLink = () => {
    switch (platform) {
      case "android":
        return "https://www.naver.com";
      case "ios":
        return "https://www.daum.net";
      case "desktop":
        return "download";
      default:
        return "download";
    }
  };

  return (
    <PlatformContext.Provider
      value={{
        platform,
        getDownloadLink,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

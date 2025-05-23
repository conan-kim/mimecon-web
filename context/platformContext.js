"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const PlatformContext = createContext();

export const usePlatform = () => useContext(PlatformContext);

export const PlatformProvider = ({ children }) => {
  const [platform, setPlatform] = useState("desktop");

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      setPlatform("android");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setPlatform("ios");
    } else {
      setPlatform("desktop");
    }
  }, []);

  const getDownloadLink = () => {
    let url = 'download';
    if (platform === "android") {
      url = "https://play.google.com/store/apps/details?id=com.ploonet.mimecon";
    } else if (platform === "ios") {
      url = "https://apps.apple.com/app/%EB%AF%B8%EB%AF%B8%EC%BD%98-mimecon/id6504627348";
    }

    return url;
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

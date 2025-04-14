"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import LogoSvg from "@/public/logo.svg";
import DownloadSvg from "@/public/download.svg";
import GoogleDownloadSvg from "@/public/download-google.svg";
import AppleDownloadSvg from "@/public/download-appstore.svg";
import { usePlatform } from "../../context/platformContext";

const DownloadPage = () => {
  const [platform, setPlatform] = useState("desktop");
  const { getDownloadLink } = usePlatform();

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

  const renderDownload = () => {
    return (
      <div className="flex flex-col flex-1 w-full">
        {platform === "android" || platform === "ios" ? (
          <a
            // href="mimecon://www.mimecon.app"
            href={getDownloadLink()}
            target="_blank"
            className="flex flex-row cursor-pointer justify-center items-center mx-[20px] py-[10px] rounded-[16px] bg-gradient-to-r from-[#00FF94] to-[#00E5CA]"
          >
            <div className="font-bold text-[16px]">미미콘 앱 다운로드</div>
            <DownloadSvg />
          </a>
        ) : (
          <div className="flex flex-row gap-4 items-center justify-center">
            <a
              href="https://apps.apple.com/app/%EB%AF%B8%EB%AF%B8%EC%BD%98-mimecon/id6504627348"
              target="_blank"
              className="cursor-pointer"
            >
              <AppleDownloadSvg />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.ploonet.mimecon"
              target="_blank"
              className="cursor-pointer"
            >
              <GoogleDownloadSvg />
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex flex-col h-svh bg-black items-center justify-start">
        <div className="w-full aspect-square">
          <Image
            src={"/download-bg.png"}
            fill
            alt="Picture of the mimecon"
            style={{ objectFit: "contain", objectPosition: "top" }}
          />
        </div>
      </div>
      <div className="absolute flex flex-col bottom-0 left-0 right-0 items-center justify-center pb-[24px] gap-12">
        <div className="flex flex-col gap-0 items-center">
          <LogoSvg width={160} height={160} />
          <div className="flex flex-col text-white text-[40px] text-center leading-[40px]">
            <span className="font-thin">새로운 커뮤니케이션</span>
            <span className="font-bold">같이 미미콘 할래?</span>
          </div>
        </div>
        <div className="flex flex-col flex-1 w-full items-center gap-4">
          <div className="text-[#00E09B] text-[20px] font-bold">
            지금 바로 다운로드 하세요!
          </div>
          {renderDownload()}
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;

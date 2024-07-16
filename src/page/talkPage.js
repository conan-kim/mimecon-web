"use client";
import { useEffect, useState } from "react";
import VideoPlayer from "@/src/component/videoPlayer";
import Link from "next/link";

import LogoSvg from "@/public/logo.svg";
import MuteSvg from "@/public/mute.svg";
import UnmuteSvg from "@/public/unmuted.svg";
import TimerSvg from "@/public/timer.svg";
import MicSvg from "@/public/mic.svg";
import SendSvg from "@/public/send.svg";

const TalkPage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [text, setText] = useState("");
  const [time, setTime] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const pad = (num) => String(num).padStart(2, "0");
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  const toggleMute = () => {
    console.log("toggleMute");
    setIsMuted(!isMuted);
  };

  const onChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="relative flex flex-1 flex-col h-[100vh] bg-black">
      <div className="flex flex-row justify-between items-center px-[12px] py-[8px]">
        <Link
          href="download"
          className="flex flex-row justify-center items-center gap-1"
        >
          <LogoSvg width={40} height={40} />
          <div className="font-bold text-[14px] text-[#03FFB0]">
            APP 다운로드
          </div>
        </Link>
        <div className="cursor-pointer px-[12px] py-[8px] rounded-full border border-white/80">
          <div className="text-white/80">대화종료</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between items-center w-full h-full pt-[8px]">
        <div className="relative flex flex-1 flex-col rounded-t-[20px] w-full bg-green-400 justify-between items-center">
          <VideoPlayer
            src="https://cdn-unifier.lucasai.io/mss/dev/mimecon/66754f293854fb06ac228fd6/60dce55c-641e-42a9-aa0a-305a5723a1b4/4c81652b-a204-456d-86f1-e5685ab92080/index.m3u8"
            type="m3u8"
          />
          <div className="absolute top-0 bottom-0 flex flex-col w-full h-full items-center justify-between">
            <div className="flex flex-row justify-between items-center p-[12px] w-full">
              <div
                className="w-8 h-8 flex flex-col items-center justify-center bg-black/60 rounded-full cursor-pointer"
                onClick={toggleMute}
              >
                {isMuted ? <MuteSvg /> : <UnmuteSvg />}
              </div>
              <div
                className={
                  time < 60
                    ? "py-[8px] px-[12px] flex flex-row items-center justify-center bg-[#EB4D4D] rounded-full text-white gap-2"
                    : "py-[8px] px-[12px] flex flex-row items-center justify-center bg-black/60 rounded-full text-white gap-2"
                }
              >
                <TimerSvg />
                <div>{formatTime(time)}</div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-[12px] w-full">
              <div className="flex flex-row rounded-full items-center justify-between w-full p-[20px] bg-black/60">
                <input
                  className="flex-1 w-full bg-transparent border-none focus:outline-none border-transparent focus:border-transparent focus:ring-0 text-white"
                  placeholder="메세지 입력"
                  onChange={onChange}
                  value={text}
                />
                {text ? <SendSvg /> : <MicSvg />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalkPage;

"use client";
import MoreSvg from "@/public/more.svg";
import HeartSvg from "@/public/heart.svg";
import TalkSvg from "@/public/talk.svg";
import ShareSvg from "@/public/share.svg";
import AISvg from "@/public/summary_talk.svg";
import TalkFilledSvg from "@/public/talk_filled.svg";
import MuteSvg from "@/public/mute.svg";
import UnmuteSvg from "@/public/unmuted.svg";
import { useState } from "react";
import VideoPlayer from "../../src/component/videoPlayer";
import Modal from "../../src/component/modal";

const Page = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const testUrl =
    "https://cdn-unifier.lucasai.io/mss/dev/mimecon/66754f293854fb06ac228fd6/669374424e2c0959eb4ff58e/8ef6cf10-cd6a-4c79-b8e4-2084e1f46c54/index.m3u8";

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const renderHeart = () => {
    return (
      <div
        className="cursor-pointer flex flex-row items-center justify-center gap-1"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <HeartSvg />
        <div className="text-white font-bold text-[12px]">34</div>
      </div>
    );
  };

  const renderTalk = () => {
    return (
      <div
        className="cursor-pointer flex flex-row items-center justify-center gap-1"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <TalkSvg />
        <div className="text-white font-bold text-[12px]">34</div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-1 flex-col h-[100vh]">
      <div className="bg-black w-full h-full">
        <VideoPlayer src={testUrl} type="m3u8" />
      </div>
      <div className="absolute flex flex-col items-center justify-between w-full h-full">
        <div className="flex flex-row w-full items-center justify-between px-[12px] py-[4px]">
          <div className="flex flex-row items-center justify-start gap-4">
            <div className="h-8 w-8 rounded-full bg-gray-400" />
            <div className="text-white text-[12px] leading-[16px]">
              <span className="font-bold">졸린쿠키123</span>님의 미미콘과{"\n"}
              <span className="font-bold">느긋한초코칩</span>님의 대화
            </div>
          </div>
          <div className="cursor-pointer">
            <MoreSvg />
          </div>
        </div>
        <div className="flex flex-col w-full items-start justify-start">
          <div className="flex flex-col items-start justify-center px-5 py-8 gap-4">
            <div
              className="w-8 h-8 flex flex-col items-center justify-center bg-black/60 rounded-full cursor-pointer"
              onClick={toggleMute}
            >
              {isMuted ? <MuteSvg /> : <UnmuteSvg />}
            </div>
            <div>hello</div>
            <div className="flex flex-row items-center justify-center gap-2 pt-2">
              <div
                className="flex flex-row gap-2 items-center jusitfy-center py-2 px-3 rounded-full cursor-pointer border border-[#00F49B] bg-[#00F49B]"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <AISvg />
                <div className="text-[14px] font-semibold">대화요약</div>
              </div>
              <div
                className="flex flex-row gap-2 items-center jusitfy-center py-2 px-3 rounded-full cursor-pointer border border-[#00F49B]"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <TalkFilledSvg />
                <div className="text-[#00F49B] text-[14px] font-semibold">
                  나도 대화해볼래
                </div>
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-[#00F49B]"></div>
          <div className="flex flex-row pt-4 pb-6 px-3 justify-between items-center w-full backdrop-blur-2xl">
            <div className="flex flex-row gap-5">
              {renderHeart()}
              {renderTalk()}
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <ShareSvg />
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="안녕?"
        description="하하하!"
      />
    </div>
  );
};

export default Page;

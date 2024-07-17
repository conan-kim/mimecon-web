"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePlatform } from "../../../context/platformContext";

const TalkCompleteModal = ({ isOpen, setIsOpen, onConfirm }) => {
  const { getDownloadLink } = usePlatform();

  if (!isOpen) return;
  return createPortal(
    <div
      className="absolute top-0 bottom-0 left-0 right-0 flex flex-1 flex-col items-center justify-center bg-black/20 break-keep"
      onClick={() => {
        setIsOpen(false);
      }}
    >
      <div className="flex flex-col py-8 px-5 gap-8 bg-white rounded-[24px] max-w-[335px]">
        <div className="flex flex-col gap-3">
          <div className="font-bold text-[18px]">
            미미콘과 즐거운 대화 나누셨나요?
          </div>
          <div className="text-[16px] leading-[24px] text-[#444444] text-wrap">
            대화를 마치고 저장할까요?{"\n"}나눈 대화를 저장하면 보낸 사람이 볼
            수 있어요.
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div
            className="flex flex-col cursor-pointer rounded-full w-[143px] py-[14px] items-center justify-center text-[16px] font-bold bg-[#E8FAF4]"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            취소
          </div>
          <Link
            href={getDownloadLink()}
            className="flex flex-col cursor-pointer rounded-full w-[143px] py-[14px] items-center justify-center text-[16px] font-bold bg-[#00F49B] text-white"
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              }
              setIsOpen(false);
            }}
          >
            대화 저장하기
          </Link>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default TalkCompleteModal;

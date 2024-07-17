"use client";
import Link from "next/link";
import { createPortal } from "react-dom";

import LogoSvg from "@/public/logo.svg";

const InterActionModal = ({ isOpen, setIsOpen, onConfirm }) => {
  if (!isOpen) return;
  return createPortal(
    <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-1 flex-col items-center justify-center bg-black/80 gap-4">
      <div className="flex flex-col py-8 px-5 gap-8 bg-white rounded-[24px]">
        <div className="flex flex-col gap-3 items-center justify-center">
          <LogoSvg width={80} height={80} />
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="font-bold text-[18px] text-[#222222]">
              같이 미미콘 할래?
            </div>
            <div className="text-[14px] leading-[24px] text-[#444444]">
              미미콘 앱에서 더 재미있는 기능을 이용해보세요.
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Link
            href="download"
            className="flex flex-col cursor-pointer rounded-[16px] w-[295px] py-[21px] items-center justify-center text-[16px] font-bold bg-gradient-to-r from-[#00FF94] to-[#00E5CA]"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            미미콘 앱 다운로드
          </Link>
        </div>
      </div>
      <div
        className="text-white cursor-pointer underline"
        onClick={() => {
          setIsOpen(false);
          if (onConfirm) {
            onConfirm();
          }
        }}
      >
        괜찮아요. 모바일웹으로 볼게요.
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default InterActionModal;

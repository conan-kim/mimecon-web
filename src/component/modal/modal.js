"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePlatform } from "../../../context/platformContext";

const Modal = ({
  isOpen,
  setIsOpen,
  title,
  description,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}) => {
  const { getDownloadLink } = usePlatform();

  if (!isOpen) return;
  if (typeof window === "undefined") return null;
  return createPortal(
    <div
      className="z-50 absolute top-0 bottom-0 left-0 right-0 flex flex-1 flex-col items-center justify-center bg-black/20 break-keep"
      onClick={() => {
        setIsOpen(false);
      }}
    >
      <div className="flex flex-col py-8 px-5 gap-8 bg-white rounded-[24px] max-w-[335px]">
        <div className="flex flex-col gap-3">
          <div className="text-[#222222] font-bold text-[18px]">{title}</div>
          <div className="text-[16px] leading-[24px] text-[#444444] text-wrap whitespace-pre">
            {description}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div
            className="flex flex-col cursor-pointer rounded-full w-[143px] py-[14px] items-center justify-center text-[16px] font-bold bg-[#E8FAF4]"
            onClick={() => {
              if (onCancel) {
                onCancel();
              }
              setIsOpen((prev) => !prev);
            }}
          >
            {cancelText ?? "취소"}
          </div>
          <Link
            href={getDownloadLink()}
            target="_blank"
            className="flex flex-col cursor-pointer rounded-full w-[143px] py-[14px] items-center justify-center text-[16px] font-bold bg-[#00E09B] text-white"
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              }
              setIsOpen((prev) => !prev);
            }}
          >
            {confirmText ?? "앱 다운로드"}
          </Link>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;

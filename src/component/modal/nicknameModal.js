"use client";
import { createPortal } from "react-dom";
import DiceSvg from "@/public/dice.svg";
import UnCheckedSvg from "@/public/checkbox-true.svg";
import CheckedSvg from "@/public/checkbox-false.svg";
import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import TermsAndCondition from "./termsAndCondition";

const NicknameModal = ({ isOpen, setIsOpen, onCompleted }) => {
  const [agreed, setAgreed] = useState(false);
  const [valid, setValid] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(false);
  const [hasInvalidCharacter, setHasInvalidCharacter] = useState(false);
  const [isTncOpen, setIsTncOpen] = useState(false);

  const [nickname, setNickname] = useState("");
  const [guestId, setGuestId] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    getRandomNickname();
  }, [isOpen]);

  useEffect(() => {
    if (agreed && nickname.length >= 2 && nickname.length < 11) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [agreed, nickname]);

  const getRandomNickname = async () => {
    try {
      const { nick_name, guest_id } = await axiosInstance.post(
        "guest/new_nickname"
      );
      setNickname(nick_name);
      setGuestId(guest_id);
    } catch (e) {
      console.log("error", e);
    }
  };

  const checkDuplicateNickname = async (_nickname) => {
    try {
      console.log("check duplication for", _nickname);
      const res = await axiosInstance.get(
        "guest/check_duplicate_nickname?nick_name=" + _nickname
      );
      setIsDuplicated(res);
    } catch (e) {
      console.log("error", e);
    }
  };

  const onChange = (event) => {
    const value = event.target.value;
    const pattern = /^[ㄱ-ㅎ가-힣0-9a-zA-Z]*$/; // 한글, 숫자, 영문만 가능
    if (pattern.test(value)) {
      setHasInvalidCharacter(false);
      setNickname(event.target.value);
      checkDuplicateNickname(event.target.value);
    } else {
      setHasInvalidCharacter(true);
    }
  };

  if (!isOpen) return;
  if (typeof window === "undefined") return null;
  return createPortal(
    <div className="z-50 absolute top-0 bottom-0 left-0 right-0 flex flex-1 flex-col items-center justify-center bg-black/20">
      <div className="flex flex-col py-8 px-5 gap-8 bg-white rounded-[24px] max-w-[335px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="text-[#222222] font-bold text-[18px]">
              닉네임을 입력해주세요
            </div>
            <div className="text-[16px] leading-[24px] text-[#444444]">
              톡방에서 사용할 닉네임이에요.
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row rounded-[12px] border border-[#7CE3B8] items-center justify-between w-full px-[16px] py-[20px]">
                <input
                  className="flex-1 w-full bg-transparent border-none focus:outline-none border-transparent focus:border-transparent focus:ring-0 text-black"
                  placeholder="메세지 입력"
                  onChange={onChange}
                  value={nickname}
                  maxLength={10}
                />
                <div className="cursor-pointer" onClick={getRandomNickname}>
                  <DiceSvg />
                </div>
              </div>
              {isDuplicated && nickname.length >= 2 && (
                <div className="ml-1 text-[10px] text-[#ff0000] opacity-80">
                  이미 사용중인 닉네임이에요.
                </div>
              )}
              {nickname.length < 2 && (
                <div className="ml-1 text-[10px] text-[#ff0000] opacity-80">
                  닉네임은 2자 이상 10자 이하로 입력해주세요.
                </div>
              )}
              {hasInvalidCharacter && (
                <div className="ml-1 text-[10px] text-[#ff0000] opacity-80">
                  닉네임은 띄어쓰기 없이 한글, 영문, 숫자만 입력 가능해요.
                </div>
              )}
            </div>
            <div className="flex flex-row items-center justify-start gap-2">
              <div
                className="cursor-pointer"
                onClick={() => {
                  setAgreed((prev) => {
                    return !prev;
                  });
                }}
              >
                {agreed ? <CheckedSvg /> : <UnCheckedSvg />}
              </div>
              <div className="text-[12px] text-[#222222]">
                개인정보 수집 및 이용 동의
              </div>
              <div
                className="text-[12px] text-[#9a9a9a] underline cursor-pointer"
                onClick={() => {
                  setIsTncOpen(true);
                }}
              >
                자세히보기
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div
            className={
              valid && !isDuplicated
                ? "flex flex-col cursor-pointer rounded-full w-[295px] py-[14px] items-center justify-center text-[16px] font-bold bg-[#00E09B] text-white"
                : "flex flex-col rounded-full w-[295px] py-[14px] items-center justify-center text-[16px] font-bold bg-[#DDDEDE] text-white"
            }
            onClick={() => {
              if (!valid || isDuplicated) return;
              if (onCompleted) {
                onCompleted(guestId, nickname);
              }
              setIsOpen((prev) => !prev);
            }}
          >
            톡방 입장하기
          </div>
        </div>
      </div>
      <TermsAndCondition isOpen={isTncOpen} setIsOpen={setIsTncOpen} />
    </div>,
    document.getElementById("modal-root")
  );
};

export default NicknameModal;

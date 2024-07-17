"use client";
import { useEffect, useState } from "react";

import Link from "next/link";

import LogoSvg from "@/public/logo.svg";
import MuteSvg from "@/public/mute.svg";
import UnmuteSvg from "@/public/unmuted.svg";
import TimerSvg from "@/public/timer.svg";
import MicSvg from "@/public/mic.svg";
import SendSvg from "@/public/send.svg";
import NicknameModal from "../component/modal/nicknameModal";
import axiosInstance from "../../api/axiosInstance";
import TalkVideoPlayer from "../component/talkVideoPlayer";
import { useSearchParams } from "next/navigation";
import Modal from "../component/modal/modal";

const TalkPage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [mimecon, setMimecon] = useState(null);
  const [idleUrl, setIdleUrl] = useState("");
  const [inputText, setInputText] = useState("");
  const [chatroomId, setChatroomId] = useState("");
  const [time, setTime] = useState(600);
  const [timeLastReactedAt, setTimeLastReactedAt] = useState(new Date());
  const [text, setText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const searchParams = useSearchParams();
  const mimecon_id = searchParams.get("mimecon_id");

  useEffect(() => {
    if (!mimecon_id) {
      setIsErrorModalOpen(true);
      return;
    }
    fetchMimecon();
    connectChatroom();
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) return;
    if (!mimecon) return;
    const reactTimer = setInterval(() => {
      const diff = Math.floor((new Date() - timeLastReactedAt) / 1000);
      console.log("diff is", diff);
      if (diff === 180) {
        setVideoUrl(mimecon?.session_expiration01_url);
        setText("어디갔니? 왜 말이 없어?");
      } else if (diff === 240) {
        setVideoUrl(mimecon?.session_expiration02_url);
        setText("더 이상 대답하지 않으면 대화를 끝낼게.");
      }
    }, 1000);

    return () => clearInterval(reactTimer);
  }, [isConnected, mimecon, timeLastReactedAt]);

  const formatTime = (seconds) => {
    const pad = (num) => String(num).padStart(2, "0");
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const onChange = (event) => {
    setInputText(event.target.value);
  };

  const fetchMimecon = async () => {
    try {
      const res = await axiosInstance.post(`/mimecon/${mimecon_id}`);
      setMimecon(res);
      setIdleUrl(res?.idle_url);
    } catch (e) {
      console.log("error", e);
      setIsErrorModalOpen(true);
    }
  };

  const connectChatroom = async () => {
    try {
      const { available_chatroom, available_link } = await axiosInstance.get(
        `mimecon/connect?mimecon_id=${mimecon_id}`
      );
      if (available_chatroom && available_link) {
        setIsNicknameModalOpen(true);
      } else if (!available_chatroom) {
        // TODO: unavailable_chatroom
        setIsErrorModalOpen(true);
      } else if (!available_link) {
        // TODO: unavailable_link
        setIsErrorModalOpen(true);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const joinChatroom = async (guest_id, nick_name) => {
    try {
      const {
        chat_room_id,
        live_url,
        text: _text,
      } = await axiosInstance.get(
        `guest/mimecon/start?mimecon_id=${mimecon_id}&guest_id=${guest_id}&nick_name=${nick_name}`
      );
      setIsConnected(true);
      setTimeLastReactedAt(new Date());
      setChatroomId(chat_room_id);
      setVideoUrl(live_url);
      setText(_text);
    } catch (e) {
      console.log("error", e);
      setIsErrorModalOpen(true);
    }
  };

  const endChatroom = async (session_expiration) => {
    try {
      await axiosInstance.get(
        `guest/mimecon/end?chat_room_id=${chatroomId}&session_expiration=${session_expiration}`
      );
    } catch (e) {
      console.log("error", e);
    }
  };

  const sendText = async () => {
    try {
      const params = {
        chat_room_id: chatroomId,
        text: inputText,
      };
      const { live_url, text: _text } = await axiosInstance.post(
        "guest/mimecon/talk",
        params
      );
      setVideoUrl(live_url);
      setText(_text);
      setTimeLastReactedAt(new Date());
    } catch (e) {
      console.log("error", e);
    }
  };

  const sendVoice = async () => {
    try {
      const params = {
        chat_room_id: chatroomId,
      };
      const { live_url, text: _text } = await axiosInstance.post(
        "guest/mimecon/talk",
        params
      );
      setVideoUrl(live_url);
      setText(_text);
      setTimeLastReactedAt(new Date());
    } catch (e) {
      console.log("error", e);
    }
  };

  const onModalClose = async (guest_id, nick_name) => {
    joinChatroom(guest_id, nick_name);
  };

  const onVideoEnded = () => {
    if (videoUrl === idleUrl) return;
    setVideoUrl(idleUrl);
    setText("");
  };

  return (
    <div className="relative flex flex-col h-[100vh] bg-black">
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
        {isConnected && (
          <div className="relative flex flex-1 flex-col rounded-t-[20px] w-full h-full justify-between items-center">
            <TalkVideoPlayer
              src={videoUrl}
              type="m3u8"
              muted={isMuted}
              loop={true}
              onVideoEnded={onVideoEnded}
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
              <div className="flex flex-col items-center justify-center p-[12px] w-full gap-4">
                <div className="bg-black/60 text-white text-[18px] max-w-[400px] text-center text-wrap break-keep">
                  {text}
                </div>
                <div className="flex flex-row rounded-full items-center justify-between w-full p-[20px] bg-black/60">
                  <input
                    className="flex-1 w-full bg-transparent border-none focus:outline-none border-transparent focus:border-transparent focus:ring-0 text-white"
                    placeholder="메세지 입력"
                    onChange={onChange}
                    value={inputText}
                  />
                  <div className="cursor-pointer" onClick={sendText}>
                    {inputText ? <SendSvg /> : <MicSvg />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <NicknameModal
        isOpen={isNicknameModalOpen}
        setIsOpen={setIsNicknameModalOpen}
        onCompleted={onModalClose}
      />
      <Modal
        isOpen={isErrorModalOpen}
        setIsOpen={setIsErrorModalOpen}
        title="확인할 수 없는 미미콘이에요 😢"
        description="이럴게 아니라 직접 미미콘을 만들어보는건 어때요?"
        cancelText="확인"
        confirmText="만들러가기"
      />
    </div>
  );
};

export default TalkPage;

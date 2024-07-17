"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NicknameModal from "../component/modal/nicknameModal";
import axiosInstance from "../../api/axiosInstance";
import TalkVideoPlayer from "../component/talkVideoPlayer";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "../component/modal/modal";
import { usePlatform } from "../../context/platformContext";

import LogoSvg from "@/public/logo.svg";
import MuteSvg from "@/public/mute.svg";
import UnmuteSvg from "@/public/unmuted.svg";
import TimerSvg from "@/public/timer.svg";
import MicSvg from "@/public/mic.svg";
import SendSvg from "@/public/send.svg";
import InfoSvg from "@/public/info.svg";
import ListenJson from "@/public/listen.json";
import AskJson from "@/public/ask.json";
import Lottie from "react-lottie-player";
import TalkCompleteModal from "../component/modal/talkCompleteModal";

const TalkPage = () => {
  const VOICE_STATUS = {
    LISTENING: 0,
    UPLOADING: 1,
    REPLYING: 2,
  };
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [isSttOpen, setIsSttOpen] = useState(false);
  const [micStream, setMicStream] = useState(null);
  const [useVoice, setUseVoice] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState(VOICE_STATUS.LISTENING);
  const [showToast, setShowToast] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [mimecon, setMimecon] = useState(null);
  const [idleUrl, setIdleUrl] = useState("");
  const [inputText, setInputText] = useState("");
  const [chatroomId, setChatroomId] = useState("");
  const [time, setTime] = useState(600);
  const [timeLastReactedAt, setTimeLastReactedAt] = useState(new Date());
  const [text, setText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  const router = useRouter();
  const { getDownloadLink } = usePlatform();

  const searchParams = useSearchParams();
  const mimecon_id = searchParams.get("mimecon_id");
  const dataFromWs = useRef([]);
  const data = useRef([]);
  const ws = useRef();

  // 오디오 버퍼
  const bufferSize = 256; // buffer size(512). multiply by two in encPCM function
  const numChannels = 1; // channel count(only one channel)
  const sampleRate = 16000; // samplerate

  let audioContext;
  let scriptProcessorNode;
  let source;

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
      if (diff === 180) {
        setVideoUrl(mimecon?.session_expiration01_url);
        setText("어디갔니? 왜 말이 없어?");
      } else if (diff === 240) {
        setVideoUrl(mimecon?.session_expiration02_url);
        setText("더 이상 대답하지 않으면 대화를 끝낼게.");
      } else if (diff === 300) {
        setIsAbsenceModalOpen(true);
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
        `/mimecon/connect?mimecon_id=${mimecon_id}`
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
        `/guest/mimecon/start?mimecon_id=${mimecon_id}&guest_id=${guest_id}&nick_name=${nick_name}`
      );
      setTimeLastReactedAt(new Date());
      setChatroomId(chat_room_id);
      setVideoUrl(live_url);
      setText(_text);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setIsConnected(true);
      }, 3000);
    } catch (e) {
      console.log("error", e);
      setIsErrorModalOpen(true);
    }
  };

  const endChatroom = async (session_expiration) => {
    try {
      if (!chatroomId) return;
      await axiosInstance.get(
        `/guest/mimecon/end?chat_room_id=${chatroomId}&session_expiration=${session_expiration}`
      );
      router.push("download");
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
        "/guest/mimecon/talk",
        params
      );
      setVideoUrl(live_url);
      setText(_text);
      setInputText("");
      setTimeLastReactedAt(new Date());
    } catch (e) {
      console.log("error", e);
    }
  };

  const sendVoice = async () => {
    try {
      setVoiceStatus(VOICE_STATUS.UPLOADING);
      const params = {
        chat_room_id: chatroomId,
        text: inputText,
        ...audioFile,
      };
      const { live_url, text: _text } = await axiosInstance.post(
        "/guest/mimecon/talk",
        params
      );
      setVoiceStatus(VOICE_STATUS.REPLYING);
      setVideoUrl(live_url);
      setText(_text);
      setInputText("");
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
    setVoiceStatus(VOICE_STATUS.LISTENING);
  };

  const connectStt = async () => {
    console.log("connectStt");
    try {
      const _ws = new WebSocket(process.env.NEXT_PUBLIC_DEV_WSS_STT_URL);
      ws.current = _ws;

      const setupWebSocket = (wsInstance) => {
        wsInstance.onopen = () => {
          wsInstance.send(
            JSON.stringify({
              app_id: process.env.NEXT_PUBLIC_WS_CONNECT_APP_ID,
              synapses_id: process.env.NEXT_PUBLIC_WS_CONNECT_SYNAPSES_ID,
              owner: process.env.NEXT_PUBLIC_WS_CONNECT_OWNER,
              model_name: process.env.NEXT_PUBLIC_WS_CONNECT_MODEL_NAME,
            })
          );
        };

        wsInstance.onmessage = (event) => {
          console.log("event", event);
          const message = event.data;
          if (message == "No Available Workers") {
            disconnectStt();
            return;
          }
          if (message.length < 30) return;
          const jsonData = JSON.parse(message);
          setText(jsonData["wordAlignment"].map((e) => e["word"]).join(" "));
          const isFinal = jsonData["final"];
          const _text = jsonData["transcript"];
          if (isFinal && _text.length > 2) {
            setText(_text);
            uploadAudioAndSend();
          }
        };

        wsInstance.onerror = (event) => {
          console.log("error", event);
        };
      };

      setupWebSocket(ws.current);
      await openMic();
      setUseVoice(true);
    } catch (e) {
      console.log("e", e);
    }
  };

  const disconnectStt = async () => {
    await closeMic();
    if (!ws?.current) return;
    console.info("WebSocket 끊김");
    if (ws.current.readyState === 1) {
      ws?.current?.send("EOS");
    }
    ws?.current?.close();
    setUseVoice(false);
  };

  const openMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioContext = new window.AudioContext({ sampleRate: sampleRate });
      scriptProcessorNode = audioContext.createScriptProcessor(
        bufferSize,
        numChannels,
        numChannels
      );
      source = audioContext.createMediaStreamSource(stream);
      source.connect(scriptProcessorNode);
      scriptProcessorNode.connect(audioContext.destination);
      scriptProcessorNode.addEventListener("audioprocess", async (event) => {
        var audioBuffer = event.inputBuffer;
        var channelData = audioBuffer.getChannelData(0);
        dataFromWs.current = [...dataFromWs.current, ...channelData];
        data.current = [...data.current, ...channelData];
        if (dataFromWs.current.length >= 2048) {
          const chunk = dataFromWs.current.slice(0, 2048);
          dataFromWs.current = [...dataFromWs.current.slice(2048)];
          // console.log("event", chunk.length);
          if (ws.current !== 0 && ws.current.readyState === 1) {
            var pcm = encPCM(chunk);
            ws.current.binaryType = "arraybuffer";
            await ws.current.send(pcm);
          }
        }
      });
      // setMicStream(stream);
      setIsMicOpen(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const closeMic = async () => {
    console.log("close mic");
    const _stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    _stream.getTracks().forEach(function (track) {
      console.log("stop..!");
      track.stop();
    });
    // micStream.getTracks().forEach(function (track) {
    //   console.log("stop..!");
    //   track.stop();
    // });
    setMicStream(null);
    if (source) {
      source.disconnect();
      source = null;
    }
    if (scriptProcessorNode) {
      // scriptProcessorNode.removeEventListener();
      scriptProcessorNode.disconnect();
      scriptProcessorNode = null;
    }
    if (audioContext) {
      await audioContext.close(); // 오디오 컨텍스트 종료
      audioContext = null;
    }
  };

  const f2PCM = (output, input) => {
    var endian = true;
    for (var i = 0, offset = 0; i < input.length; i++, offset += 2) {
      var v = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, v < 0 ? v * 0x8000 : v * 0x7fff, endian);
    }
  };

  const encPCM = (samples) => {
    var arrayBuff = new ArrayBuffer(samples.length * 2);
    var dataView = new DataView(arrayBuff);
    f2PCM(dataView, samples);
    return dataView;
  };

  const saveWavFile = () => {
    const wavData = encodeWAV(data.current);
    const blob = new Blob([wavData], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "audio.wav";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadWavFile = async () => {
    try {
      const wavData = encodeWAV(data.current);
      const blob = new Blob([wavData], { type: "audio/wav" });
      const formData = new FormData();
      formData.append("file", blob, "audio.wav");
      const res = await axiosInstance.post(
        "/guest/mimecon/upload_audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dataFromWs.current = [];
      data.current = [];
      setAudioFile(res);
    } catch (e) {
      console.log("e", e);
    }
  };

  const encodeWAV = (samples) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const floatTo16BitPCM = (output, offset, input) => {
      for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }
    };

    writeString(view, 0, "RIFF");
    view.setUint32(4, 32 + samples.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 44, samples);

    return view;
  };

  const uploadAudioAndSend = async () => {
    try {
      await uploadWavFile();
      await sendVoice();
    } catch (e) {
      console.log("error", e);
    }
  };

  const renderInput = () => {
    return useVoice ? (
      <div className="flex flex-row rounded-full p-2 bg-gradient-to-r from-[#03de9d] to-[#05dfc2] text-white">
        {voiceStatus === VOICE_STATUS.LISTENING ? (
          <div className="flex flex-row items-center justify-center pr-[12px]">
            <div className="">
              <Lottie loop animationData={ListenJson} play width={40} />
            </div>
            <div>듣고있어요</div>
          </div>
        ) : (
          <Lottie loop animationData={AskJson} play />
        )}
      </div>
    ) : (
      <div className="flex flex-row rounded-full items-center justify-between w-full p-[20px] bg-black/60">
        <input
          className="flex-1 w-full bg-transparent border-none focus:outline-none border-transparent focus:border-transparent focus:ring-0 text-white"
          placeholder="메세지 입력"
          onChange={onChange}
          value={inputText}
        />
        <div
          className="cursor-pointer"
          onClick={inputText ? sendText : connectStt}
        >
          {inputText ? <SendSvg /> : <MicSvg />}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-[100vh] bg-black">
      <div className="flex flex-row justify-between items-center px-[12px] py-[8px]">
        <Link
          href={getDownloadLink()}
          className="flex flex-row justify-center items-center gap-1"
        >
          <LogoSvg width={40} height={40} />
          <div className="font-bold text-[14px] text-[#03FFB0]">
            APP 다운로드
          </div>
        </Link>
        <div
          className="cursor-pointer px-[12px] py-[8px] rounded-full border border-white/80"
          onClick={() => {
            setIsEndModalOpen(true);
          }}
        >
          <div className="text-white/80">대화종료</div>
        </div>
      </div>
      <div className="relative flex flex-1 flex-col justify-between items-center w-full h-full pt-[8px]">
        {showToast && (
          <div className="absolute z-20 top-0 bottom-0 left-0 right-0 w-full h-full flex items-center justify-center text-white">
            <div className="flex flex-col justify-center items-center text-center gap-3 p-5 bg-[#222222] rounded-[12px] opacity-80">
              <InfoSvg />
              <div className="opacity-80 text-[14px]">
                미미와 나눈 모든 이야기는{"\n"}보낸 사람이 볼 수 있으니
                참고해주세요.
              </div>
            </div>
          </div>
        )}
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
                  onClick={uploadWavFile}
                >
                  <TimerSvg />
                  <div>{formatTime(time)}</div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-[12px] w-full gap-4">
                <div className="bg-black/60 text-white text-[18px] max-w-[400px] text-center text-wrap break-keep">
                  {text}
                </div>
                {renderInput()}
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
      <TalkCompleteModal
        isOpen={isEndModalOpen}
        setIsOpen={setIsEndModalOpen}
        onConfirm={() => {
          endChatroom(true);
        }}
      />
      <Modal
        isOpen={isAbsenceModalOpen}
        setIsOpen={setIsAbsenceModalOpen}
        title="앗! 어디 가셨었나요?"
        description="대답이 없으셔서 대화가 종료되었어요. 직접 미미콘을 만들어보는 건 어때요?"
      />
    </div>
  );
};

export default TalkPage;

"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import VideoPlayer from "@/src/component/videoPlayer";
import Modal from "@/src/component/modal/modal";
import axiosInstance from "@/api/axiosInstance";

import HeartSvg from "@/public/heart.svg";
import TalkSvg from "@/public/talk.svg";
import ShareSvg from "@/public/share.svg";
import AISvg from "@/public/summary_talk.svg";
import TalkFilledSvg from "@/public/talk_filled.svg";
import MuteSvg from "@/public/mute.svg";
import UnmuteSvg from "@/public/unmuted.svg";
import axios from "axios";
import { convertStringToNum } from "../../utils/math";
import InterActionModal from "../component/modal/interactionModal";
import Link from "next/link";

const DetailPage = () => {
  const [isPre, setIsPre] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isAppDownloadModalOpen, setIsAppDownloadModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isInterActionModalOpen, setIsInterActionModalOpen] = useState(true);
  const [now, setNow] = useState(0);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState(null);
  const [vtt, setVtt] = useState([]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isMimecon = searchParams.get("is-mimecon") === "true";
  const progressRef = useRef(0);

  useEffect(() => {
    console.log("isMimecon", isMimecon, id);
    if (!id) {
      setIsErrorModalOpen(true);
      return;
    }
    fetchDetail();
  }, []);

  useEffect(() => {
    fetchVtt();
  }, [data]);

  const checkValidation = () => {
    let _valid = true;
    if (!id) _valid = false;
    return _valid;
  };

  const fetchDetail = async () => {
    try {
      const _res = isMimecon
        ? await axiosInstance.post("/mimecon/" + id)
        : await axiosInstance.put("/mimecontalk/" + id);
      setData(_res);
    } catch (e) {
      console.log("e", e);
      setIsErrorModalOpen(true);
    }
  };

  const fetchVtt = async () => {
    try {
      if (!data || isMimecon) return;
      const _vttData = data?.title_url;
      const { data: _vttString } = await axios.get(_vttData);
      let _result = [];
      let _tmp = { startedAt: "", endedAt: "", content: "", isUser: false };
      _vttString
        .replace("WEBVTT", "")
        .split("\n")
        .filter((value) => {
          return !!value;
        })
        .map((item, index) => {
          if (index % 3 === 0) {
            _tmp = { startedAt: "", endedAt: "", content: "", isUser: false };
          }
          if (index % 3 === 1) {
            const _time = item.split(" --> ");
            _tmp.startedAt = _time[0];
            _tmp.endedAt = _time[1];
          }
          if (index % 3 === 2) {
            const _time = item.split(">");
            _tmp.content = _time[1];
            _tmp.isUser = _time[0].indexOf("user") > -1;
            _result.push(_tmp);
          }
        });
      setVtt(_result);
    } catch (e) {
      console.log("e", e);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const openAppDownloadModal = () => {
    setIsAppDownloadModalOpen(true);
  };

  const renderProfile = () => {
    return (
      <div className="flex flex-row items-center justify-start gap-2 py-2">
        {isMimecon ? (
          <div
            className="h-8 w-8 rounded-full bg-white"
            style={{
              backgroundImage: "url(" + data?.user?.profile_img_url + ")",
              backgroundSize: "cover",
            }}
          />
        ) : (
          <div className="flex flex-row">
            <div
              className="relative z-20 h-8 w-8 rounded-full bg-white mr-1"
              style={{
                backgroundImage:
                  "url(" + data?.mimecon?.user?.profile_img_url + ")",
                backgroundSize: "cover",
              }}
            />
            <div className="z-10 h-8 w-8 rounded-full bg-black ml-[-30px]" />
            <div
              className="h-8 w-8 rounded-full bg-white ml-[-12px]"
              style={{
                backgroundImage:
                  "url(" + data?.mimecon?.user?.profile_img_url + ")",
                backgroundSize: "cover",
              }}
            />
          </div>
        )}
        {isMimecon ? (
          <div className="text-white text-[12px] leading-[16px]">
            <span className="font-bold">{data?.user?.nick_name ?? "-"}</span>
            {"\n"}
            <span className="text-[11px]">원본미미콘</span>
          </div>
        ) : (
          <div className="text-white text-[12px] leading-[16px]">
            <span className="font-bold">{data?.mimecon?.user?.nick_name}</span>
            님의 미미콘과{"\n"}
            <span className="font-bold">{data?.nick_name}</span>님의 대화
          </div>
        )}
      </div>
    );
  };

  const renderHeart = () => {
    return (
      <div
        className="cursor-pointer flex flex-row items-center justify-center gap-1"
        onClick={openAppDownloadModal}
      >
        <HeartSvg />
        <div className="text-white font-bold text-[12px]">
          {isMimecon
            ? data?.mimecon_like_count
            : data?.mimecon?.mimecon_like_count ?? "-"}
        </div>
      </div>
    );
  };

  const renderTalk = () => {
    return (
      <div
        className="cursor-pointer flex flex-row items-center justify-center gap-1"
        onClick={openAppDownloadModal}
      >
        <TalkSvg />
        <div className="text-white font-bold text-[12px]">
          {isMimecon
            ? data?.mimecon_talk_count
            : data?.mimecon?.mimecon_like_count ?? "-"}
        </div>
      </div>
    );
  };

  const renderVtt = () => {
    if (!data) return;
    if (isMimecon) {
      return (
        <div className="flex flex-col justify-center items-start text-white font-bold text-[14px] tracking-tight w-full">
          <div className="flex flex-row gap-2">
            <div
              className="h-5 w-5 rounded-full bg-white"
              style={{
                backgroundImage: "url(" + data?.mime?.img_url + ")",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="text-wrap break-keep">{data?.title}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-start items-start text-white max-h-[140px] gap-1 tracking-tight overflow-y-scroll scrollbar-hide">
        {vtt.map((_value, _idx) => {
          const isNow =
            now > convertStringToNum(_value.startedAt) &&
            now < convertStringToNum(_value.endedAt);
          return (
            <div
              key={_idx + "vtt"}
              className="flex flex-row gap-2 items-center"
            >
              {_value.isUser ? (
                <div
                  className="h-5 w-5 rounded-full bg-white"
                  style={{
                    backgroundImage: "url(" + data?.profile_img_url + ")",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : (
                <div
                  className="h-5 w-5 rounded-full bg-white"
                  style={{
                    backgroundImage:
                      "url(" + data?.mimecon?.mime?.img_url + ")",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
              <div className={isNow ? "font-bold" : "opacity-60"}>
                {_value.content}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // if (isPre) {
  //   return (
  //     <div
  //       className="text-red cursor-pointer"
  //       onClick={() => {
  //         setIsPre(false);
  //       }}
  //     >
  //       {">>"} Click Here to see the detail! {"<<"}
  //     </div>
  //   );
  // }

  return (
    <div className="relative flex flex-1 flex-col h-svh">
      <div className="bg-black w-full h-full">
        {!isPre && data && (
          <VideoPlayer
            src={isMimecon ? data?.intro_url : data?.contents_url ?? ""}
            progressRef={progressRef}
            type="m3u8"
            loop
            setProgress={setProgress}
            setNow={setNow}
            muted={isMuted}
          />
        )}
      </div>
      <div className="absolute bg-gradient-to-b from-[#00000000] via-[#0000004d] to-[#0000002e] flex flex-col items-center justify-between w-full h-full">
        <div className="flex flex-row w-full items-center justify-between px-[12px] py-[8px] bg-black/70">
          {renderProfile()}
          <div className="cursor-pointer" onClick={openAppDownloadModal}>
            <div className="border rounded-full px-[12px] py-[8px] text-white border-white text-[13px] opacity-80">
              앱 열기
            </div>
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
            {renderVtt()}
            <div className="flex flex-row items-center justify-center gap-2 pt-2">
              <div
                className="flex flex-row gap-2 items-center jusitfy-center py-2 px-3 rounded-full cursor-pointer border border-[#00E09B] bg-[#00E09B]"
                onClick={openAppDownloadModal}
              >
                <AISvg />
                <div className="text-[14px] font-semibold">대화요약</div>
              </div>
              <Link
                href={
                  isMimecon
                    ? "talk?mimecon_id=" + id
                    : "talk?mimecon_id=" + data?.mimecon?.id
                }
                className="flex flex-row gap-2 items-center jusitfy-center py-2 px-3 rounded-full cursor-pointer border border-[#00E09B] bg-black/20"
                // onClick={openAppDownloadModal}
              >
                <TalkFilledSvg />
                <div className="text-[#00E09B] text-[14px] font-semibold">
                  나도 대화해볼래
                </div>
              </Link>
            </div>
          </div>
          <div className="h-[1px] w-full bg-[#8a8a8a]">
            <div
              className="h-[1px] bg-[#00E09B]"
              style={{ width: progress.toFixed(2).toString() + "%" }}
            />
          </div>
          <div className="flex flex-row pt-4 pb-6 px-3 justify-between items-center w-full backdrop-blur-2xl">
            <div className="flex flex-row gap-5">
              {renderHeart()}
              {renderTalk()}
            </div>
            <div className="cursor-pointer" onClick={openAppDownloadModal}>
              <ShareSvg />
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isAppDownloadModalOpen}
        setIsOpen={setIsAppDownloadModalOpen}
        title="앗! 앱 실행 또는 다운로드해주세요."
        description="앱을 사용하여 더 다양하게 즐겨보세요!"
      />
      <Modal
        isOpen={isErrorModalOpen}
        setIsOpen={setIsErrorModalOpen}
        title="확인할 수 없는 미미콘이에요 😢"
        description="이럴게 아니라 직접 미미콘을 만들어보는건 어때요?"
        cancelText="확인"
        confirmText="만들러가기"
      />
      <InterActionModal
        isOpen={isInterActionModalOpen}
        setIsOpen={setIsInterActionModalOpen}
        onConfirm={() => setIsPre(false)}
      />
    </div>
  );
};

export default DetailPage;

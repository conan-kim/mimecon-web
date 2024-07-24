"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const TalkVideoPlayer = ({
  src,
  idleUrl,
  index,
  setIndex,
  type,
  loop,
  stop,
  onVideoPlay,
  onVideoEnded,
  ...rest
}) => {
  const videoRef = useRef();

  useEffect(() => {
    if (type === "m3u8" && Hls.isSupported()) {
      // if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      //   // This will run in safari, where HLS is supported natively
      //   videoRef.current.src = src;
      //   return
      // } else if (type === "m3u8" && Hls.isSupported()) {
      //   const hls = new Hls();
      //   hls.loadSource(src);
      //   hls.attachMedia(videoRef.current);
      // }
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        videoRef.current.removeEventListener("ended", _onVideoEnded);
        videoRef.current.pause();
      } else {
        videoRef.current.addEventListener("ended", _onVideoEnded);
        videoRef.current.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    videoRef.current.addEventListener("play", _onVideoPlay);
    return () => {
      videoRef.current.removeEventListener("play", _onVideoPlay);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [src]);

  useEffect(() => {
    videoRef.current.addEventListener("ended", _onVideoEnded);
    return () => {
      videoRef.current.removeEventListener("ended", _onVideoEnded);
    };
  }, [stop]);

  const _onVideoPlay = () => {
    if (onVideoPlay) {
      onVideoPlay();
    }
  };

  const _onVideoEnded = (event) => {
    if (stop) return;
    console.log(111111, stop);
    // console.log(src, type, "hi");
    setTimeout(() => {
      try {
        onVideoEnded();
        videoRef.current.play();
      } catch (e) {
        console.log("e", e);
      }
    }, 500);
  };

  return (
    <div className="flex flex-1 w-full h-full justify-center items-center">
      <video
        ref={videoRef}
        className="h-full"
        autoPlay
        playsInline
        preload="auto"
        {...rest}
      />
    </div>
  );
};

export default TalkVideoPlayer;

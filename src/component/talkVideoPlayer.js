"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const TalkVideoPlayer = ({
  src,
  poster,
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
    console.log("=====HELLO ===", type, Hls.isSupported(), videoRef.current.canPlayType("application/vnd.apple.mpegurl"))
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
      videoRef.current.autoplay = true;
      videoRef.current.play();
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
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
      videoRef.current?.removeEventListener("play", _onVideoPlay);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [src]);

  useEffect(() => {
    videoRef.current.addEventListener("ended", _onVideoEnded);
    return () => {
      videoRef.current?.removeEventListener("ended", _onVideoEnded);
    };
  }, [stop]);

  const _onVideoPlay = () => {
    if (onVideoPlay) {
      onVideoPlay();
    }
  };

  const _onVideoEnded = (event) => {
    if (stop) return;

    try {
      onVideoEnded();
      videoRef.current.play();
    } catch (e) {
      console.log("e", e);
    }
  };

  return (
    <video
      ref={videoRef}
      poster={poster}
      className="w-full h-auto"
      autoPlay
      playsInline
      preload="auto"
      {...rest}
    />
  );
};

export default TalkVideoPlayer;

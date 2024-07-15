"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src, index, setIndex, videoUrls, isAutoPlay, type }) => {
  const videoRef = useRef();

  useEffect(() => {
    console.log(
      "----- LOADED and his is supported?",
      src,
      type,
      type === "m3u8",
      Hls.isSupported(),
      videoRef.current.canPlayType("application/vnd.apple.mpegurl")
    );
    if (type === "m3u8" && Hls.isSupported()) {
      // if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      //   // This will run in safari, where HLS is supported natively
      //   videoRef.curret.src = src;
      // } else if (type === "m3u8" && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
    }

    videoRef.current.addEventListener("ended", (event) => {
      if (!isAutoPlay) return;
      setIndex(index + 1 === videoUrls.length ? 0 : index + 1);
    });
  }, [src, type]);

  return <video ref={videoRef} width={400} height={400} controls autoPlay />;
};

export default VideoPlayer;

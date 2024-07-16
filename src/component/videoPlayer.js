"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({
  src,
  progressRef,
  index,
  setIndex,
  videoUrls,
  isAutoPlay,
  setProgress,
  setNow,
  type,
  loop,
  ...rest
}) => {
  const videoRef = useRef();
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    if (type === "m3u8" && Hls.isSupported()) {
      // if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      //   // This will run in safari, where HLS is supported natively
      //   videoRef.current.src = src;
      // } else if (type === "m3u8" && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
    }

    // looping
    videoRef.current.addEventListener("ended", (event) => {
      if (!loop) return;
      setTimeout(() => {
        try {
          videoRef.current.play();
        } catch (e) {
          console.log("e", e);
        }
      }, 500);
    });

    videoRef.current.addEventListener("timeupdate", (event) => {
      if (!videoRef?.current?.duration) {
        setProgress(0);
        return;
      }
      setNow(videoRef?.current?.currentTime);
      setProgress(
        (videoRef?.current?.currentTime / videoRef?.current?.duration) * 100
      );
    });
  }, [src, type]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full"
      controls
      autoPlay
      // muted
      playsInline
      preload="auto"
      {...rest}
    />
  );
};

export default VideoPlayer;

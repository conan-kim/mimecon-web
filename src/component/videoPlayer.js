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

    videoRef.current.addEventListener("ended", (event) => {
      if (!loop) return;
      setTimeout(() => {
        try {
          console.log("hlelo");
          videoRef.current.play();
          // setPlayCount((prev) => {
          //   return prev + 1;
          // });
        } catch (e) {
          console.log("e", e);
        }
      }, 500);
    });

    videoRef.current.addEventListener("timeupdate", (event) => {
      console.log(
        "video",
        videoRef?.current?.currentTime,
        videoRef?.current?.duration
      );
      if (!videoRef?.current?.duration) {
        // progressRef.current = 0;
        setProgress(0);
        return;
      }
      setProgress(
        (videoRef?.current?.currentTime / videoRef?.current?.duration) * 100
      );
      // progressRef.current =
      //   (videoRef.current.currentTime / videoRef.current.duration) * 100;
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

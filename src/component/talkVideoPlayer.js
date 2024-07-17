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
  onVideoEnded,
  ...rest
}) => {
  const videoRef = useRef();

  useEffect(() => {
    if (type === "m3u8" && Hls.isSupported()) {
      if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // This will run in safari, where HLS is supported natively
        videoRef.current.src = src;
      } else if (type === "m3u8" && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
      }
    }

    // looping
    videoRef.current.addEventListener("ended", (event) => {
      // console.log(src, type, "hi");
      setTimeout(() => {
        try {
          onVideoEnded();
          videoRef.current.play();
        } catch (e) {
          console.log("e", e);
        }
      }, 500);
    });
  }, [src]);

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

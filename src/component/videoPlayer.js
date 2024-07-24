"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({
  src,
  progressRef,
  index,
  setIndex,
  videoUrls,
  setProgress,
  setNow,
  type,
  loop,
  ...rest
}) => {
  const videoRef = useRef();

  useEffect(() => {
    if (type === "m3u8" && Hls.isSupported()) {
      // if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      //   // This will run in safari, where HLS is supported natively
      //   videoRef.current.src = src;
      // } else if (type === "m3u8" && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        videoRef.current.removeEventListener("ended", onVideoEnded);
        videoRef.current.pause();
      } else {
        videoRef.current.addEventListener("ended", onVideoEnded);
        videoRef.current.play();
      }
    };

    const onVideoEnded = (event) => {
      if (!loop) return;
      setTimeout(() => {
        try {
          videoRef.current.play();
        } catch (e) {
          console.log("e", e);
        }
      }, 500);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // looping
    videoRef.current.addEventListener("ended", onVideoEnded);

    videoRef.current.addEventListener("timeupdate", (event) => {
      if (!setProgress) return;
      if (!videoRef?.current?.duration) {
        setProgress(0);
        return;
      }
      setNow(videoRef?.current?.currentTime);
      setProgress(
        (videoRef?.current?.currentTime / videoRef?.current?.duration) * 100
      );
    });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [src, type]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full"
      autoPlay
      playsInline
      preload="auto"
      {...rest}
    />
  );
};

export default VideoPlayer;

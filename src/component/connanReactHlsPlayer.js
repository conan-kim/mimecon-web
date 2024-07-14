"use client";

import React, { useEffect, useRef } from "react";
import ReactHlsPlayer from "react-hls-player";

const ConanReactHlsPlayer = ({ src }) => {
  const videoRef = useRef();
  useEffect(() => {
    videoRef.current?.play();
  }, []);

  return (
    <ReactHlsPlayer ref={videoRef} src={src} width={400} autoPlay controls />
  );
};

export default ConanReactHlsPlayer;

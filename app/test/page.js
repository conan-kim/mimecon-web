"use client";
import { useState } from "react";
import VideoPlayer from "../../src/component/videoPlayer";
import ConanReactHlsPlayer from "../../src/component/connanReactHlsPlayer";
import ConanReactPlayer from "../../src/component/conanReactPlayer";

const Page = () => {
  const [index, setIndex] = useState(0);
  const videoUrls = [
    {
      name: "introUrl",
      url: "https://cdn-unifier.lucasai.io/mss/dev/mimecon/66754f293854fb06ac228fd6/669374424e2c0959eb4ff58e/8ef6cf10-cd6a-4c79-b8e4-2084e1f46c54/index.m3u8",
    },
    {
      name: "idelUrl",
      url: "https://cdn-unifier.lucasai.io/mss/dev/mimecon/66754f293854fb06ac228fd6/60dce55c-641e-42a9-aa0a-305a5723a1b4/4c81652b-a204-456d-86f1-e5685ab92080/index.m3u8",
    },
    {
      name: "talkUrl",
      url: "https://cdn-unifier.lucasai.io/mss/dev/mimecon/669341124e2c0959eb4ff568/669341164e2c0959eb4ff56a/record/index.m3u8",
    },
    {
      name: "replyContentUrl",
      url: "https://cdn-unifier.lucasai.io/mss/dev/mimecon/669383bb4e2c0959eb4ff5b2/669383bf4e2c0959eb4ff5b4/11e57118-f137-4e91-940f-0515c3ab0569/index.m3u8",
    },
    {
      name: "replyLiveUrl",
      url: "https://mss-dev.lucasai.io/mss/mimecon/669383bb4e2c0959eb4ff5b2/669383bf4e2c0959eb4ff5b4/11e57118-f137-4e91-940f-0515c3ab0569/index.m3u8",
    },
    {
      name: "testUrl",
      url: "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
    },
    {
      name: "tear of steel",
      url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
    },
    {
      name: "fMP4 m3u8",
      url: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    },
    {
      name: "MP4 m3u8",
      url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8",
    },
    {
      name: "Live Akami m3u8",
      url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    },
  ];

  return (
    <div className="bg-transparent break-keep whitespace-pre max-w-screen-xl m-auto bg-blue-400 flex flex-1 min-h-screen flex-col">
      <div className={`bg-green-400 flex-row`}>
        {videoUrls.map((_video, _idx) => {
          const isSelected = index === _idx;
          return (
            <div
              key={`${_idx}${_video.url}`}
              className={`${isSelected ? "bg-yellow-400" : "bg-red-400"} p-2`}
              onClick={() => {
                console.log("hello");
                setIndex(_idx);
              }}
            >
              {_idx} / {videoUrls[_idx].name} ({videoUrls[_idx].url})
            </div>
          );
        })}
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 flex-col gap-2 p-[16px]">
          <div className="font-bold">HLS.js</div>
          <VideoPlayer src={videoUrls[index].url} type="m3u8" />
        </div>
        {/* <div className="flex flex-1 flex-col gap-2 p-[16px]">
          <div className="font-bold">react-hls-player</div>
          <ConanReactHlsPlayer src={videoUrls[index].url} />
        </div> */}
        <div className="flex flex-1 flex-col gap-2 p-[16px]">
          <div className="font-bold">react-player</div>
          <ConanReactPlayer src={videoUrls[index].url} />
        </div>
      </div>
    </div>
  );
};

export default Page;

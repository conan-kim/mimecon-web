"use client";
import { useState } from "react";
import VideoPlayer from "../../src/component/videoPlayer";

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
      url: "https://weloop.s3.amazonaws.com/user_1720520124230-5a46677d-9460-4400-b473-565ed0233e6d/1720520339040549/1720520339040549.m3u8",
    },
    {
      name: "testUrl2",
      url: "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
    },
  ];

  return (
    <div className="bg-transparent break-keep whitespace-pre max-w-screen-xl m-auto bg-blue-400 flex flex-1 min-h-screen flex-col">
      <div className={`bg-green-400 flex-row`}>
        {videoUrls.map((_video, _idx) => {
          const isSelected = index === _idx;
          return (
            <div
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
      <VideoPlayer src={videoUrls[index].url} type="m3u8" />
    </div>
  );
};

export default Page;

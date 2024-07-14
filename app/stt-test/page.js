"use client";

import { useEffect, useRef, useState } from "react";

const Page = () => {
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [micStream, setMicStream] = useState(null);

  const dataFromWs = useRef([]);
  const data = useRef([]);
  const ws = useRef();

  // 오디오 버퍼
  const bufferSize = 256; // buffer size(512). multiply by two in encPCM function
  const numChannels = 1; // channel count(only one channel)
  const sampleRate = 16000; // samplerate

  let audioContext;
  let scriptProcessorNode;
  let source;

  useEffect(() => {
    const _ws = new WebSocket("wss://mss-dev.lucasai.io:9011/client/ws");
    ws.current = _ws;

    const setupWebSocket = (wsInstance) => {
      wsInstance.onopen = () => {
        console.log("onOpen");
        wsInstance.send(
          JSON.stringify({
            app_id: "mimecon",
            synapses_id: "66665454f59b9827a82ed8ac4",
            owner: "mimecon@lucasai.co",
            model_name: "mimecon-stt-master-16k",
          })
        );
      };

      wsInstance.onmessage = (event) => {
        console.log("event", event);
        if (event?.data) {
          dataFromWs.current = [...dataFromWs.current, event?.data];
        }
      };

      wsInstance.onerror = (event) => {
        console.log("error", event);
      };
    };

    setupWebSocket(ws.current);

    return () => {
      if (ws?.current) {
        console.info("WebSocket 끊김");
        if (ws.current.readyState === 1) {
          ws?.current?.send("EOS");
        }
        ws?.current?.close();
      }
    };
  }, []);

  const toggleMic = async () => {
    if (isMicOpen) {
      //   if (micStream) {
      //     micStream.getTracks().forEach((track) => track.stop());
      //     setMicStream(null);
      //   }
      if (audioContext) {
        source.disconnect();
        scriptProcessorNode.disconnect();
        await audioContext.close(); // 오디오 컨텍스트 종료
        audioContext = null;
        scriptProcessorNode = null;
        source = null;
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new window.AudioContext({ sampleRate: sampleRate });
        scriptProcessorNode = audioContext.createScriptProcessor(
          bufferSize,
          numChannels,
          numChannels
        );
        source = audioContext.createMediaStreamSource(stream);
        source.connect(scriptProcessorNode);
        scriptProcessorNode.connect(audioContext.destination);
        scriptProcessorNode.addEventListener("audioprocess", async (event) => {
          var audioBuffer = event.inputBuffer;
          var channelData = audioBuffer.getChannelData(0);
          console.log("event", channelData.length);
          data.current = [...data.current, channelData.byteLength];

          if (ws.current !== 0 && ws.current.readyState === 1) {
            // var pcm = encPCM(channelData);
            // ws.current.binaryType = "arraybuffer";
            // await ws.current.send(pcm);
          }
        });
        setMicStream(stream);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }
    setIsMicOpen(!isMicOpen);
  };

  return (
    <div className="bg-transparent break-keep whitespace-pre max-w-screen-xl m-auto flex flex-1 min-h-screen flex-col p-4">
      <div className="font-bold text-[20px] py-[20px]">
        STT PAGE for wss://mss-dev.lucasai.io:9011/client/ws
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-row gap-2 justify-start items-center">
          <div>마이크 {isMicOpen ? "ON" : "OFF"}</div>
          <div
            className="border p-1 cursor-pointer bg-grey-200"
            onClick={toggleMic}
          >
            Mic Btn
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>WS DATA</div>
          {dataFromWs.current.map((_msg) => {
            return <div key={_msg}>{_msg}</div>;
          })}
        </div>
        <div>MIC DATA: {data.current.length}</div>
      </div>
    </div>
  );
};

export default Page;

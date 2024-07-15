import LogoSvg from "@/public/logo.svg";
import DownloadSvg from "@/public/download.svg";
import Image from "next/image";

const Page = () => {
  return (
    <div className="relative flex flex-1 flex-col max-w-screen-sm m-auto">
      <div className="flex flex-col h-[100vh] bg-black items-center justify-start">
        <div className="w-full aspect-square">
          <Image
            src={"/download-bg.png"}
            fill
            alt="Picture of the mimecon"
            style={{ objectFit: "contain", objectPosition: "top" }}
          />
        </div>
      </div>
      <div className="absolute flex flex-col bottom-0 left-0 right-0 items-center justify-center pb-[24px] gap-12">
        <div className="flex flex-col gap-0 items-center">
          <LogoSvg />
          <div className="flex flex-col text-white text-[40px] text-center leading-[40px]">
            <span className="font-thin">새로운 커뮤니케이션</span>
            <span className="font-bold">같이 미미콘 할래?</span>
          </div>
        </div>
        <a
          href="https://www.daum.net"
          target="_blank"
          className="flex flex-col flex-1 w-full items-center gap-4"
        >
          <div className="text-[#00E09B] text-[20px] font-bold">
            지금 바로 다운로드 하세요!
          </div>
          <div className="flex flex-col flex-1 w-full">
            <div className="flex flex-row cursor-pointer justify-center items-center mx-[20px] py-[10px] rounded-[16px] bg-gradient-to-r from-[#00FF94] to-[#00E5CA]">
              <div className="font-bold text-[16px]">미미콘 앱 다운로드</div>
              <DownloadSvg />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Page;

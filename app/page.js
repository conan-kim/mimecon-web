import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <div className="bg-transparent break-keep whitespace-pre bg-red-400 flex flex-1 min-h- flex flex-col">
      <div className="font-bold text-[20px] py-[20px]">
        미미콘 웹 테스트 페이지
      </div>
      <div className="flex flex-col gap-4 pt-4">
        <Link href="video-test" className="cursor-pointer">
          비디오 테스트하러 가기
        </Link>
        <Link href="stt-test" className="cursor-pointer">
          STT 테스트하러 가기
        </Link>
        <Link href="download" className="cursor-pointer">
          다운로드 페이지
        </Link>
      </div>
    </div>
  );
};

export default Page;

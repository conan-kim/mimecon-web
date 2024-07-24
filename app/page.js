import Link from "next/link";
import { Suspense } from "react";
import DownloadPage from "../src/page/downloadPage";

const Page = () => {
  return (
    <Suspense>
      <DownloadPage />
    </Suspense>
  );
  // return (
  //   <div className="bg-transparent break-keep whitespace-pre bg-red-400 flex flex-1 min-h- flex flex-col p-4">
  //     <div className="font-bold text-[20px] py-[20px]">
  //       미미콘 웹 테스트 페이지
  //     </div>
  //     <div className="flex flex-col gap-4 pt-4">
  //       <Link href="video-test" className="cursor-pointer">
  //         비디오 테스트하러 가기
  //       </Link>
  //       <Link href="stt-test" className="cursor-pointer">
  //         STT 테스트하러 가기
  //       </Link>
  //       <Link href="download" className="cursor-pointer">
  //         다운로드 페이지
  //       </Link>
  //       <Link
  //         href="detail?id=669603135c7c034c8416727d&is-mimecon=true"
  //         className="cursor-pointer"
  //       >
  //         2-Depth 페이지 (미미콘)
  //       </Link>
  //       <Link
  //         href="detail?id=6695ca4b5c7c034c84167194&is-mimecon=false"
  //         className="cursor-pointer"
  //       >
  //         2-Depth 페이지 (미미톡)
  //       </Link>
  //       <Link
  //         href="talk?mimecon_id=669e9dd76166ee3bb1ea53b1"
  //         className="cursor-pointer"
  //       >
  //         대화하기 페이지
  //       </Link>
  //     </div>
  //   </div>
  // );
};

export default Page;

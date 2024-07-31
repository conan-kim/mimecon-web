import { Suspense } from "react";
import TalkPage from "@/src/page/talkPage";
import axiosInstance from "../../api/axiosInstance";

export async function generateMetadata({ params, searchParams }, parent) {
  // read route params
  const id = searchParams["mimecon_id"];
  // fetch data
  const data = await axiosInstance.post("/mimecon/" + id);

  return {
    title: "미미콘",
    description: "여기를 눌러 미미콘을 즐겨보세요!",
    openGraph: {
      title: "미미콘",
      description: "여기를 눌러 미미콘을 즐겨보세요!",
      images: [data?.mime?.og_img_url],
    },
  };
}

const Page = () => {
  return (
    <Suspense>
      <TalkPage />
    </Suspense>
  );
};

export default Page;

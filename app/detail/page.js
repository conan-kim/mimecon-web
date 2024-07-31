import { Suspense } from "react";
import DetailPage from "../../src/page/detailPage";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

export async function generateMetadata({ params, searchParams }, parent) {
  // read route params
  const isMimecon = searchParams["is-mimecon"] === "true";
  const id = searchParams.id;
  // fetch data
  const data = isMimecon
    ? await axiosInstance.post("/mimecon/" + id)
    : await axiosInstance.put("/mimecontalk/" + id);

  return {
    title: "미미콘",
    description: "여기를 눌러 미미콘을 즐겨보세요!",
    openGraph: {
      title: "미미콘",
      description: "여기를 눌러 미미콘을 즐겨보세요!",
      type: "article",
      image: isMimecon
        ? data?.mime?.og_img_url
        : data?.mimecon?.mime?.og_img_url,
      images: [
        isMimecon ? data?.mime?.og_img_url : data?.mimecon?.mime?.og_img_url,
      ],
    },
  };
}

const Page = () => {
  return (
    <Suspense>
      <DetailPage />
    </Suspense>
  );
};

export default Page;

import { Suspense } from "react";
import DownloadPage from "../../src/page/downloadPage";

export const metadata = {
  title: "미미콘",
  description: "여기를 눌러 미미콘을 즐겨보세요!",
};

const Page = () => {
  return (
    <Suspense>
      <DownloadPage />
    </Suspense>
  );
};

export default Page;

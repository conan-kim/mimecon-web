import { Suspense } from "react";
import DetailPage from "../../src/page/detailPage";

const Page = () => {
  return (
    <Suspense>
      <DetailPage />
    </Suspense>
  );
};

export default Page;

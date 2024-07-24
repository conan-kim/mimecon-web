"use client";
import { Suspense } from "react";
import DownloadPage from "../../src/page/downloadPage";

const Page = () => {
  return (
    <Suspense>
      <DownloadPage />
    </Suspense>
  );
};

export default Page;

import { Suspense } from "react";
import TalkPage from "@/src/page/talkPage";

const Page = () => {
  return (
    <Suspense>
      <TalkPage />
    </Suspense>
  );
};

export default Page;

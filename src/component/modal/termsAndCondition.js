"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import axiosInstance from "../../../api/axiosInstance";
import CloseSvg from "@/public/close.svg";

const TermsAndCondition = ({ isOpen, setIsOpen, onCompleted }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { termsEntities } = await axiosInstance.get(
        "/terms_privacy?lang=KR"
      );
      setData(termsEntities[0]);
    } catch (e) {
      console.log("error", e);
    }
  };
  if (!isOpen) return;

  return createPortal(
    <div className="absolute z-40 top-0 min-h-[100vh] bottom-0 left-0 right-0 flex flex-1 flex-col items-center justify-center bg-black/20">
      <motion.div
        className="relative max-w-screen-md w-full h-full m-auto bg-white flex flex-col"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div
          className="absolute top-2 left-2 cursor-pointer"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <CloseSvg />
        </div>
        <div className="w-full flex flex-col items-center justify-center text-[#222222] font-bold p-4">
          {data?.termsTitle ?? "-"}
        </div>
        <div
          className="px-5 py-4 text-ellipsis w-full text-pretty overflow-y-scroll scrollbar-hide"
          dangerouslySetInnerHTML={{ __html: data?.termsTxt ?? "-" }}
        />
      </motion.div>
    </div>,
    document.getElementById("tnc")
  );
};
export default TermsAndCondition;

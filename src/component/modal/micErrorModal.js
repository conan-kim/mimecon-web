"use client";
import { createPortal } from "react-dom";

const Modal = ({
    isOpen,
    setIsOpen,
    title,
    description,
    cancelText,
    confirmText,
    onCancel,
    onConfirm,
}) => {
    if (!isOpen) return;
    if (typeof window === "undefined") return null;
    return createPortal(
        <div
            className="z-50 absolute top-0 bottom-0 left-0 right-0 flex flex-1 flex-col items-center justify-center bg-black/20 break-keep"
            onClick={() => {
                setIsOpen(false);
            }}
        >
            <div className="flex flex-col py-8 px-5 gap-8 bg-white rounded-[24px] max-w-[335px]">
                <div className="flex flex-col gap-3">
                    <div className="text-[#222222] font-bold text-[18px]">{title}</div>
                    <div className="text-[16px] leading-[24px] text-[#444444] text-wrap whitespace-pre">
                        <div className="mb-4">
                            iOS 사용자의 경우:
                            <ol className="list-decimal pl-5 mt-2">
                                <li>iOS 설정 앱을 열어주세요</li>
                                <li>Chrome 앱을 찾아 선택해주세요</li>
                                <li>마이크 권한을 허용으로 변경해주세요</li>
                            </ol>
                        </div>
                        <div>
                            다른 기기 사용자의 경우:
                            <ol className="list-decimal pl-5 mt-2">
                                <li>브라우저 설정에서 마이크 권한을 확인해주세요</li>
                                <li>페이지를 새로고침한 후 다시 시도해주세요</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <div
                        className="flex flex-col cursor-pointer rounded-full w-full py-[14px] items-center justify-center text-[16px] text-white font-bold bg-[#00E09B]"
                        onClick={() => {
                            if (onCancel) {
                                onCancel();
                            }
                            setIsOpen((prev) => !prev);
                        }}
                    >
                        {cancelText ?? "취소"}
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")
    );
};

export default Modal;

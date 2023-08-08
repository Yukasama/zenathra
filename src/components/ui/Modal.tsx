"use client";

import { useEffect } from "react";
import { X } from "react-feather";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function Modal({
  children,
  isOpen,
  onClose,
  title,
}: ModalProps) {
  useEffect(() => {
    const handleEscapePress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscapePress);
    return () => document.removeEventListener("keydown", handleEscapePress);
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("click", handleHide);
    return () => document.removeEventListener("click", handleHide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleHide(e: any) {
    if (e.target.closest(".hiding-wall") && !e.target.closest(".input-window"))
      onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="f-box top-0 left-0 fixed z-[5] h-full w-full bg-gray-400/60 dark:bg-moon-400/80 hiding-wall">
      <div
        onClick={(e) => e.stopPropagation()}
        className="input-window relative mb-12 f-col w-[400px] gap-7 wrapper-bright p-7">
        <h2 className="text-[17px] font-medium mb-2">{title}</h2>
        <div className="w-full line-bright absolute top-[72px] left-0"></div>
        <div className="f-col py-2 gap-7">{children}</div>
        <button
          onClick={() => onClose()}
          className="absolute right-7 top-[29px]">
          <X />
        </button>
      </div>
    </div>
  );
}

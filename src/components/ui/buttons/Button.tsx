"use client";

import { ClipLoader } from "react-spinners";

interface Props {
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: any;
  outline?: boolean;
  color?: "blue" | "red" | "green";
  icon?: any;
}

export default function Button({
  disabled = false,
  loading = false,
  label = "",
  className,
  onClick = () => {},
  outline = false,
  color = "blue",
  icon,
}: Props) {
  return (
    <button
      onClick={onClick ?? null}
      className={`flex-box ${
        icon && label ? "h-[45px] px-3 pr-4" : "h-[30px] px-2"
      } group rounded-md duration-300 ${
        outline
          ? `border ${
              color === "blue"
                ? "border-blue-500 text-blue-500 hover:bg-blue-500"
                : color === "red"
                ? "border-red-500 text-red-500 hover:bg-red-500"
                : "border-green-500 text-green-500 hover:bg-green-500"
            } hover:text-white`
          : `${
              color === "blue"
                ? "bg-blue-500 hover:bg-blue-600"
                : color === "red"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white`
      } ${className}`}
      disabled={disabled}>
      {loading ? (
        <ClipLoader color="#fff" size={20} />
      ) : (
        <div className={`flex-box ${icon && label && "gap-1.5"}`}>
          <div className={`group-hover:text-white ${!icon && "hidden"}`}>
            {icon}
          </div>
          <p
            className={`text-[14px] font-medium tracking-[0.1] group-hover:text-white ${
              outline
                ? `${
                    color === "blue"
                      ? "text-blue-500"
                      : color === "red"
                      ? "text-red-500"
                      : "text-green-500"
                  } hover:text-white`
                : `text-white`
            }`}>
            {label}
          </p>
        </div>
      )}
    </button>
  );
}

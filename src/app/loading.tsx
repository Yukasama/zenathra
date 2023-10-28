import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="f-box">
      <Loader className="text-zinc-500 mt-[400px] h-6 animate-spinner-linear-spin duration-1000" />
    </div>
  );
}

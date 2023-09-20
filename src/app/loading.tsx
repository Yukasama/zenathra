import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="f-box h-full w-full absolute z-20 mb-10">
      <Loader className="text-slate-500 h-6 animate-spinner-linear-spin duration-1000" />
    </div>
  );
}

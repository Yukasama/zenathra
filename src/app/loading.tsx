import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="f-box mt-[380px]">
      <Loader className="text-slate-500 h-6 animate-spinner-linear-spin" />
    </div>
  );
}

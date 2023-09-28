import { Loader } from "lucide-react";

export default function page() {
  return (
    <div className="mt-[400px] h-full w-full f-box">
      <Loader className="text-slate-500 h-6 animate-spinner-linear-spin duration-1000" />
    </div>
  );
}

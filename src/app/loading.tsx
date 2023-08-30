import { ScaleLoader } from "react-spinners";

export default function loading() {
  return (
    <div className="f-box mt-80">
      <ScaleLoader className="flex align-middle" color="#0099ff" />
    </div>
  );
}

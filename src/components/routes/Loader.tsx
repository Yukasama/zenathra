import { BarLoader } from "react-spinners";

interface Props {
  className?: string;
  size?: number;
}

export default function Loader({ className, size }: Props) {
  return (
    <div className={`flex-box translate-y-96 ${className}`}>
      <BarLoader height={size} width={size} color="#0099ff" />
    </div>
  );
}

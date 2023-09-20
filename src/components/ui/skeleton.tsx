import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoaded?: boolean;
  children: React.ReactNode;
}

export default function Skeleton({
  isLoaded,
  children,
  className,
  ...props
}: Props) {
  return (
    <div className="relative">
      {!isLoaded && (
        <div className="animate-pulse-right absolute inset-0 rounded-md"></div>
      )}
      <div className={cn(`${!isLoaded && "invisible"}`, className)} {...props}>
        {children}
      </div>
    </div>
  );
}

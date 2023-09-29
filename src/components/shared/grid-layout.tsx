import { cn } from "@/lib/utils";
import { FullProps } from "@/types/layout";

export default function GridLayout({
  children,
  className,
  ...props
}: FullProps) {
  return (
    <div
      className={cn(
        "f-col gap-6 md:grid md:grid-cols-2 xl:gap-8 xl:grid-cols-3",
        className
      )}
      {...props}>
      {children}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function GridLayout({ children, className, ...props }: Props) {
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

import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function PageLayout({ children, className, ...props }: Props) {
  return (
    <div className={cn("p-4 md:p-7", className)} {...props}>
      {children}
    </div>
  );
}

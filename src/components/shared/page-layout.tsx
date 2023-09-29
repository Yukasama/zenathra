import { cn } from "@/lib/utils";
import { CardDescription, CardTitle } from "../ui/card";
import { FullProps } from "@/types/layout";

interface Props extends FullProps {
  title?: string;
  description?: string;
}

export default function PageLayout({
  children,
  title,
  description,
  className,
  ...props
}: Props) {
  return (
    <div className={cn("p-4 lg:p-7", className)} {...props}>
      {title && description && (
        <div className="mb-5 m-1 f-col gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      )}
      {children}
    </div>
  );
}

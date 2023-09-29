import { PropsWithChildren } from "react";

export interface FullProps
  extends React.HTMLAttributes<HTMLElement>,
    PropsWithChildren {}

export interface StructureProps extends FullProps {
  isLoading?: boolean;
}

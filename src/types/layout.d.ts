import React from "react";

export interface Menu {
  title: string;
  to: string;
  icon: any;
  gap?: boolean;
}

export interface StructureProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  isLoading?: boolean;
}

export interface Menu {
  title: string;
  to: string;
  icon: any;
  gap?: boolean;
}

export interface StructureProps {
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

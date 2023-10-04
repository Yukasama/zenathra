interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoaded?: boolean;
  children?: React.ReactNode;
}

export default function Skeleton({ isLoaded, children, ...props }: Props) {
  return (
    <div className="relative">
      {!isLoaded && (
        <div className="animate-pulse-right absolute inset-0 rounded-md"></div>
      )}
      <div className={`${!isLoaded && "invisible"}`} {...props}>
        {children}
      </div>
    </div>
  );
}

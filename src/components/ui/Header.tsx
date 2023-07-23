interface Props {
  header: string;
  subHeader: string;
  center?: boolean;
  className?: string;
}

export default function Header({
  header,
  subHeader,
  center,
  className,
}: Props) {
  return (
    <div className={`f-col ${center && "items-center"} ${className}`}>
      <h1 className="text-lg font-medium">{header}</h1>
      <h3 className="text-sm text-gray-600">{subHeader}</h3>
    </div>
  );
}

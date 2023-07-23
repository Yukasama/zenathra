import { BackButton } from "@/components/ui/buttons";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex-box fixed left-0 top-0 z-30 h-screen w-screen bg-gray-100 dark:bg-moon-300">
      <div className="absolute left-7 top-3.5">
        <BackButton link={"/"} />
      </div>
      {children}
    </div>
  );
}

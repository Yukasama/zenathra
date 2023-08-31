import CloseModal from "@/components/close-modal";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="f-box fixed left-0 top-0 z-30 h-screen w-screen bg-slate-300/50 dark:bg-slate-950/50">
      <div className="relative">
        <div className="absolute top-4 right-4">
          <CloseModal />
        </div>
        {children}
      </div>
    </div>
  );
}

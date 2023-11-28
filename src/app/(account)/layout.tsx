import type { PropsWithChildren } from "react";

export default function layout({ children }: PropsWithChildren) {
  return (
    <div className="f-box fixed left-0 top-0 z-20 h-screen w-screen bg-background">
      {children}
    </div>
  );
}

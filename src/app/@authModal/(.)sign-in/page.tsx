import AuthSignIn from "@/components/auth-sign-in";
import CloseModal from "@/components/close-modal";

export default function Page() {
  return (
    <div className="fixed bg-white/50 h-fit w-full f-box py-36 z-50">
      <div className="relative">
        <div className="absolute top-4 right-4">
          <CloseModal />
        </div>
        <AuthSignIn />
      </div>
    </div>
  );
}

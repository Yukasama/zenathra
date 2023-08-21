import Image from "next/image";

interface Props {
  image: string | null | undefined;
  collapsed: boolean;
  setCollapsed: any;
}

export default function ProfileIcon({ image, collapsed, setCollapsed }: Props) {
  return (
    <button
      className="essential icon"
      onClick={() =>
        setCollapsed((prev: boolean) =>
          prev === collapsed ? !collapsed : collapsed
        )
      }>
      <Image
        className="w-[26px] h-[26px] rounded-full"
        referrerPolicy="no-referrer"
        src={image || "/images/unknown-user.png"}
        width={26}
        height={26}
        alt="Navbar User Logo"
        priority
      />
    </button>
  );
}

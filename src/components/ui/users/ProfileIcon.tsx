import Image from "next/image";

interface Props {
  image: string | null | undefined;
  collapsed: boolean;
  setCollapsed: any;
}

export default function ProfileIcon({ image, collapsed, setCollapsed }: Props) {
  return (
    <div
      id="login-button"
      className="flex-box h-9 w-9
      cursor-pointer rounded-md 
      hover:bg-gray-200 dark:border-moon-300 dark:hover:bg-moon-100"
      onClick={() =>
        setCollapsed((prev: boolean) =>
          prev === collapsed ? !collapsed : collapsed
        )
      }>
      <Image
        className="h-9 w-9 p-1 rounded-full"
        referrerPolicy="no-referrer"
        src={image || "/images/unknown-user.png"}
        width={36}
        height={36}
        alt="Navbar User Logo"
        priority
      />
    </div>
  );
}

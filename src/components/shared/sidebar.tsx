import SidebarToggle from "./sidebar-toggle";
import { Card } from "../ui/card";
import { Menu } from "lucide-react";

export default async function Sidebar() {
  return (
    <Card className="hidden md:flex rounded-none border-y-0 f-col p-3.5">
      <SidebarToggle>
        <Menu className="h-[18px]" />
      </SidebarToggle>
    </Card>
  );
}

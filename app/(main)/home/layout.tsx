import { WorkspaceSidebar } from "@/components/WorkspaceSidebar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex">
      <WorkspaceSidebar />
      <div className="flex-1 h-full overflow-y-auto">{children}</div>
    </div>
  );
}

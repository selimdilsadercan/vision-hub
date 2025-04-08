import { ProjectNavbar } from "@/components/projects/ProjectNavbar";
import { ProjectSidebar } from "@/components/projects/ProjectSidebar";
import { ProjectHeader } from "@/components/projects/ProjectHeader";

export default function ProjectLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-50">
        <ProjectSidebar projectId={params.id} />
      </div>
      <main className="md:pl-72">
        <ProjectHeader title="The Everything" />
        {children}
      </main>
      <ProjectNavbar projectId={params.id} />
    </div>
  );
}

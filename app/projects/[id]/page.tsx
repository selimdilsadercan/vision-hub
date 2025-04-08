interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div className="h-full p-4 space-y-2">
      <h2 className="text-2xl font-bold">Project Folders</h2>
      {/* Folder content will be implemented later */}
    </div>
  );
}

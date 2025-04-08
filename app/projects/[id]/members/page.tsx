interface MembersPageProps {
  params: {
    id: string;
  };
}

export default function MembersPage({ params }: MembersPageProps) {
  return (
    <div className="h-full p-4 space-y-2">
      <h2 className="text-2xl font-bold">Members</h2>
      {/* Members content will be implemented later */}
    </div>
  );
}

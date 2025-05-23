"use client";

interface LegalLayoutProps {
  children: React.ReactNode;
}

function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white p-8 rounded-lg shadow">{children}</div>
    </div>
  );
}

export default LegalLayout;

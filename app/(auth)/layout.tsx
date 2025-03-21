"use client";

import { usePathname, useRouter } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isSignIn = pathname.includes("/sign-in");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 gap-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Hoş Geldin 👋</h1>
      </div>

      <div className="w-[400px] max-w-full">
        <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${!isSignIn ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
            onClick={() => router.push("/sign-up")}
          >
            Hesap Oluştur
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${isSignIn ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
            onClick={() => router.push("/sign-in")}
          >
            Hesabım Var
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { auth } from "@/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Şifre sıfırlama işlemi başarısız oldu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Şifremi Unuttum</h2>
          <p className="mt-2 text-sm text-gray-600">Şifrenizi sıfırlamak için e-posta adresinizi girin</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <Input placeholder="Mail Adresi" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Gönderiliyor..." : "Şifremi Sıfırla"}
          </Button>
          <div className="text-center">
            <Link href="/login" className="text-sm text-[#2563EB] hover:underline">
              Giriş sayfasına dön
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

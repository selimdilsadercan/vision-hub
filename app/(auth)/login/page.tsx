"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/firebase/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");

  useEffect(() => {
    if (user && !loading) {
      router.push("/home");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(loginEmail, loginPassword);
    } catch (error) {
      console.error(error);
      toast.error("Giriş yapılırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signUp(registerEmail, registerPassword);
    } catch (error) {
      console.error(error);
      toast.error("Kayıt olurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // If loading auth state, show loading spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is already logged in, don't render the login form
  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center pt-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Hoş Geldin 👋</h2>
            </div>

            <Tabs defaultValue="register" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="register">Hesap Oluştur</TabsTrigger>
                <TabsTrigger value="login">Hesabım Var</TabsTrigger>
              </TabsList>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <Input placeholder="İsim Soyisim" type="text" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required />
                  <Input placeholder="Mail Adresi" type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
                  <div className="relative">
                    <Input
                      placeholder="Parola"
                      type={showPassword ? "text" : "password"}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Kaydolunuyor..." : "Kaydol"}
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">veya</span>
                    </div>
                  </div>
                  <Button type="button" variant="outline" className="w-full" onClick={() => signInWithGoogle()} disabled={isLoading}>
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Google ile Kaydol
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    Kaydolarak{" "}
                    <Link href="/legal-agreements/terms" className="text-[#2563EB]">
                      Üyelik Sözleşmemizi
                    </Link>{" "}
                    ve{" "}
                    <Link href="/legal-agreements/privacy" className="text-[#2563EB]">
                      KVKK metnimizi
                    </Link>{" "}
                    kabul etmiş olursunuz.
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input placeholder="Mail Adresi" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                  <div className="relative">
                    <Input
                      placeholder="Parola"
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">veya</span>
                    </div>
                  </div>
                  <Button type="button" variant="outline" className="w-full" onClick={() => signInWithGoogle()} disabled={isLoading}>
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Google ile Giriş Yap
                  </Button>
                  <div className="text-center">
                    <Link href="/forgot-password" className="text-sm text-[#2563EB] hover:underline">
                      Şifremi Unuttum
                    </Link>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;

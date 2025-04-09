"use client";

import Link from "next/link";

function TermsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Üyelik Sözleşmesi</h1>
        <Link href="/login" className="text-[#2563EB] hover:underline text-sm">
          Giriş sayfasına dön
        </Link>
      </div>

      <div className="prose max-w-none">
        <h2>1. Genel Hükümler</h2>
        <p>
          Bu üyelik sözleşmesi, platformumuzun kullanım şartlarını ve kurallarını belirler. Platformumuzu kullanarak bu sözleşmeyi kabul etmiş sayılırsınız.
        </p>

        <h2>2. Üyelik</h2>
        <p>Platformumuza üye olarak, verdiğiniz bilgilerin doğru olduğunu ve güncel tutulacağını taahhüt edersiniz.</p>

        <h2>3. Gizlilik</h2>
        <p>Kullanıcı bilgileriniz, gizlilik politikamız çerçevesinde korunur ve işlenir.</p>

        <h2>4. Sorumluluklar</h2>
        <p>Platform kullanımından doğacak her türlü sorumluluk kullanıcıya aittir.</p>
      </div>
    </div>
  );
}

export default TermsPage;

"use client";

import Link from "next/link";

function PrivacyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">KVKK Metni</h1>
        <Link href="/login" className="text-[#2563EB] hover:underline text-sm">
          Giriş sayfasına dön
        </Link>
      </div>

      <div className="prose max-w-none">
        <h2>1. Veri Sorumlusu</h2>
        <p>Kişisel verileriniz, veri sorumlusu olarak şirketimiz tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>

        <h2>2. Kişisel Verilerin İşlenme Amacı</h2>
        <p>Kişisel verileriniz, platformumuzun sunduğu hizmetlerden faydalanabilmeniz amacıyla işlenmektedir.</p>

        <h2>3. Kişisel Verilerin Aktarılması</h2>
        <p>
          Kişisel verileriniz, yasal düzenlemelerin öngördüğü sınırlar dahilinde ve yükümlülüklerin yerine getirilmesi amacıyla yetkili kamu kurum ve
          kuruluşlarıyla paylaşılabilecektir.
        </p>

        <h2>4. Kişisel Veri Sahibinin Hakları</h2>
        <p>KVKK'nın 11. maddesi uyarınca, kişisel veri sahibi olarak aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
          <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        </ul>
      </div>
    </div>
  );
}

export default PrivacyPage;

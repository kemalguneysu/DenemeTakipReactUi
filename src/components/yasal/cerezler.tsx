"use client";
import React from "react";
import { Card } from "../ui/card";

const GizlilikPolitikasiContent = () => {
  return (
    <Card className="p-6 shadow-md">
      <h1 className="text-3xl font-bold mb-4">
        [Web Sitesi Adınız] için Çerez Politikası
      </h1>
      <p className="text-sm text-gray-600">
        **Yürürlük Tarihi:** [Tarihi Ekleyin]
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Giriş</h2>
      <p className="mb-4">
        [Web Sitesi Adınız] ("biz", "bizim", "bize") hizmetlerimizi kullanırken
        deneyiminizi geliştirmek için çerezler ve benzeri izleme teknolojileri
        kullanmaktadır. Bu politika, çerezlerin ne olduğunu, nasıl
        kullandığımızı, çerezlerle ilgili tercihlerinizi ve çerezler hakkında
        daha fazla bilgiyi açıklamaktadır. Ayrıca, bu gizlilik politikası
        Kişisel Verilerin Korunması Kanunu'na (KVKK) uygun olarak
        hazırlanmıştır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Çerez Nedir?</h2>
      <p className="mb-4">
        Çerezler, bir web sitesini ziyaret ettiğinizde cihazınıza kaydedilen
        küçük metin dosyalarıdır. Web siteleri, cihazınızı tanımak ve
        tercihlerinizi veya önceki eylemleriniz hakkında bilgi saklamak için bu
        çerezleri kullanır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        3. Çerezleri Nasıl Yönetebilirsiniz?
      </h2>
      <p className="mb-4">
        Web sitemizi ilk kez ziyaret ettiğinizde bir çerez onay banner'ı
        göreceksiniz. Web sitemizi kullanmaya devam ederek, bu politikada
        belirtilen çerezlerin kullanımını onaylamış olursunuz. Çerez
        tercihlerinizi dilediğiniz zaman tarayıcı ayarları üzerinden
        değiştirebilirsiniz. Tarayıcı ayarlarınızı değiştirmek için aşağıdaki
        adımları takip edebilirsiniz:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Chrome:</strong>{" "}
          <a
            href="http://www.google.com/support/chrome/bin/answer.py?hl=en&answer=95647"
            className="text-blue-500"
          >
            Ayarlar &gt; Gizlilik ve Güvenlik &gt; Çerezler ve Diğer Site
            Verileri
          </a>
        </li>
        <li>
          <strong>Firefox:</strong>{" "}
          <a
            href="http://support.mozilla.com/en-US/kb/Cookies"
            className="text-blue-500"
          >
            Ayarlar &gt; Gizlilik ve Güvenlik &gt; Çerezler ve Site Verileri
          </a>
        </li>
        <li>
          <strong>Safari:</strong>{" "}
          <a
            href="https://support.apple.com/kb/ph19214?locale=tr_TR"
            className="text-blue-500"
          >
            Ayarlar &gt; Gizlilik &gt; Çerezleri ve Site Verilerini Yönet
          </a>
        </li>
        <li>
          <strong>Edge:</strong>{" "}
          <a
            href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies"
            className="text-blue-500"
          >
            Ayarlar &gt; Gizlilik, Arama ve Hizmetler &gt; Çerezler ve Site
            İzinleri
          </a>
        </li>
        <li>
          <strong>Opera:</strong>{" "}
          <a
            href="http://www.opera.com/browser/tutorials/security/privacy/"
            className="text-blue-500"
          >
            Çerez Ayarları
          </a>
        </li>
        <li>
          <strong>Yandex:</strong>{" "}
          <a
            href="https://browser.yandex.com/help/personal-data-protection/cookies.html"
            className="text-blue-500"
          >
            Çerez Yönetimi
          </a>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        4. Çerezleri Nasıl Kullanıyoruz?
      </h2>
      <p className="mb-4">
        Çerezleri çeşitli amaçlarla kullanıyoruz, bunlar arasında:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Kimlik Doğrulama:</strong> Kullanıcı oturumlarını yönetmek ve
          kimliğinizi doğrulamak için. Güvenli erişim sağlamak için çerezlerde
          JWT token saklıyoruz.
        </li>
        <li>
          <strong>Kullanıcı Tercihleri:</strong> Tema tercihinizi (açık veya
          koyu mod) oturumlar arasında hatırlamak için.
        </li>
        <li>
          <strong>Analiz:</strong> Kullanıcı etkileşimlerini toplamak için
          Google Analytics kullanmayı planlıyoruz. Bu, kullanıcı davranışlarını
          anlamamıza ve hizmetlerimizi geliştirmemize yardımcı olur.
        </li>
        <li>
          <strong>Performans:</strong> Web sitemizin performansını ve
          kullanılabilirliğini artırmak için.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        5. Kullandığımız Çerez Türleri
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Zorunlu Çerezler:</strong> Bu çerezler, web sitesinin
          çalışması için gerekli olup sistemlerimizde kapatılamaz.
        </li>
        <li>
          <strong>Tercih Çerezleri:</strong> Bu çerezler, web sitemizin sizin
          yaptığınız seçimleri hatırlamasına ve daha kişisel özellikler
          sunmasına olanak tanır.
        </li>
        <li>
          <strong>Analiz Çerezleri:</strong> Kullanıcıların web sitemizle nasıl
          etkileşimde bulunduğunu analiz etmek ve site kullanımı hakkında bilgi
          toplamak için kullanıyoruz.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Kullanıcı Onayı</h2>
      <p className="mb-4">
        Web sitemizi ilk kez ziyaret ettiğinizde bir çerez onay banner'ı
        göreceksiniz. Web sitemizi kullanmaya devam ederek, bu politikada
        belirtilen çerezlerin kullanımını onaylamış olursunuz. Çerez
        tercihlerinizi dilediğiniz zaman tarayıcı ayarları üzerinden
        değiştirebilirsiniz.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Veri Saklama</h2>
      <p className="mb-4">
        Çerezler aracılığıyla toplanan bilgileri, bu politikada belirtilen
        amaçları yerine getirmek veya yasal olarak gerekli olduğu sürece
        saklarız. Hesabınızı silmeyi tercih ederseniz, çerezlerle ilişkili
        verileriniz de silinecektir.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">8. Kullanıcı Hakları</h2>
      <p className="mb-4">Aşağıdaki haklara sahipsiniz:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Hakkınızda tuttuğumuz kişisel verilere erişim talep etme.</li>
        <li>Hatalı verilerin düzeltilmesini talep etme.</li>
        <li>Kişisel verilerinizin silinmesini talep etme.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">9. Erişim Hakkı</h2>
      <p className="mb-4">
        Kullanıcılar, sahip oldukları verilerine erişim talep edebilir. Bu
        erişim, kullanıcıların hesabına giriş yaparak ya da bizlere e-posta
        göndererek gerçekleştirilebilir. Kullanıcılar, belirli verilerine
        ulaşmak için doğrudan iletişime geçebilir ve talep ettikleri bilgilere
        ulaşma konusunda destek alabilirler.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        10. İletişim Bilgileri
      </h2>
      <p className="mb-4">
        Gizlilik politikamızla ilgili sorularınız veya talepleriniz için lütfen
        aşağıdaki iletişim bilgileri üzerinden bizimle iletişime geçin:
      </p>
      <p>
        <strong>Email:</strong> [Email Adresiniz]
      </p>
      <p>
        <strong>Telefon:</strong> [Telefon Numaranız]
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">11. Son Hükümler</h2>
      <p className="mb-4">
        [Web Sitesi Adınız] çerez politikasında herhangi bir değişiklik yapma
        hakkını saklı tutar. Değişiklikler, güncel tarih ile birlikte
        yayınlanacaktır. Bu politikayı düzenli olarak kontrol ederek
        güncellemelerden haberdar olmanızı öneririz.
      </p>
    </Card>
  );
};

export default GizlilikPolitikasiContent;

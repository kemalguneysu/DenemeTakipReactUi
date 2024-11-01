"use client";
import React from "react";
import { Card } from "../ui/card";

const KullanimSartlariContent = () => {
  return (
    <Card className="p-6 shadow-md">
      <h1 className="text-3xl font-bold mb-4">
        denemetakip.com için Kullanım Koşulları
      </h1>
      <p className="text-sm text-gray-600">
        <strong>Yürürlük Tarihi:</strong> [Tarihi Ekleyin]
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Genel Bilgiler</h2>
      <p className="mb-4">
        denemetakip.com web sitesi, Yükseköğretim Kurumları Sınavı (YKS) için
        deneme sınavı verilerini takip etmek amacıyla kurulmuştur. YKS, iki
        aşamadan oluşur: Temel Yeterlilik Testi (TYT) ve Alan Yeterlilik Testi
        (AYT). Kullanıcılar, bu sınavlara hazırlık sürecinde çeşitli derslerdeki
        (Türkçe, Matematik, Sosyal Bilgiler, Fen Bilimleri ve AYT kapsamında
        diğer dersler) doğru ve yanlış cevaplarını girmekte ve bu verileri
        kaydetmektedir. Site, kullanıcıların verdiği bilgiler doğrultusunda
        grafiksel veriler sunarak performans analizi yapmasına olanak
        tanımaktadır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        2. Kullanıcı Verileri
      </h2>
      <p className="mb-4">
        Kullanıcılar, denemeler esnasında doğru ve yanlış cevaplarını, ilgili
        konularını ve boş bırakılan soruları siteye girmektedir. Bu veriler,
        sistemde kaydedilir ve kullanıcının geçmiş denemeleri ile ilgili
        grafiksel analizler sunmak amacıyla kullanılmaktadır. Kullanıcı
        verileri, yalnızca analiz ve geliştirme amaçlı olarak saklanacak ve
        üçüncü şahıslarla paylaşılmayacaktır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Sorumluluk Reddi</h2>
      <p className="mb-4">
        denemetakip.com, siteye erişim veya site içerisindeki bilgilerin
        kullanımından doğabilecek herhangi bir zarardan sorumlu değildir.
        Kullanıcılar, sitedeki bilgileri kullanırken dikkatli olmalı ve kendi
        sorumluluğunda hareket etmelidir.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Değişiklik Hakkı</h2>
      <p className="mb-4">
        denemetakip.com, bu kullanım koşullarını değiştirme hakkını saklı tutar.
        Yapılan değişiklikler, site üzerinde yayınlandığı anda yürürlüğe girer
        ve kullanıcılar bu koşulları kabul etmiş sayılır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        5. Üçüncü Taraf Bağlantıları
      </h2>
      <p className="mb-4">
        denemetakip.com, başka web sitelerine bağlantılar içerebilir. Bu
        bağlantılar üzerinden erişilen sitelerin içeriklerinden denemetakip.com
        sorumlu değildir.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        6. Fikri Mülkiyet Hakları
      </h2>
      <p className="mb-4">
        denemetakip.com üzerinde yer alan tüm içerikler, tasarımlar, grafikler
        ve diğer materyaller, yasal koruma altındadır. İzin alınmadan veya
        kaynak gösterilmeden bu materyallerin kopyalanması, dağıtılması veya
        başka bir amaçla kullanılması yasaktır.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        7. İletişim Bilgileri
      </h2>
      <p className="mb-4">
        Kullanıcılar, denemetakip.com ile ilgili her türlü soru, öneri veya
        sorun için
        <strong> denemetakip@gmail.com</strong> adresi üzerinden iletişime
        geçebilirler.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">8. Yasal Uyum</h2>
      <p className="mb-4">
        denemetakip.com, Türkiye Cumhuriyeti yasalarına tabidir. Kullanıcılar,
        siteyi kullanarak bu yasalarla uyumlu hareket etmeyi kabul ederler.
      </p>
    </Card>
  );
};

export default KullanimSartlariContent;

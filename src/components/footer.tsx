"use client"; // İstemci bileşeni olarak işaretle
import Link from "next/link";
import Image from 'next/image'
import { useTheme } from "next-themes";
export function Footer() {
  const { theme } = useTheme(); // Tema bilgisini almak için useTheme kancası

  return (
    <footer className="flex flex-col items-center w-full mx-auto py-4 bg-backgroundColor border-t border-textColor mt-4 ">
      <div className="footerContainer grid grid-cols-1 sm:grid-cols-6 gap-4 p-8 max-w-7xl w-full">
        <div className="brandContainer col-span-1 sm:col-span-2 flex justify-center items-center mb-4 sm:mb-0">
          <Link href="" className="brandImageContainer h-40">
            <Image
              src="/images/ol.png"
              alt="Description of the image"
              width={150}
              height={150}
              className={`brandImage rounded-full border ${
                theme === "dark" ? "border-gray-100" : "border-gray-800"
              }`}
            />
          </Link>
        </div>
        <div className="navigationContainer col-span-1 flex flex-col items-center">
          <h5 className="text-lg font-quicksand font-bold text-textColor">
            Takip
          </h5>
          <h5 className="m-1 text-center opacity-75 transition-opacity duration-300 hover:opacity-100">
            <Link
              href="denemelerim"
              className="text-base font-quicksand font-light text-textColor rounded-2xl p-2 transition duration-300 ease-in-out hover:bg-secondaryColor"
            >
              Denemelerim
            </Link>
          </h5>
          <h5 className="m-1 text-center opacity-75 transition-opacity duration-300 hover:opacity-100">
            <Link
              href="analizlerim"
              className="text-base font-quicksand font-light text-textColor rounded-2xl p-2 transition duration-300 ease-in-out hover:bg-secondaryColor"
            >
              Analizler
            </Link>
          </h5>
        </div>
        <div className="navigationContainer col-span-1 flex flex-col items-center">
          <h5 className="text-lg font-quicksand font-bold text-textColor">
            Deneme Takip
          </h5>
          <h5 className="m-1 text-center opacity-75 transition-opacity duration-300 hover:opacity-100">
            <Link
              href="hakkimizda"
              className="text-base font-quicksand font-light text-textColor rounded-2xl p-2 transition duration-300 ease-in-out hover:bg-secondaryColor"
            >
              Hakkımızda
            </Link>
          </h5>
          <h5 className="m-1 text-center opacity-75 transition-opacity duration-300 hover:opacity-100">
            <Link
              href="sikca-sorulan-sorular"
              className="text-base font-quicksand font-light text-textColor rounded-2xl p-2 transition duration-300 ease-in-out hover:bg-secondaryColor"
            >
              Sıkça Sorulan Sorular
            </Link>
          </h5>
        </div>
        <div className="navigationContainer col-span-1 flex flex-col items-center">
          <h5 className="text-lg font-quicksand font-bold text-textColor">
            Yasal
          </h5>
          <h5 className="m-1 text-center opacity-75 transition-opacity duration-300 hover:opacity-100">
            <Link
              href="/yasal/gizlilik-politikasi"
              className="text-base font-quicksand font-light text-textColor rounded-2xl p-2 transition duration-300 ease-in-out hover:bg-secondaryColor"
            >
              Gizlilik Politikası
            </Link>
          </h5>
          <h5 className="m-1 text-center opacity-75 transition-opacity duration-300 hover:opacity-100">
            <Link
              href="/yasal/kullanim-sartlari"
              className="text-base font-quicksand font-light text-textColor rounded-2xl p-2 transition duration-300 ease-in-out hover:bg-secondaryColor"
            >
              Kullanım Şartları
            </Link>
          </h5>
          
        </div>
        <div className="navigationContainer col-span-1 flex flex-col items-center">
          <h5 className="text-lg font-quicksand font-bold text-textColor">
            İletişim
          </h5>
          <h5 className="m-1 text-center opacity-75 transition-opacity duration-300 hover:opacity-100">
            <Link
              href="mailto:denemetakip@gmail.com"
              className="text-base font-quicksand font-light text-textColor rounded-2xl p-2 transition duration-300 ease-in-out hover:bg-secondaryColor"
            >
              Email
            </Link>
          </h5>
        </div>
      </div>
    </footer>
  );
}

import { faqQuestions } from './../config/faq-questions';
import { Icons } from "../components/icons"

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  children?: NavItem[];
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavItem[];
    }
);

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  footerNav: FooterItem[];
};

export type FaqQuestions = {
  faq: FaqItem[];
};

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
export interface SocialUser {
  provider: string;
  id: string;
  email: string;
  name: string;
  photoUrl: string;
  firstName: string;
  lastName: string;
  authToken: string;
  idToken: string;
  authorizationCode: string;
  response: any;
}
export interface Token {
  accessToken: string;
  refreshToken: string;
  expiration: Date;
}

export interface TokenResponse {
  token: Token;
}
export class UserCreate {
  succeeded!: boolean;  // Using '!' to assert that this will be initialized later
  message!: string;   
}
export class User{
  username!:string;
  email!:string;
  password!:string;
  passwordConfirm!:string
}
export class tytGenelList{
  id!:string;
  turkceNet!:number;
  matematikNet!:number;
  sosyalNet!:number;
  fenNet!:number;
  toplamNet!:number;
  tarih!:Date
}
export class aytGenelList{
  id!:string;
  sayisalNet!:number;
  esitAgirlikNet!:number;
  sozelNet!:number;
  dilNet!:number;
  tarih!:Date
}
export class CreateTyt{
  matematikDogru:number=0;
  matematikYanlis:number=0;
  turkceDogru:number=0;
  turkceYanlis:number=0;
  fenDogru:number=0;
  fenYanlis:number=0;
  sosyalDogru:number=0;
  sosyalYanlis:number=0;
  yanlisKonularId:Array<string>=[];
  bosKonularId:Array<string>=[];
}
export class CreateAyt{
  matematikDogru:number=0;
  matematikYanlis:number=0;
  fizikDogru:number=0;
  fizikYanlis:number=0;
  kimyaDogru:number=0;
  kimyaYanlis:number=0;
  biyolojiDogru:number=0;
  biyolojiYanlis:number=0;
  edebiyatDogru:number=0;
  edebiyatYanlis:number=0;
  cografya1Dogru:number=0;
  cografya1Yanlis:number=0;
  tarih1Dogru:number=0;
  tarih1Yanlis:number=0;
  cografya2Dogru:number=0;
  cografya2Yanlis:number=0;
  tarih2Dogru:number=0;
  tarih2Yanlis:number=0;
  dinDogru:number=0;
  dinYanlis:number=0;
  felsefeDogru:number=0;
  felsefeYanlis:number=0;
  dilDogru:number=0;
  dilYanlis:number=0;
  yanlisKonularId:Array<string>=[];
  bosKonularId:Array<string>=[];
}
export class CreateDers{
  dersAdi!:string;
  isTyt!:boolean;
}
export class Ders{
  id!:string;
  dersAdi!:string;
  isTyt!:boolean;
}
export class Konu{
  id!:string;
  konuAdi!:string;
  isTyt!:boolean;
  dersAdi!:string
}
export class CreateKonu{
  konuAdi!:string;
  dersId!:string;
  isTyt!:boolean;
}
export class UpdateDers{
  dersId!:string;
  dersAdi!:string;
  isTyt!:boolean;
}
export class ListKonu{
  id!:string;
  konuAdi!:string;
  isTyt!:boolean;
  dersAdi!:string;
  dersId!:string;
}
export class UpdateKonu{
  konuId!:string;
  konuAdi!:string;
  dersId!:string;
}
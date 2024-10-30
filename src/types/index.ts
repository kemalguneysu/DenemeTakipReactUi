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
export class TytSingleList{
  id!:string;
  turkceDogru!:number;
  turkceYanlis!:number;
  matematikDogru!:number;
  matematikYanlis!:number;
  fenDogru!:number;
  fenYanlis!:number;
  sosyalDogru!:number;
  sosyalYanlis!:number;
  yanlisKonularAdDers!:Array<konularAdDers>;
  bosKonularAdDers!:Array<konularAdDers>;
}
export class konularAdDers{
  konuAdi!:string;
  konuId!:string;
  dersAdi!:string;
  dersId!:string;
}
export class AytSingleList{
  id!:string;
  matematikDogru!:number;
  matematikYanlis!:number;
  fizikDogru!:number;
  fizikYanlis!:number;
  kimyaDogru!:number;
  kimyaYanlis!:number;
  biyolojiDogru!:number;
  biyolojiYanlis!:number;
  edebiyatDogru!:number;
  edebiyatYanlis!:number;
  tarih1Dogru!:number;
  tarih1Yanlis!:number;
  tarih2Dogru!:number;
  tarih2Yanlis!:number;
  cografya1Dogru!:number;
  cografya1Yanlis!:number;
  cografya2Dogru!:number;
  cografya2Yanlis!:number;
  felsefeDogru!:number;
  felsefeYanlis!:number;
  dinDogru!:number;
  dinYanlis!:number;
  dilDogru!:number;
  dilYanlis!:number;
  yanlisKonularAdDers!:Array<konularAdDers>;
  bosKonularAdDers!:Array<konularAdDers>;
}
export class UpdateTyt{
  tytId!:string;
  matematikDogru:number=0;
  matematikYanlis:number=0;
  turkceDogru:number=0;
  turkceYanlis:number=0;
  fenDogru:number=0;
  fenYanlis:number=0;
  sosyalDogru:number=0;
  sosyalYanlis:number=0;
  yanlisKonular:Array<string>=[];
  bosKonular:Array<string>=[];
}
export class UpdateAyt{
  aytId!:string;
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
  tarih1Dogru:number=0;
  tarih1Yanlis:number=0;
  cografya1Dogru:number=0;
  cografya1Yanlis:number=0;
  tarih2Dogru:number=0;
  tarih2Yanlis:number=0;
  cografya2Dogru:number=0;
  cografya2Yanlis:number=0;
  felsefeDogru:number=0;
  felsefeYanlis:number=0;
  dinDogru:number=0;
  dinYanlis:number=0;
  dilDogru:number=0;
  dilYanlis:number=0;
  yanlisKonular:Array<string>=[];
  bosKonular:Array<string>=[];
}
export type OrderByDirection = {
  orderBy: string;
  orderDirection: 'asc' | 'desc'| null;
};
export class UserList {
  id!: string;
  email!: string;
  userName!: string;
  isAdmin!: boolean;
}
export class Role{
  id!:string;
  name!:string;
}
export class UserById
{
  userId!:string;
  userName!:string;
  email!:string;
  emailConfirmed!:boolean;
}
export class HomePageTyt {
  id!: string;
  CreatedDate!: Date;
  turkceDogru!: number;
  turkceYanlis!: number;
  matematikDogru!: number;
  matematikYanlis!: number;
  fenDogru!: number;
  fenYanlis!: number;
  sosyalDogru!: number;
  sosyalYanlis!: number;
  toplamNet!: number;
}
export class HomePageAyt {
  id!: string;
  CreatedDate!: Date;
  matematikDogru!: number;
  matematikYanlis!: number;
  fizikDogru!: number;
  fizikYanlis!: number;
  kimyaDogru!: number;
  kimyaYanlis!: number;
  biyolojiDogru!: number;
  biyolojiYanlis!: number;
  edebiyatDogru!: number;
  edebiyatYanlis!: number;
  tarih1Dogru!: number;
  tarih1Yanlis!: number;
  cografya1Dogru!: number;
  cografya1Yanlis!: number;
  tarih2Dogru!: number;
  tarih2Yanlis!: number;
  cografya2Dogru!: number;
  cografya2Yanlis!: number;
  felsefeDogru!: number;
  felsefeYanlis!: number;
  dinDogru!: number;
  dinYanlis!: number;
  dilDogru!: number;
  dilYanlis!: number;
  sayisalNet!: number;
  esitAgirlikNet!: number;
  sozelNet!: number;
  dilNet!: number;
}
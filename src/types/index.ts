import { faqQuestions } from './../config/faq-questions';
import { Icons } from "../components/icons"

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
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
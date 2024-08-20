import { Express} from "express";
import { Response as ExpressResponse, Request as ExpressRequest } from "express";
import i18n from 'i18n';

declare module "express-serve-static-core" {
    interface Request {
      token?: any;
    }
    interface Response {
    __?: any
    }
  }

  export interface JwtPayload {
    type: string;
    role: string;
    id: string;
  }



  declare module "express-serve-static-core" {
    interface Request {
      token?: any;
      __(phraseOrOptions: string, ...replace: any[]): string;
      __n(phrase: string, count: number): string;
      __n(options: i18n.PluralOptions, count?: number): string;
      __n(singular: string, plural: string, count: string | number, ...replace: any[]): string;
    }
  
    interface Response {
      __?(phraseOrOptions: string, ...replace: any[]): string;
      __n?(phrase: string, count: number): string;
      __n?(options: i18n.PluralOptions, count?: number): string;
      __n?(singular: string, plural: string, count: string | number, ...replace: any[]): string;
    }
  }
  
  export type Dictionary = Record<string,any>
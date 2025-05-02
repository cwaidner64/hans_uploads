/// <reference types="react-scripts" />

declare module "*.png";
declare module "*.css";
declare module "*.svg";
declare module "dfx-generated/Server" {
  export const idlFactory: any;
  export const canisterId: string;
}

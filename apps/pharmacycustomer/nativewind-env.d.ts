/// <reference types="nativewind/types" />

declare module '*.css';

declare module '*.jpg' {
  const asset: number;
  export default asset;
}

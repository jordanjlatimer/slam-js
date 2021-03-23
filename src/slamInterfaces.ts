import { Properties as CSSProperties } from "csstype";

export interface ElementAttributes {
  class?: string;
  id?: string;
  slot?: string;
  css?: CSSObject;
  js?: () => void;
  autofocus?: boolean;
  nonce?: string;
  tabindex?: number;
}

export interface SlamElement {
  type: "element";
  tag: string;
  atts?: any;
  children?: ResolvedChild[];
}

export type Child = ResolvedChild | Promise<SlamElement>;

export type ResolvedChild = SlamElement | string;

interface Selector {
  [key: string]: CSSProperties | Selector;
}

export type CSSObject = CSSProperties | Selector;

export interface Identification {
  [key: number]: SlamElement[];
}

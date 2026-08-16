// Core types for attribute management
import { label } from 'framer-motion/client';

export type DisplayType = 'radio' | 'checkbox' | 'buttons' | 'dropdown' | 'color-swatches';

export interface Attribute {
  id: string;
  name: string;
  displayType: DisplayType;
  values : AttributeValue[]
}

export interface AttributeValue {
  id: string;
  attributeId: string;
  name: string;
  value : string
}

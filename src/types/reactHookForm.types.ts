import { Category, Item, Model, SKUCode } from "./types";

export type LoginInputs = {
  login: string;
  password: string;
};

export type CategoryInputs = {
  name: string;
};

export type ModelInputs = {
  name: string;
  category: Category | null;
};

export type ItemInputs = {
  name: string;
  uom: string;
  model: Model | null;
};

export type SKUInputs = {
  name: string;
  isDefective: boolean;
  item: Item | null;
};

export type StockFormInputs = {
  skuCode: SKUCode | null;
  price: string;
  quantity: string;
};

import { Branch, Category, Item, Model, SKUCode, User } from "./types";

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

export type StockTransferInputs = {
  skuCode: SKUCode | null;
  branch: Branch | null;
  engineer: User | null;
  quantity: string;
  stockToEn: boolean;
};

export type StockReturnInputs = {
  skuCode: SKUCode | null;
  quantity: string;
  note: string;
};

export type JobEntryInputs = {
  jobNo: string;
  imeiNo: string;
  serviceType: "AMC" | "BD Call" | "PM";
  sellFrom: "branch" | "engineer";
  engineerId?: string;
  engineer: User | null;
  items: {
    price: string;
    quantity: string;
    skuCodeId?: string;
    skuCode: SKUCode | null;
  }[];
};

export type JobItemInputs = {
  price: string;
  quantity: string;
  skuCode: SKUCode | null;
};

import { Branch, Category, Item, Model, SKUCode, UOM, User } from "./types";

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
  uom: UOM | null;
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

export type FaultyInputs = {
  skuCode: SKUCode | null;
  quantity: string;
  note: string;
};

export type StockReturnInputs = {
  skuCode: SKUCode | null;
  quantity: string;
  note: string;
};

export type JobEntryInputs = {
  jobNo: string;
  imeiNo: string;
  serviceType: "BD Call - Bill" | "BD Call - Cooling" | "Refurbishment" | "PM";
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

export type ChallanInputs = {
  name: string;
  address: string;
  phone: string;
  description: string;
  items: {
    skuCode: SKUCode | null;
    skuCodeId?: string;
    quantity: string;
  }[];
};

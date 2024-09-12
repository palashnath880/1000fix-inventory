export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  createdAt: string;
  branch: Branch | null;
  role: "admin" | "manager" | "engineer";
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  users: User[];
  createdAt: string;
};

export type Category = {
  name: string;
  id: string;
  createdAt: string;
};

export type Model = {
  name: string;
  id: string;
  createdAt: string;
  category: Category;
};

export type Item = {
  name: string;
  id: string;
  uom: string;
  createdAt: string;
  model: Model;
};

export type SKUCode = {
  name: string;
  id: string;
  createdAt: string;
  item: Item;
  isDefective: boolean;
};

export type StockType = {
  id: string;
  createdAt: string;
  type: "entry" | "transfer" | "engineer" | "return" | "defective";
  status: "open" | "approved" | "rejected" | "received" | "returned";
  price: number;
  quantity: number;
  rackNo: string;
  note: string;
  challan: string;
  sender: Branch | null;
  receiver: Branch | null;
  skuCode: SKUCode | null;
  endAt: string;
};

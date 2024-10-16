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
  isHead: boolean;
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

export type UOM = {
  name: string;
  id: string;
  createdAt: string;
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

export type EngineerStock = {
  id: string;
  createdAt: string;
  type: "transfer" | "return" | "faulty";
  status: "open" | "approved" | "rejected" | "received" | "returned";
  price: number;
  quantity: number;
  note: string;
  branchId: string;
  branch: Branch | null;
  skuCode: SKUCode | null;
  engineer: User | null;
  endAt: string;
};

export type OwnStockType = {
  avgPrice: number;
  quantity: number;
  defective: number;
  faulty: number;
  skuCode: SKUCode;
};

export type BranchStockType = {
  avgPrice: number;
  quantity: number;
  defective: number;
  faulty: number;
  skuCode: SKUCode;
  branch: Branch;
};

export type EnStockType = {
  avgPrice: number;
  quantity: number;
  defective: number;
  skuCode: SKUCode;
  engineer: User;
};

export type JobItemType = {
  price: number;
  quantity: number;
  skuCode: SKUCode;
  jobId: string;
  createdAt: string;
};

export type JobType = {
  id: string;
  jobNo: string;
  imeiNo: string;
  serviceType: string;
  sellFrom: "branch" | "engineer";
  engineer: User | null;
  createdAt: string;
  items: JobItemType[];
};

export type Challan = {
  id: string;
  name: string;
  address: string;
  description: string;
  challanNo: string;
  phone: string;
  items: { skuCode: SKUCode; quantity: number }[];
  createdAt: string;
};

export type Scrap = {
  id: string;
  createdAt: string;
  challanNo: string;
  from: "defective" | "faulty";
  items: {
    skuCode: SKUCode;
    quantity: number;
  }[];
};

export type FaultyItem = {
  id: string;
  createdAt: string;
  status: "open" | "rejected" | "received";
  quantity: number;
  reason: string;
  endReason: string;
  branch: Branch | null;
  skuCode: SKUCode | null;
  endAt: string;
};

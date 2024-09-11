export type User = {
  name: string;
  email: string;
  username: string;
  branch: null;
  role: "admin" | "manager" | "engineer";
};

export type Branch = {
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
  createdAt: string;
  model: Model;
};

export type SKUCode = {
  name: string;
  id: string;
  createdAt: string;
  model: string;
  item: string;
  category: string;
};

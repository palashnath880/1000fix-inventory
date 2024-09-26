import instance from "./config";

type ScrapCreate = {
  note?: string;
  from: "defective" | "faulty";
  items: { skuCodeId: string; quantity: number }[];
};

const scrapApi = {
  create: (data: ScrapCreate) => instance.post(`/scrap`, data),
};

export default scrapApi;

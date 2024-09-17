import { useState } from "react";
import { OwnStockType } from "../../../types/types";
import { useAppDispatch, useAppSelector } from "../../../hooks";

export default function SendStock() {
  // states
  const [ownStock, setOwnStock] = useState<OwnStockType | null>(null);
  const [stockLoading, setStockLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [transferList, setTransferList] = useState<StockTransferInputs[]>([]);

  // react redux
  const { data: users } = useAppSelector((state) => state.users);
  const { data: skuCodes } = useAppSelector((state) => state.skuCodes);
  const engineers = users.filter((i) => i.role === "engineer");
  const dispatch = useAppDispatch();

  return (
    <div className="pb-10">
      <div className="flex items-start gap-5">{/* stock add form */}</div>
    </div>
  );
}

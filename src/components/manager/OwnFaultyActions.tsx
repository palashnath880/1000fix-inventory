/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { OwnStockType } from "../../types/types";
import { toast } from "react-toastify";

type OwnFaultyActionsProps = {
  stock: OwnStockType;
  good: {
    skuCodeId: string;
    quantity: number;
    maxQuantity: number;
    error: boolean;
  }[];
  scrap: {
    skuCodeId: string;
    quantity: number;
    maxQuantity: number;
    error: boolean;
  }[];
  setScrap: any;
  setGood: any;
};

export default function OwnFaultyActions({
  stock,
  good,
  scrap,
  setGood,
  setScrap,
}: OwnFaultyActionsProps) {
  // check is has in the good and scrap
  const isGood = good.find((i) => i.skuCodeId === stock.skuCode.id);
  const isScrap = scrap.find((i) => i.skuCodeId === stock.skuCode.id);
  const isError =
    isGood && isScrap && isGood.quantity + isScrap.quantity > stock.quantity;
  const quantity = (isGood?.quantity || 0) + (isScrap?.quantity || 0); // available quantity

  // on checked
  const onChecked = (type: "good" | "scrap", checked: boolean) => {
    if (checked) {
      const obj = {
        skuCodeId: stock.skuCode.id,
        maxQuantity: stock.quantity,
        quantity: 1,
      };
      if (type === "scrap") {
        setScrap((state: any) => [...state, obj]);
      } else {
        setGood((state: any) => [...state, obj]);
      }
    } else {
      if (type === "good") {
        setGood((state: any) =>
          state.filter((i: any) => i.skuCodeId !== stock.skuCode.id)
        );
      } else {
        setScrap((state: any) =>
          state.filter((i: any) => i.skuCodeId !== stock.skuCode.id)
        );
      }
    }
  };

  // quantity changed
  const onChange = (type: "good" | "scrap", value: string) => {
    if (quantity < parseInt(value)) {
      toast.error(`Invalid quantity`);
      return;
    }
    if (type === "good") {
      const list = good.map((i) =>
        i.skuCodeId && stock.skuCode.id
          ? { ...i, quantity: parseInt(value) }
          : i
      );
      setGood(list);
    } else {
      const list = scrap.map((i) =>
        i.skuCodeId && stock.skuCode.id
          ? { ...i, quantity: parseInt(value) }
          : i
      );
      setScrap(list);
    }
  };

  return (
    <span className="flex justify-end gap-2">
      <span className="flex items-center justify-end">
        <FormControlLabel
          label="Good"
          checked={!!isGood}
          control={
            <Checkbox
              size="small"
              onChange={(e) => onChecked("good", e.target.checked)}
            />
          }
        />
        <TextField
          type="number"
          size="small"
          sx={{ width: 80 }}
          value={(isGood && isGood.quantity) || 0}
          disabled={!isGood}
          onChange={(e) => onChange("good", e.target.value)}
          error={isGood ? isError || isGood.error : false}
        />
      </span>
      <span className="flex items-center justify-end">
        <FormControlLabel
          label="Scrap"
          checked={!!isScrap}
          control={
            <Checkbox
              size="small"
              onChange={(e) => onChecked("scrap", e.target.checked)}
            />
          }
        />
        <TextField
          type="number"
          size="small"
          sx={{ width: 80 }}
          value={(isScrap && isScrap.quantity) || 0}
          disabled={!isScrap}
          onChange={(e) => onChange("scrap", e.target.value)}
          error={isScrap ? isError || isScrap.error : false}
        />
      </span>
    </span>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete, TextField } from "@mui/material";
import { useAppSelector } from "../../hooks";
import { OwnStockType, SKUCode } from "../../types/types";
import { useState } from "react";
import engineerStockApi from "../../api/engineerStock";
import { toast } from "react-toastify";

type SkuCodeSelectProps = {
  value: SKUCode | null;
  onChange: (skuCode: SKUCode | null) => void;
  onStock: (ownStock: OwnStockType | null) => void;
  error: any;
};

export default function SkuCodeSelect({
  value,
  onChange,
  onStock,
  error,
}: SkuCodeSelectProps) {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // react redux
  const { data: skuCodes } = useAppSelector((state) => state.skuCodes);
  const { user } = useAppSelector((state) => state.auth);

  // fetch stock by sku id
  const stockBySkuId = async (skuId: string | undefined) => {
    if (!skuId) {
      onStock(null);
      return;
    }
    try {
      setIsLoading(true);
      const res = await engineerStockApi.stockBySku(
        user?.id || "",
        skuId || ""
      );
      if (res?.data && typeof res?.data === "object") {
        const stock: OwnStockType = res?.data;
        onStock(stock);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Sorry! Something went wrong.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Autocomplete
      options={skuCodes}
      value={value || null}
      disabled={isLoading}
      onChange={(_, val) => {
        stockBySkuId(val?.id || "");
        onChange(val);
      }}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      getOptionLabel={(opt) => opt.name}
      noOptionsText="No sku matched"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select sku code"
          placeholder="Select sku code"
          error={Boolean(error)}
        />
      )}
    />
  );
}
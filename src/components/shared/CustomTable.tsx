import { TableCell } from "@mui/material";
import type { SKUCode } from "../../types/types";

export const SkuTable = ({
  isHeader,
  skuCode,
  quantity,
}: {
  isHeader?: boolean;
  skuCode?: SKUCode | null;
  quantity?: number | boolean;
}) => {
  if (isHeader) {
    return (
      <>
        <TableCell>Category</TableCell>
        <TableCell>Model</TableCell>
        <TableCell>Item</TableCell>
        <TableCell>SKU</TableCell>
        <TableCell>UOM</TableCell>
        {quantity && <TableCell>Quantity</TableCell>}
      </>
    );
  }

  return (
    <>
      <TableCell>{skuCode?.item?.model?.category?.name}</TableCell>
      <TableCell>{skuCode?.item?.model?.name}</TableCell>
      <TableCell>{skuCode?.item?.name}</TableCell>
      <TableCell>{skuCode?.name}</TableCell>
      <TableCell>{skuCode?.item?.uom}</TableCell>
      {quantity && <TableCell>{quantity}</TableCell>}
    </>
  );
};

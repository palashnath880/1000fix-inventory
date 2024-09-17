/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField } from "@mui/material";

export default function QuantitySelector({
  error,
  params,
}: {
  error: boolean;
  params: any;
}) {
  return (
    <TextField
      fullWidth
      type="text"
      label="Quantity"
      placeholder="Quantity"
      error={error}
      {...params}
    />
  );
}

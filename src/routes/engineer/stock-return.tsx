import { Typography } from "@mui/material";
import StockReturnForm from "../../components/engineer/StockReturnForm";

export default function StockReturn() {
  return (
    <div className="pb-10">
      <Typography variant="h6">Stock Return</Typography>

      <StockReturnForm />
    </div>
  );
}

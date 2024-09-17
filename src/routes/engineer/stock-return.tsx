import { Typography } from "@mui/material";
import StockReturnForm from "../../components/engineer/StockReturnForm";
import ReturnReport from "../../components/engineer/ReturnReport";

export default function StockReturn() {
  return (
    <div className="pb-10">
      <Typography variant="h6">Stock Return</Typography>

      <StockReturnForm />

      <ReturnReport report="return" />
    </div>
  );
}

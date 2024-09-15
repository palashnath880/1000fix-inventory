import { Button } from "@mui/material";
import { StockType } from "../../types/types";
import { useState } from "react";
import { toast } from "react-toastify";
import stockApi from "../../api/stock";

export default function ApprovalAction({
  stock,
  refetch,
}: {
  stock: StockType;
  refetch: () => void;
}) {
  // state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // status handler
  const statusHandler = async (status: "approved") => {
    try {
      setIsLoading(true);
      await stockApi.statusUpdate(stock.id, { status });
      refetch();
      toast.success(`Stock approved.`);
    } catch (err) {
      console.error(err);
      toast.error("Sorry! Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <span className="flex items-center gap-3">
      <Button
        variant="contained"
        color="success"
        disabled={isLoading}
        onClick={() => statusHandler("approved")}
      >
        Approved
      </Button>

      {/* reject button */}
    </span>
  );
}

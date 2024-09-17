import {
  Button,
  Dialog,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import engineerStockApi from "../../api/engineerStock";
import { StockType } from "../../types/types";
import PopupState, { bindDialog, bindTrigger } from "material-ui-popup-state";

export default function StockActions({
  stock,
  refetch,
}: {
  stock: StockType;
  refetch: () => void;
}) {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  // status handler
  const statusHandler = async (
    status: "received" | "rejected",
    close?: () => void | null
  ) => {
    try {
      setIsLoading(true);
      await engineerStockApi.update(stock.id, { status, note: reason || null });
      refetch();
      toast.success(`Stock ${status}`);
      if (typeof close === "function") close();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error?.response?.data?.message || "Sorry! Something went wrong";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-5 pb-4 px-3">
      <Button
        variant="contained"
        color="success"
        className="!flex-1"
        disabled={isLoading}
        onClick={() => statusHandler("received")}
      >
        Receive
      </Button>
      <PopupState variant="popover">
        {(popupState) => (
          <>
            <Button
              variant="contained"
              color="error"
              className="!flex-1"
              disabled={isLoading}
              {...bindTrigger(popupState)}
            >
              Reject
            </Button>
            <Dialog {...bindDialog(popupState)}>
              <Paper className="!px-5 !py-5 !w-[96vw] !max-w-[400px]">
                <Typography>Write reject reason</Typography>
                <TextField
                  fullWidth
                  placeholder="Reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <Divider className="!my-3" />
                <div className="flex items-center gap-3">
                  <Button
                    variant="contained"
                    color="success"
                    className="!flex-1"
                    onClick={() => statusHandler("rejected", popupState.close)}
                    disabled={Boolean(!reason) || isLoading}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    className="!flex-1"
                    onClick={popupState.close}
                    disabled={isLoading}
                  >
                    Reject
                  </Button>
                </div>
              </Paper>
            </Dialog>
          </>
        )}
      </PopupState>
    </div>
  );
}

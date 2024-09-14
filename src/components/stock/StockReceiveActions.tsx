import {
  Button,
  Divider,
  Paper,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { StockType } from "../../types/types";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import stockApi from "../../api/stock";
import { toast } from "react-toastify";

export default function StockReceiveActions({
  stock,
  refetch,
}: {
  stock: StockType;
  refetch: () => void;
}) {
  // state
  const [updating, setUpdating] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  // stock receive reject handler
  const statusHandler = async (status: "received" | "rejected") => {
    try {
      setUpdating(true);
      await stockApi.statusUpdate(stock.id, { status, note: reason || null });
      refetch();
      toast.success(`Stock ${status} successfully`);
    } catch (err) {
      console.error(err);
      toast.error(`Sorry! Something went wrong`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <span className="flex justify-end gap-3 items-center">
      <Button
        variant="contained"
        color="success"
        disabled={updating}
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
              {...bindTrigger(popupState)}
            >
              Reject
            </Button>

            <Popover {...bindPopover(popupState)}>
              <Paper className="w-[300px] !px-4 !py-3">
                <Typography variant="subtitle1" className="!font-medium">
                  Write Reject Reason
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="Reject Reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <Divider className="!my-3" />
                <div className="flex items-center gap-3 justify-between">
                  <Button
                    variant="contained"
                    color="success"
                    className="!flex-1"
                    onClick={() => statusHandler("rejected")}
                    disabled={Boolean(!reason)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    className="!flex-1"
                    onClick={() => {
                      popupState.close();
                      setReason("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Paper>
            </Popover>
          </>
        )}
      </PopupState>
    </span>
  );
}

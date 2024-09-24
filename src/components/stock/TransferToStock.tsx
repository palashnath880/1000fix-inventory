import { MoveUp } from "@mui/icons-material";
import {
  Button,
  Divider,
  IconButton,
  Paper,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { useState } from "react";
import { OwnStockType } from "../../types/types";
import { toast } from "react-toastify";
import stockApi from "../../api/stock";

export default function TransferToStock({
  stock,
  refetch,
}: {
  stock: OwnStockType;
  refetch: () => void;
}) {
  // states
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  //popup state
  const popup = usePopupState({
    variant: "popover",
    popupId: "transferToStockPopup",
  });

  // transfer handler
  const transferHandler = async () => {
    if (quantity > stock.faulty) {
      toast.error("Invalid quantity");
      return;
    }
    try {
      setLoading(true);
      await stockApi.moveToStock({ skuCodeId: stock.skuCode.id, quantity });
      refetch();
      popup.close();
      toast.success(`Transferred to good stock.`);
    } catch (err) {
      console.error(err);
      toast.error("Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Faulty to Good Stock">
        <IconButton {...bindTrigger(popup)} color="primary">
          <MoveUp />
        </IconButton>
      </Tooltip>

      {/* popover */}
      <Popover {...bindPopover(popup)}>
        <Paper className="!px-4 !py-4">
          <Typography variant="body1" className="!font-semibold">
            Transfer faulty to good stock
          </Typography>
          <Divider className="!my-3" />
          <TextField
            size="small"
            placeholder="Transfer Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <div className="flex items-center gap-4 mt-4">
            <Button
              color="success"
              className="!flex-1"
              disabled={
                !quantity || quantity <= 0 || stock.faulty < quantity || loading
              }
              onClick={transferHandler}
            >
              Transfer
            </Button>
            <Button
              color="error"
              className="!flex-1"
              onClick={popup.close}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </Paper>
      </Popover>
    </>
  );
}

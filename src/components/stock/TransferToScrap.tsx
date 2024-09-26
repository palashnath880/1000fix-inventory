import { Delete } from "@mui/icons-material";
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

export default function TransferToScrap({
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

  // scrap handler
  const scrapHandler = async () => {
    if (quantity > stock.faulty) {
      toast.error("Invalid quantity");
      return;
    }
    try {
      setLoading(true);
      await stockApi.moveToScrap({
        list: [{ skuCodeId: stock.skuCode.id, quantity }],
      });
      refetch();
      popup.close();
      toast.success(`Scraped done`);
    } catch (err) {
      console.error(err);
      toast.error("Sorry! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Faulty to Scrap">
        <IconButton {...bindTrigger(popup)} color="primary">
          <Delete />
        </IconButton>
      </Tooltip>

      {/* popover */}
      <Popover {...bindPopover(popup)}>
        <Paper className="!px-4 !py-4">
          <Typography variant="body1" className="!font-semibold">
            Scrap Faulty Stock
          </Typography>
          <Divider className="!my-3" />
          <TextField
            size="small"
            placeholder="Scrap Quantity"
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
              onClick={scrapHandler}
            >
              Scrap
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

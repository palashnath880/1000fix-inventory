import { KeyboardReturn } from "@mui/icons-material";
import { Button, Dialog, IconButton, TextField } from "@mui/material";
import PopupState, { bindDialog, bindTrigger } from "material-ui-popup-state";
import { useState } from "react";
import { toast } from "react-toastify";
import { OwnStockType } from "../../types/types";
import engineerStockApi from "../../api/engineerStock";

export default function DefectiveReturn({
  refetch,
  stock,
}: {
  refetch: () => void;
  stock: OwnStockType;
}) {
  // states
  const [quantity, setQuantity] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(false);

  // defective return
  const sendDefective = async (close: () => void) => {
    if (quantity > stock.defective) {
      toast.error(`Invalid quantity`);
      return;
    }
    try {
      setDisabled(true);
      await engineerStockApi.sendDefective({
        quantity: quantity,
        skuCodeId: stock.skuCode.id,
      });
      refetch();
      close();
      setQuantity(0);
      toast.success(`Defective returned`);
    } catch (err) {
      console.error(err);
      toast.error(`Sorry! Something went wrong`);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <PopupState variant="popover">
      {(popup) => (
        <>
          <IconButton color="primary" {...bindTrigger(popup)}>
            <KeyboardReturn />
          </IconButton>
          <Dialog
            {...bindDialog(popup)}
            PaperProps={{ className: "!mx-0 !w-[92vw]" }}
          >
            <div className="!px-5 !py-6 w-full">
              <TextField
                fullWidth
                label="Defective Quantity"
                placeholder="Quantity"
                type="number"
                value={quantity || 0}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
              <div className="mt-4 flex items-center gap-3">
                <Button
                  className="!flex-1"
                  color="success"
                  disabled={disabled}
                  onClick={() => sendDefective(popup.close)}
                >
                  Send Defective
                </Button>
                <Button className="!flex-1" color="error" onClick={popup.close}>
                  Cancel
                </Button>
              </div>
            </div>
          </Dialog>
        </>
      )}
    </PopupState>
  );
}

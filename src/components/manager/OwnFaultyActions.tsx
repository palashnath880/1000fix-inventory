/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Popover, TextField } from "@mui/material";
import { OwnStockType } from "../../types/types";
import { toast } from "react-toastify";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { useState } from "react";

type OwnFaultyActionsProps = {
  stock: OwnStockType;
  good: {
    skuCodeId: string;
    quantity: number;
    maxQuantity: number;
    error: boolean;
  }[];
  scrap: {
    skuCodeId: string;
    quantity: number;
    maxQuantity: number;
    error: boolean;
  }[];
  setScrap: any;
  setGood: any;
};

export default function OwnFaultyActions({
  stock,
  good,
  scrap,
  setGood,
  setScrap,
}: OwnFaultyActionsProps) {
  // states
  const [quantity, setQuantity] = useState<number>(0);

  // check is has in the good and scrap
  const isGood = good.find((i) => i.skuCodeId === stock.skuCode.id);
  const isScrap = scrap.find((i) => i.skuCodeId === stock.skuCode.id);
  const available = (isGood?.quantity || 0) + (isScrap?.quantity || 0); // available quantity

  const addToGood = () => {
    if (quantity > 0) {
      toast.error(`Invalid quantity`);
      return;
    }
    setGood();
  };

  const addToScrap = () => {
    if (quantity > 0) {
      toast.error(`Invalid quantity`);
      return;
    }
    setScrap();
  };

  return (
    <span className="flex flex-col gap-2 !w-max ml-auto">
      <PopupState variant="popover">
        {(popup) => (
          <>
            <Button color="success" {...bindTrigger(popup)}>
              Add To Good List
            </Button>
            <Popover
              {...bindPopover(popup)}
              slotProps={{ paper: { className: "px-4 py-4" } }}
            >
              <div className="flex flex-col">
                <TextField
                  type="number"
                  placeholder="Quantity"
                  size="small"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    color="success"
                    className="!flex-1"
                    onClick={addToGood}
                    disabled={quantity <= 0 || available <= 0}
                  >
                    Add
                  </Button>
                  <Button
                    color="error"
                    className="!flex-1"
                    onClick={popup.close}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Popover>
          </>
        )}
      </PopupState>
      <PopupState variant="popover">
        {(popup) => (
          <>
            <Button color="error" {...bindTrigger(popup)}>
              Add To Scrap List
            </Button>
            <Popover
              {...bindPopover(popup)}
              slotProps={{ paper: { className: "px-4 py-4" } }}
            >
              <div className="flex flex-col">
                <TextField
                  type="number"
                  placeholder="Quantity"
                  size="small"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    color="success"
                    className="!flex-1"
                    disabled={quantity <= 0 || available <= 0}
                    onClick={addToScrap}
                  >
                    Add
                  </Button>
                  <Button
                    color="error"
                    className="!flex-1"
                    onClick={popup.close}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Popover>
          </>
        )}
      </PopupState>
    </span>
  );
}

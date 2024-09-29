/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Popover, TextField } from "@mui/material";
import { OwnStockType, SKUCode } from "../../types/types";
import { toast } from "react-toastify";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { useState } from "react";

type OwnFaultyActionsProps = {
  stock: OwnStockType;
  good: {
    skuCodeId: string;
    quantity: number;
    skuCode: SKUCode;
  }[];
  scrap: {
    skuCodeId: string;
    quantity: number;
    skuCode: SKUCode;
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
  const available =
    stock.faulty - ((isGood?.quantity || 0) + (isScrap?.quantity || 0)); // available quantity

  // add item to good stock list
  const addToGood = (close: () => void) => {
    if (available < quantity) {
      toast.error(`Invalid quantity`);
      return;
    }
    const goodList = [...good].map((i) => {
      return i.skuCodeId === stock.skuCode.id
        ? { ...i, quantity: i.quantity + quantity }
        : i;
    });
    if (!goodList.find((i) => i.skuCodeId === stock.skuCode.id)) {
      goodList.push({
        skuCodeId: stock.skuCode.id,
        quantity: quantity,
        skuCode: stock.skuCode,
      });
    }
    console.log(goodList);
    setGood(goodList);
    setQuantity(0);
    close();
  };

  // add item to scrap list
  const addToScrap = (close: () => void) => {
    if (available < quantity) {
      toast.error(`Invalid quantity`);
      return;
    }
    const scrapList = [...scrap].map((i) => {
      return i.skuCodeId === stock.skuCode.id
        ? { ...i, quantity: i.quantity + quantity }
        : i;
    });
    if (!scrapList.find((i) => i.skuCodeId === stock.skuCode.id)) {
      scrapList.push({
        skuCodeId: stock.skuCode.id,
        quantity: quantity,
        skuCode: stock.skuCode,
      });
    }
    setScrap(scrapList);
    setQuantity(0);
    close();
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
                  disabled={available <= 0}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    color="success"
                    className="!flex-1"
                    onClick={() => addToGood(popup.close)}
                    disabled={!quantity || quantity <= 0 || available <= 0}
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
                  disabled={available <= 0}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    color="success"
                    className="!flex-1"
                    disabled={!quantity || quantity <= 0 || available <= 0}
                    onClick={() => addToScrap(popup.close)}
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

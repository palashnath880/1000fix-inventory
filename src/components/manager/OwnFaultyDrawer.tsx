import { Clear, Delete, MoveDown, MoveUp } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Button,
  Drawer,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SKUCode } from "../../types/types";
import { toast } from "react-toastify";
import stockApi from "../../api/stock";
import scrapApi from "../../api/scrap";

type OwnFaultyDrawerProps = {
  open: boolean;
  close: () => void;
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
  clear: (p: { type: "good" | "scrap" }) => void;
  remove: (p: { type: "good" | "scrap"; skuId: string }) => void;
  refetch: () => void;
};

export default function OwnFaultyDrawer({
  open,
  close,
  good,
  scrap,
  clear,
  remove,
  refetch,
}: OwnFaultyDrawerProps) {
  // states
  const [tab, setTab] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(false);

  // transfer to stock
  const moveToGood = async () => {
    try {
      setDisabled(true);
      const list = good.map((i) => ({
        quantity: i.quantity,
        skuCodeId: i.skuCodeId,
      }));
      await stockApi.moveToStock({ list });
      toast.success(`Faulty stock moved to good stock.`);
      clear({ type: "good" });
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(`Sorry! Something went wrong`);
    } finally {
      setDisabled(false);
    }
  };

  // transfer to scrap
  const moveToScrap = async () => {
    try {
      setDisabled(true);
      const list = scrap.map((i) => ({
        quantity: i.quantity,
        skuCodeId: i.skuCodeId,
      }));
      await scrapApi.create({ from: "faulty", items: list });
      toast.success(`Faulty stock moved to scrap.`);
      clear({ type: "scrap" });
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(`Sorry! Something went wrong`);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <div className=" max-sm:w-[96vw] sm:w-[380px] h-full flex flex-col">
        <AppBar position="static">
          <Tabs
            value={tab}
            onChange={(_, val) => setTab(val)}
            variant="fullWidth"
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label="Move to Good" className="!capitalize !text-white" />
            <Tab label="Move to Scrap" className="!capitalize !text-white" />
          </Tabs>
        </AppBar>
        <div className="flex flex-col flex-1">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col h-full">
              <Paper className="px-4 py-3 border-b">
                <Typography className="!text-base !font-semibold">
                  {!tab ? "Move to Good List" : "Move to Scrap List"}
                </Typography>
              </Paper>
              <div className="flex flex-col py-5 h-full overflow-y-auto px-4">
                {/* empty message show */}
                {tab
                  ? scrap.length <= 0 && (
                      <Alert severity="error">Empty scrap list</Alert>
                    )
                  : good.length <= 0 && (
                      <Alert severity="error">Empty good list</Alert>
                    )}

                {/* item display */}
                {tab
                  ? scrap.map((item, index) => (
                      <Paper
                        key={index}
                        className="!flex !items-center !p-2 mb-3"
                        elevation={3}
                      >
                        <div className="flex-1">
                          <Typography variant="body2">
                            Item: {item.skuCode?.item?.name}
                          </Typography>
                          <Typography variant="body2">
                            SKU Code: {item?.skuCode?.name}
                          </Typography>
                          <Typography variant="body2">
                            Quantity: {item.quantity}
                          </Typography>
                        </div>
                        <IconButton
                          color="error"
                          onClick={() =>
                            remove({ type: "scrap", skuId: item.skuCodeId })
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Paper>
                    ))
                  : good.map((item, index) => (
                      <Paper
                        key={index}
                        className="!flex !items-center !p-2 mb-3"
                        elevation={3}
                      >
                        <div className="flex-1">
                          <Typography variant="body2">
                            Item: {item.skuCode?.item?.name}
                          </Typography>
                          <Typography variant="body2">
                            SKU Code: {item?.skuCode?.name}
                          </Typography>
                          <Typography variant="body2">
                            Quantity: {item.quantity}
                          </Typography>
                        </div>
                        <IconButton
                          color="error"
                          onClick={() =>
                            remove({ type: "good", skuId: item.skuCodeId })
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Paper>
                    ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 py-3 px-4 border-t border-primary">
            {tab ? (
              <>
                <Button
                  color="success"
                  className="!flex-1"
                  startIcon={<MoveDown />}
                  onClick={moveToScrap}
                >
                  Move to Scrap
                </Button>
                <Button
                  color="info"
                  className="!flex-1"
                  startIcon={<Clear />}
                  onClick={() => clear({ type: "scrap" })}
                  disabled={scrap.length <= 0}
                >
                  Clear Scrap List
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="success"
                  className="!flex-1"
                  startIcon={<MoveUp />}
                  onClick={moveToGood}
                  disabled={disabled}
                >
                  Move to Good
                </Button>
                <Button
                  color="info"
                  className="!flex-1"
                  startIcon={<Clear />}
                  onClick={() => clear({ type: "good" })}
                  disabled={good.length <= 0}
                >
                  Clear Good List
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

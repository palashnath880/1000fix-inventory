import { Clear, Delete, MoveUp } from "@mui/icons-material";
import {
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

type OwnFaultyDrawerProps = {
  open: boolean;
  close: () => void;
};

export default function OwnFaultyDrawer({ open, close }: OwnFaultyDrawerProps) {
  // states
  const [tab, setTab] = useState<number>(0);

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
                <Paper className="!flex !items-center !p-2" elevation={3}>
                  <div className="flex-1">
                    <Typography variant="body2">Item: 1209</Typography>
                    <Typography variant="body2">SKU Code: 1209</Typography>
                    <Typography variant="body2">Quantity: 1209</Typography>
                  </div>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </Paper>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 py-3 px-4 border-t border-primary">
            <Button color="success" className="!flex-1" startIcon={<MoveUp />}>
              {!tab ? "Move to Good" : "Move to Scrap"}
            </Button>
            <Button color="info" className="!flex-1" startIcon={<Clear />}>
              {!tab ? "Clear Good List" : "Clear Scrap List"}
            </Button>
          </div>
        </div>

        {/* <span className="absolute top-0 -left-2">
          <Close />
        </span> */}
      </div>
    </Drawer>
  );
}

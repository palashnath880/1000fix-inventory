import { Delete } from "@mui/icons-material";
import { Button, IconButton, Popover, Typography } from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import React from "react";

type DeleteConfirmProps = {
  title: React.ReactNode;
  confirm: () => void;
};

export default function DeleteConfirm({ title, confirm }: DeleteConfirmProps) {
  return (
    <PopupState variant="popover">
      {(popupState) => (
        <>
          <IconButton color="error" {...bindTrigger(popupState)}>
            <Delete />
          </IconButton>
          <Popover {...bindPopover(popupState)}>
            <div className="px-5 py-5 w-[250px] flex flex-col items-center">
              <Typography variant="subtitle1" className="!text-center">
                {title}
              </Typography>
              <div className="flex items-center gap-2 w-full mt-2">
                <Button
                  variant="contained"
                  color="success"
                  className="!flex-1"
                  onClick={() => typeof confirm === "function" && confirm()}
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  className="!flex-1"
                  onClick={popupState.close}
                >
                  No
                </Button>
              </div>
            </div>
          </Popover>
        </>
      )}
    </PopupState>
  );
}

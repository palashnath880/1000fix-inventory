/* eslint-disable @typescript-eslint/no-explicit-any */
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { AxiosErr, User } from "../../types/types";
import {
  Button,
  IconButton,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { LockReset } from "@mui/icons-material";
import { toast } from "react-toastify";
import userApi from "../../api/user";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchUsers } from "../../features/userSlice";
import { fetchBranch } from "../../features/utilsSlice";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import DeleteConfirm from "../shared/DeleteConfirm";

type ResetQuery = { id: string; password: string; close: () => void };

export default function UserActions({ user }: { user: User }) {
  // states
  const [pwd, setPwd] = useState<string>("");

  const auth = useAppSelector((state) => state.auth);
  // dispatch
  const dispatch = useAppDispatch();

  // delete user handler
  const deleteUser = useMutation<any, AxiosErr, User>({
    mutationFn: ({ id }) => userApi.delete(id),
    onSuccess: (_, { name }) => {
      toast.success(`${name} deleted successfully`);
      dispatch(fetchUsers(""));
      dispatch(fetchBranch(""));
    },
    onError: (_, { name }) => toast.error(`Sorry! ${name} couldn't be deleted`),
  });

  // update password handler
  const updatePwd = useMutation<any, AxiosErr, ResetQuery>({
    mutationFn: ({ id, password }) => userApi.resetPwd({ id, password }),
    onSuccess: (_, { close }) => {
      toast.success(`Password updated`);
      close();
    },
    onError: (err) => {
      const msg = err.response?.data.message || "Sorry! Something went wrong";
      toast.error(msg);
    },
  });

  if (user?.id === auth?.user?.id) {
    return <></>;
  }

  return (
    <span className="flex justify-end gap-2">
      {/* update password */}
      <PopupState variant="popover">
        {(popup) => (
          <>
            <Tooltip title="Update Password">
              <IconButton color="primary" {...bindTrigger(popup)}>
                <LockReset />
              </IconButton>
            </Tooltip>

            <Popover
              {...bindPopover(popup)}
              anchorOrigin={{ horizontal: "left", vertical: "center" }}
              transformOrigin={{ horizontal: "right", vertical: "center" }}
              slotProps={{
                paper: { className: `px-4 py-3 flex flex-col gap-3` },
              }}
            >
              <Typography>Are you sure to reset password?</Typography>
              <TextField
                fullWidth
                type="text"
                placeholder="Password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() =>
                    updatePwd.mutate({
                      id: user.id,
                      password: pwd,
                      close: popup.close,
                    })
                  }
                  disabled={updatePwd.isPending || !pwd}
                >
                  Yes
                </Button>
                <Button
                  color="error"
                  className="flex-1"
                  onClick={popup.close}
                  disabled={updatePwd.isPending}
                >
                  Cancel
                </Button>
              </div>
            </Popover>
          </>
        )}
      </PopupState>

      {/* delete user */}
      <DeleteConfirm
        title={
          <Typography variant="subtitle1" className="!text-center">
            Are you sure to delete <b>{user.name}</b>
          </Typography>
        }
        confirm={() => deleteUser.mutate(user)}
      />
    </span>
  );
}

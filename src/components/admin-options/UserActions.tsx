import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { User } from "../../types/types";
import { Button, IconButton, Popover, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import userApi from "../../api/user";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchUsers } from "../../features/userSlice";
import { fetchBranch } from "../../features/utilsSlice";

export default function UserActions({ user }: { user: User }) {
  const auth = useAppSelector((state) => state.auth);
  // dispatch
  const dispatch = useAppDispatch();

  // delete handler
  const deleteHandler = async () => {
    const toastId = toast.loading(`Deleting ${user.name}`);
    try {
      await userApi.delete(user.id);
      toast.update(toastId, {
        type: "success",
        render: `${user.name} deleted successfully`,
        isLoading: false,
        autoClose: 3000,
      });
      dispatch(fetchUsers(""));
      dispatch(fetchBranch(""));
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        type: "error",
        render: `Sorry! ${user.name} couldn't be deleted`,
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (user?.id === auth?.user?.id) {
    return <></>;
  }

  return (
    <span className="flex justify-end gap-2">
      <PopupState variant="popover">
        {(popupState) => (
          <>
            <IconButton color="error" {...bindTrigger(popupState)}>
              <Delete />
            </IconButton>
            <Popover {...bindPopover(popupState)}>
              <div className="px-5 py-5 w-[250px] flex flex-col items-center">
                <Typography variant="subtitle1" className="!text-center">
                  Are you sure to delete <b>{user.name}</b>
                </Typography>
                <div className="flex items-center gap-2 w-full mt-2">
                  <Button
                    variant="contained"
                    color="success"
                    className="!flex-1"
                    onClick={deleteHandler}
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
    </span>
  );
}

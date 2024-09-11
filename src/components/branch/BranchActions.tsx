/* eslint-disable @typescript-eslint/no-explicit-any */
import PopupState, {
  bindDialog,
  bindPopover,
  bindTrigger,
} from "material-ui-popup-state";
import type { Branch, User } from "../../types/types";
import {
  Autocomplete,
  Button,
  Dialog,
  IconButton,
  Paper,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close, Delete, Edit } from "@mui/icons-material";
import branchApi from "../../api/branch";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchBranch } from "../../features/branchSlice";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { isArraysMatched } from "../../utils/utils";
import { fetchUsers } from "../../features/userSlice";

type UpdateInputs = {
  address: string;
  users: User[];
};

export default function BranchActions({ branch }: { branch: Branch }) {
  // states
  const [isAnyChanged, setIsAnyChanged] = useState<boolean>(false);

  // users
  const { data: users } = useAppSelector((state) => state.users);
  const managers = users.filter((us) => us.role === "manager" && !us.branch);

  // dispatch
  const dispatch = useAppDispatch();

  // react hook form
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<UpdateInputs>();

  // delete handler
  const deleteHandler = async () => {
    if (!branch) return;
    const toastId: any = toast.loading(`Deleting ${branch.name} branch`);
    try {
      await branchApi.delete(branch.id);
      toast.update(toastId, {
        render: `${branch.name} branch deleted`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      dispatch(fetchBranch("")); // fetch branches
      dispatch(fetchUsers(""));
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: `Sorry! ${branch.name} couldn't be deleted`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  // branch update handler
  const updateHandler: SubmitHandler<UpdateInputs> = async (data) => {
    if (!isAnyChanged) return;
    const toastId = toast.loading(`Updating branch`);
    try {
      const branchUsers = data.users.map((i) => i.id);
      const newData: { address: string; users: string[] } = {
        address: data.address,
        users: branchUsers,
      };
      await branchApi.update(branch.id, newData);
      toast.update(toastId, {
        type: "success",
        render: `${branch.name} branch updated.`,
        isLoading: false,
        autoClose: 3000,
      });
      dispatch(fetchBranch(""));
      dispatch(fetchUsers(""));
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        type: "error",
        render: `Sorry! ${branch.name} couldn't be updated`,
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // check any data of branch
  useEffect(() => {
    // set initial value
    if (branch.address) {
      setValue("address", branch.address);
    }
    if (Array.isArray(branch.users)) {
      const filteredUser = users.filter(
        (us) => !!branch.users.find((i) => i?.id === us.id)
      );
      setValue("users", filteredUser);
    } else {
      setValue("users", []);
    }

    // watch every react-hook-form field
    watch(({ address, users }) => {
      if (
        address !== branch.address ||
        !isArraysMatched(users || [], branch.users)
      ) {
        setIsAnyChanged(true);
      } else {
        setIsAnyChanged(false);
      }
    });
  }, [watch, branch, setValue, users]);

  return (
    <span className="flex justify-end gap-2">
      <PopupState variant="popover">
        {(popupState) => (
          <>
            <Tooltip title="Edit Branch Users">
              <IconButton color="primary" {...bindTrigger(popupState)}>
                <Edit />
              </IconButton>
            </Tooltip>

            <Dialog {...bindDialog(popupState)}>
              <Paper className="px-4 py-5 max-md:w-[95%] md:w-[450px]">
                <div className="flex items-center justify-between">
                  <Typography variant="h6">
                    Edit <b>{branch.name}</b> branch
                  </Typography>
                  <IconButton onClick={popupState.close}>
                    <Close />
                  </IconButton>
                </div>
                <form onSubmit={handleSubmit(updateHandler)} className="mt-4">
                  <div className="flex flex-col gap-4">
                    <TextField
                      type="text"
                      fullWidth
                      placeholder="Address"
                      label="Address"
                      error={Boolean(errors["address"])}
                      {...register("address", { required: true })}
                    />
                    <Controller
                      control={control}
                      name="users"
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Autocomplete
                          options={managers}
                          multiple
                          value={value || []}
                          onChange={(_, values) => onChange(values)}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          noOptionsText="No users matched"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(error)}
                              label="Select Branch Users"
                              placeholder="Select Branch Users"
                            />
                          )}
                        />
                      )}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={!isAnyChanged}
                    >
                      Update Branch
                    </Button>
                  </div>
                </form>
              </Paper>
            </Dialog>
          </>
        )}
      </PopupState>
      <PopupState variant="popover">
        {(popupState) => (
          <>
            <Tooltip title="Delete Branch">
              <IconButton color="error" {...bindTrigger(popupState)}>
                <Delete />
              </IconButton>
            </Tooltip>
            <Popover {...bindPopover(popupState)}>
              <div className="px-5 py-5 w-[250px] flex flex-col items-center">
                <Typography variant="subtitle1" className="!text-center">
                  Are you sure to delete <b>{branch.name}</b> branch
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

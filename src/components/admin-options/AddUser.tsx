/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Close, Info, PersonAdd } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import userApi from "../../api/user";
import { useAppDispatch } from "../../hooks";
import { fetchUsers } from "../../features/userSlice";
import { useMutation } from "@tanstack/react-query";
import { AxiosErr } from "../../types/types";
import {
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";

type Inputs = {
  name: string;
  email: string;
  role: "manager" | "engineer" | "";
  password: string;
};

export default function AddUser() {
  // states
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // popup state
  const popup = usePopupState({
    variant: "popover",
    popupId: "pwderr",
  });

  // react redux
  const dispatch = useAppDispatch();

  // react hook form
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const { password } = useWatch({ control });

  // is password is valid
  const isValid = password
    ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        password
      )
    : false;

  // handle close function
  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  // add user handler
  const addHandler = useMutation<any, AxiosErr, Inputs>({
    mutationFn: (data) => userApi.create(data),
    onSuccess: (_, user) => {
      handleClose();
      dispatch(fetchUsers(""));
      toast.success(`${user.name} added successfully`);
    },
  });
  // extract addHandler mutation object
  const { isPending, isError, error, mutate } = addHandler;

  return (
    <>
      <Button
        variant="contained"
        startIcon={<PersonAdd />}
        onClick={() => setIsOpen(true)}
      >
        Add User
      </Button>

      {/* user add Drawer */}
      <Drawer
        open={isOpen}
        onClose={handleClose}
        anchor="right"
        PaperProps={{
          className: `max-sm:max-w-[400px] md:w-[450px]`,
        }}
      >
        <div className="flex justify-between items-center px-4 py-2 shadow-md border-b">
          <Typography variant="h6">Add New User</Typography>
          <IconButton onClick={handleClose} color="primary">
            <Close />
          </IconButton>
        </div>
        <form
          className="mt-4 px-4 "
          onSubmit={handleSubmit((data) => mutate(data))}
        >
          <div className="flex flex-col gap-3">
            <TextField
              type="text"
              fullWidth
              placeholder="Name"
              label="Name"
              error={Boolean(errors["name"])}
              {...register("name", { required: true })}
            />
            <TextField
              type="email"
              fullWidth
              placeholder="Email"
              label="Email"
              error={Boolean(errors["email"])}
              {...register("email", { required: true })}
            />
            <TextField
              type="text"
              fullWidth
              placeholder="Password"
              label="Password"
              error={Boolean(errors["password"])}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        {...bindTrigger(popup)}
                        color={isValid ? "success" : "error"}
                      >
                        <Info />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...register("password", {
                required: true,
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
              })}
            />

            {/* role select input */}
            <FormControl fullWidth>
              <InputLabel id="role">Select Role</InputLabel>
              <Controller
                control={control}
                name="role"
                render={({ field, fieldState: { error } }) => (
                  <Select
                    labelId="role"
                    label="Select Role"
                    error={Boolean(error)}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <MenuItem value={""}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"manager"}>Manager</MenuItem>
                    <MenuItem value={"engineer"}>Engineer</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            {/* error message */}
            {isError && (
              <Typography variant="body2" className="!text-center text-red-500">
                {error.response?.data.message || "Sorry! Something went wrong"}
              </Typography>
            )}

            <Button
              type="submit"
              disabled={isPending}
              startIcon={!isPending && <Add />}
            >
              {isPending ? (
                <CircularProgress color="inherit" size={22} />
              ) : (
                "Add New User"
              )}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* password validation list display on popover */}
      <Popover
        {...bindPopover(popup)}
        anchorOrigin={{ horizontal: "left", vertical: "center" }}
        transformOrigin={{ horizontal: "right", vertical: "center" }}
        slotProps={{ paper: { className: `px-4 py-3` } }}
      >
        <ul className="list-decimal pl-3">
          <li className="text-sm text-primary">At least 6 character.</li>
          <li className="text-sm text-primary">
            At least one uppercase letter.
          </li>
          <li className="text-sm text-primary">
            At least one lowercase letter.
          </li>
          <li className="text-sm text-primary">At least one digit.</li>
          <li className="text-sm text-primary">
            At least one special character.
          </li>
        </ul>
      </Popover>
    </>
  );
}

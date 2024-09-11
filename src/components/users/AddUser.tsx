import { Add, Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import {
  bindDialog,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import userApi from "../../api/user";

type Inputs = {
  name: string;
  email: string;
  role: "manager" | "engineer" | "";
  password: string;
};

export default function AddUser() {
  // states
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // popup
  const addPopup = usePopupState({ variant: "popover", popupId: "addUser" });

  // role options
  const roles: { value: string; label: string }[] = [
    { value: "manager", label: "Manager" },
    { value: "engineer", label: "Engineer" },
  ];

  // react hook form
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  // add user handler
  const addHandler: SubmitHandler<Inputs> = async (data) => {
    try {
      setSubmitting(true);
      setErrorMsg("");
      await userApi.create(data);
      reset();
      toast.success(`User added successfully`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error?.response?.data?.message || "Sorry! Something went wrong";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        {...bindTrigger(addPopup)}
      >
        Add User
      </Button>

      <Dialog {...bindDialog(addPopup)}>
        <Paper className="px-4 py-5 max-sm:max-w-[400px] md:w-[450px]">
          <div className="flex justify-between items-center">
            <Typography variant="h6">Add New User</Typography>
            <IconButton onClick={addPopup.close}>
              <Close />
            </IconButton>
          </div>
          <form className="mt-4" onSubmit={handleSubmit(addHandler)}>
            <div className="flex flex-col gap-4">
              <TextField
                type="text"
                fullWidth
                placeholder="Name"
                label="Name"
                error={Boolean(errors["name"])}
                {...register("name", { required: true })}
              />
              <TextField
                type="text"
                fullWidth
                placeholder="Password"
                label="Password"
                error={Boolean(errors["password"])}
                {...register("password", { required: true })}
              />
              <TextField
                type="email"
                fullWidth
                placeholder="Email"
                label="Email"
                error={Boolean(errors["email"])}
                {...register("email", { required: true })}
              />
              <Controller
                control={control}
                name="role"
                render={({
                  fieldState: { error },
                  field: { value, onChange },
                }) => (
                  <Autocomplete
                    onChange={(_, val) => onChange(val?.value || "")}
                    value={roles.find((i) => i.value === value) || null}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, val) =>
                      option.value === val.value
                    }
                    options={roles}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Role"
                        error={Boolean(error)}
                      />
                    )}
                  />
                )}
              />

              {errorMsg && (
                <Typography
                  variant="body2"
                  className="!text-center text-red-500"
                >
                  {errorMsg}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitting}
              >
                {submitting ? (
                  <CircularProgress color="inherit" size={22} />
                ) : (
                  "Add New User"
                )}
              </Button>
            </div>
          </form>
        </Paper>
      </Dialog>
    </>
  );
}

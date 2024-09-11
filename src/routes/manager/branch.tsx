import { Add, Close } from "@mui/icons-material";
import {
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
import branchApi from "../../api/branch";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Inputs = {
  name: string;
  address: string;
};

export default function Branch() {
  // states
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  // add popup
  const addPopup = usePopupState({ variant: "popover", popupId: "addBranch" });

  // branch add handler
  const addHandler: SubmitHandler<Inputs> = async (data) => {
    try {
      setSubmitting(true);
      setErrorMsg("");
      await branchApi.create(data);
      toast.success(`Branch added successfully`);
      reset();
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
        startIcon={<Add />}
        variant="contained"
        {...bindTrigger(addPopup)}
      >
        Add Branch
      </Button>

      {/* loader*/}

      {/* add popup dialog */}
      <Dialog {...bindDialog(addPopup)}>
        <Paper className="px-4 py-5 max-sm:max-w-[400px] md:w-[450px]">
          <div className="flex justify-between items-center">
            <Typography variant="h6">Add New Branch</Typography>
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
                placeholder="Address"
                label="Address"
                error={Boolean(errors["address"])}
                {...register("address", { required: true })}
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
                  "Add New Branch"
                )}
              </Button>
            </div>
          </form>
        </Paper>
      </Dialog>
    </>
  );
}

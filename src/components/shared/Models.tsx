import { Add, Close, Delete } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  bindDialog,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import type { ModelInputs } from "../../types/reactHookForm.types";
import { useState } from "react";
import { AxiosError } from "axios";
import modelApi from "../../api/model";

export default function Models() {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // popup state
  const popup = usePopupState({ variant: "popover", popupId: "categories" });

  // react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<ModelInputs>();

  // add handler
  const addHandler: SubmitHandler<ModelInputs> = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      await modelApi.create(data);
      reset();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error?.response?.data?.message || "Sorry! Something went wrong";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" {...bindTrigger(popup)}>
        Models
      </Button>

      <Dialog {...bindDialog(popup)}>
        <Paper className="!py-5 w-[96%] sm:w-[500px]">
          <div className="flex justify-between gap-5 items-center px-4 pb-2 border-b">
            <Typography variant="h5">Models</Typography>
            <IconButton onClick={popup.close}>
              <Close />
            </IconButton>
          </div>
          <div className="pt-4 px-4">
            {/* model add form */}
            <form onSubmit={handleSubmit(addHandler)}>
              <div className="flex flex-col gap-4 mb-5">
                <TextField
                  label="Model Name"
                  fullWidth
                  type="text"
                  placeholder="Model Name"
                  error={Boolean(errors["name"])}
                  {...register("name", { required: true })}
                />

                <Controller
                  control={control}
                  name="category"
                  rules={{ required: true }}
                  render={({ fieldState: { error } }) => (
                    <Autocomplete
                      options={[]}
                      noOptionsText="No category found"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Category"
                          error={Boolean(error)}
                        />
                      )}
                    />
                  )}
                />

                {errorMsg && (
                  <Typography
                    variant="body2"
                    className="!text-center !text-red-400"
                  >
                    {errorMsg}
                  </Typography>
                )}
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  startIcon={<Add />}
                  disabled={isLoading}
                >
                  Add Category
                </Button>
              </div>
            </form>

            {/* model list */}
            <Paper>
              <div className="px-2 py-3">
                <Typography variant="h6">Model List</Typography>
              </div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>Category One</TableCell>
                    <TableCell>03.25.8611</TableCell>
                    <TableCell>
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </div>
        </Paper>
      </Dialog>
    </>
  );
}

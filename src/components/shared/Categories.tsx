import { Add, Close, Delete } from "@mui/icons-material";
import {
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
import { SubmitHandler, useForm } from "react-hook-form";
import type { CategoryInputs } from "../../types/reactHookForm.types";
import { useState } from "react";
import { AxiosError } from "axios";
import categoryApi from "../../api/category";

export default function Categories() {
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
  } = useForm<CategoryInputs>();

  // add handler
  const addHandler: SubmitHandler<CategoryInputs> = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      await categoryApi.create(data);
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
        Categories
      </Button>

      <Dialog {...bindDialog(popup)}>
        <Paper className="!py-5 w-[96%] sm:w-[500px]">
          <div className="flex justify-between gap-5 items-center px-4 pb-2 border-b">
            <Typography variant="h5">Categories</Typography>
            <IconButton onClick={popup.close}>
              <Close />
            </IconButton>
          </div>
          <div className="pt-4 px-4">
            {/* category add form */}
            <form onSubmit={handleSubmit(addHandler)}>
              <div className="flex flex-col gap-4 mb-5">
                <TextField
                  label="Category Name"
                  fullWidth
                  type="text"
                  placeholder="Category Name"
                  error={Boolean(errors["name"])}
                  {...register("name", { required: true })}
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

            {/* category list */}
            <Paper>
              <div className="px-2 py-3">
                <Typography variant="h6">Category List</Typography>
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

import { Add, Close, Delete } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  IconButton,
  Paper,
  Popover,
  Skeleton,
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
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import type { CategoryInputs } from "../../types/reactHookForm.types";
import { useState } from "react";
import { AxiosError } from "axios";
import categoryApi from "../../api/category";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchCategories } from "../../features/categorySlice";
import moment from "moment";
import PopupState from "material-ui-popup-state";
import { Category } from "../../types/types";

const DeleteAction = ({
  category,
  refetch,
}: {
  category: Category;
  refetch: () => void;
}) => {
  // category delete handler
  const deleteHandler = async () => {
    const toastId = toast.loading(`Deleting ${category.name}`);

    try {
      await categoryApi.delete(category.id);
      toast.update(toastId, {
        autoClose: 3000,
        type: "success",
        isLoading: false,
        render: `${category.name} deleted`,
      });
      refetch();
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        autoClose: 3000,
        type: "error",
        isLoading: false,
        render: `Sorry! ${category.name} couldn't be deleted`,
      });
    }
  };

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
                Are you sure to delete <b>{category.name}</b>
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
  );
};

export default function Categories() {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // dispatch
  const { data: categories, loading } = useAppSelector(
    (state) => state.categories
  );
  const dispatch = useAppDispatch();

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
      dispatch(fetchCategories());
      toast.success(`Category added successfully`);
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
        <Paper className="!py-5 w-[96%] sm:w-[500px] max-h-full flex flex-col overflow-hidden">
          <div className="flex justify-between gap-5 items-center px-4 pb-2 border-b">
            <Typography variant="h5">Categories</Typography>
            <IconButton onClick={popup.close}>
              <Close />
            </IconButton>
          </div>
          <div className="pt-4 px-4 flex flex-col flex-1 overflow-hidden gap-5">
            {/* category add form */}
            <form onSubmit={handleSubmit(addHandler)}>
              <div className="flex flex-col gap-4">
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
            <Paper className="!overflow-y-auto flex-1 overflow-hidden">
              <div className="px-2 py-3">
                <Typography variant="h6">Category List</Typography>
              </div>
              {loading && (
                <div className="">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton height={70} key={index} />
                  ))}
                </div>
              )}
              {!loading && (
                <>
                  {Array.isArray(categories) && categories.length > 0 ? (
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
                        {categories.map((category, index) => (
                          <TableRow key={category.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>
                              {moment(category.createdAt).format("ll")}
                            </TableCell>
                            <TableCell>
                              <DeleteAction
                                category={category}
                                refetch={() => dispatch(fetchCategories())}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Alert severity="error" icon={false}>
                      <Typography variant="body1">
                        No category available
                      </Typography>
                    </Alert>
                  )}
                </>
              )}
            </Paper>
          </div>
        </Paper>
      </Dialog>
    </>
  );
}

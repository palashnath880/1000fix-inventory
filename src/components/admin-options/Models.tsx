import { Add, Close } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  IconButton,
  Paper,
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
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import type { ModelInputs } from "../../types/reactHookForm.types";
import { useState } from "react";
import { AxiosError } from "axios";
import modelApi from "../../api/model";
import { useAppDispatch, useAppSelector } from "../../hooks";
import moment from "moment";
import { fetchModels } from "../../features/utilsSlice";
import { toast } from "react-toastify";
import { Model } from "../../types/types";
import DeleteConfirm from "../shared/DeleteConfirm";

export default function Models() {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  //  react redux
  const { data: models, loading } = useAppSelector(
    (state) => state.utils.models
  );
  const { data: categories } = useAppSelector(
    (state) => state.utils.categories
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
    control,
    setValue,
  } = useForm<ModelInputs>();

  // add handler
  const addHandler: SubmitHandler<ModelInputs> = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      await modelApi.create({
        name: data.name,
        categoryId: data?.category?.id || "",
      });
      toast.success(`Model added successfully`);
      reset();
      setValue("category", null);
      dispatch(fetchModels());
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error?.response?.data?.message || "Sorry! Something went wrong";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // category delete handler
  const deleteHandler = async (model: Model) => {
    const toastId = toast.loading(`Deleting ${model.name}`);

    try {
      await modelApi.delete(model.id);
      toast.update(toastId, {
        autoClose: 3000,
        type: "success",
        isLoading: false,
        render: `${model.name} deleted`,
      });
      dispatch(fetchModels());
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        autoClose: 3000,
        type: "error",
        isLoading: false,
        render: `Sorry! ${model.name} couldn't be deleted`,
      });
    }
  };

  return (
    <>
      <Button variant="contained" {...bindTrigger(popup)}>
        Models
      </Button>

      <Dialog {...bindDialog(popup)}>
        <Paper className="!py-5 w-[96%] sm:w-[500px] max-h-full flex flex-col overflow-hidden">
          <div className="flex justify-between gap-5 items-center px-4 pb-2 border-b">
            <Typography variant="h5">Models</Typography>
            <IconButton onClick={popup.close}>
              <Close />
            </IconButton>
          </div>
          <div className="pt-4 px-4 flex flex-col flex-1 overflow-hidden gap-5">
            {/* model add form */}
            <form onSubmit={handleSubmit(addHandler)}>
              <div className="flex flex-col gap-4">
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
                  render={({
                    fieldState: { error },
                    field: { value, onChange },
                  }) => (
                    <Autocomplete
                      options={categories}
                      value={value || null}
                      onChange={(_, val) => onChange(val)}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(a, b) => a.id === b.id}
                      noOptionsText="No categories matched"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Category"
                          placeholder="Select Category"
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
            <Paper className="!overflow-y-auto flex-1 overflow-hidden">
              <div className="px-2 py-3">
                <Typography variant="h6">Model List</Typography>
              </div>
              {/* loader  */}
              {loading && (
                <div className="">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton height={70} key={index} />
                  ))}
                </div>
              )}
              {/* display models */}
              {!loading && (
                <>
                  {Array.isArray(models) && models.length > 0 ? (
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
                        {models?.map((model, index) => (
                          <TableRow key={model.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {model.name}
                              <br />
                              <span>
                                <b>Category:</b> {model.category?.name}
                              </span>
                            </TableCell>
                            <TableCell>
                              {moment(model.createdAt).format("ll")}
                            </TableCell>
                            <TableCell>
                              <DeleteConfirm
                                title={
                                  <>
                                    Are you sure to delete <b>{model.name}</b>
                                  </>
                                }
                                confirm={() => deleteHandler(model)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Alert severity="error">
                      <Typography variant="body1">
                        No model available
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

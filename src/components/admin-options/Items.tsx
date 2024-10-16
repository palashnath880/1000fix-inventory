/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Controller, useForm } from "react-hook-form";
import { ItemInputs } from "../../types/reactHookForm.types";
import { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "../../hooks";
import moment from "moment";
import { toast } from "react-toastify";
import { Item } from "../../types/types";
import DeleteConfirm from "../shared/DeleteConfirm";
import { fetchItems } from "../../features/utilsSlice";
import itemApi from "../../api/item";
import { useMutation } from "@tanstack/react-query";

export default function Items() {
  //  react redux
  const { data: items, loading } = useAppSelector((state) => state.utils.items);
  const { data: models } = useAppSelector((state) => state.utils.models);
  const { data: uoms } = useAppSelector((state) => state.utils.uoms);
  const dispatch = useAppDispatch();

  // popup state
  const popup = usePopupState({ variant: "popover", popupId: "addItem" });

  // react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
  } = useForm<ItemInputs>();

  // add handler
  const add = useMutation<any, AxiosError<{ message: string }>, ItemInputs>({
    mutationFn: (data) =>
      itemApi.create({
        name: data.name,
        modelId: data.model?.id || "",
        uom: data.uom?.name || "",
      }),
    onSuccess: () => {
      toast.success(`Item added successfully`);
      reset();
      setValue("model", null);
      setValue("uom", null);
      dispatch(fetchItems());
    },
  });

  // item delete handler
  const deleteHandler = async (item: Item) => {
    const toastId = toast.loading(`Deleting ${item.name}`);

    try {
      await itemApi.delete(item.id);
      toast.update(toastId, {
        autoClose: 3000,
        type: "success",
        isLoading: false,
        render: `${item.name} deleted`,
      });
      dispatch(fetchItems());
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        autoClose: 3000,
        type: "error",
        isLoading: false,
        render: `Sorry! ${item.name} couldn't be deleted`,
      });
    }
  };

  return (
    <>
      <Button variant="contained" {...bindTrigger(popup)}>
        Items
      </Button>

      <Dialog {...bindDialog(popup)}>
        <Paper className="!py-5 w-[96%] sm:w-[500px] max-h-full flex flex-col overflow-hidden">
          <div className="flex justify-between gap-5 items-center px-4 pb-2 border-b">
            <Typography variant="h5">Items</Typography>
            <IconButton onClick={popup.close}>
              <Close />
            </IconButton>
          </div>
          <div className="pt-4 px-4 flex flex-col flex-1 overflow-hidden gap-5">
            {/* item add form */}
            <form onSubmit={handleSubmit((data) => add.mutate(data))}>
              <div className="flex flex-col gap-4">
                <TextField
                  label="Item Name"
                  fullWidth
                  type="text"
                  placeholder="Item Name"
                  error={Boolean(errors["name"])}
                  {...register("name", { required: true })}
                />

                <Controller
                  control={control}
                  name="uom"
                  rules={{ required: true }}
                  render={({
                    fieldState: { error },
                    field: { value, onChange },
                  }) => (
                    <Autocomplete
                      options={uoms}
                      value={value || null}
                      onChange={(_, val) => onChange(val)}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(a, b) => a.id === b.id}
                      noOptionsText="No uom matched"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select uom"
                          placeholder="Select uom"
                          error={Boolean(error)}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="model"
                  rules={{ required: true }}
                  render={({
                    fieldState: { error },
                    field: { value, onChange },
                  }) => (
                    <Autocomplete
                      options={models}
                      value={value || null}
                      onChange={(_, val) => onChange(val)}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(a, b) => a.id === b.id}
                      noOptionsText="No models matched"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Model"
                          placeholder="Select Model"
                          error={Boolean(error)}
                        />
                      )}
                    />
                  )}
                />

                {/* error message */}
                {add.isError && (
                  <Typography
                    variant="body2"
                    className="!text-center !text-red-400"
                  >
                    {add.error.response?.data.message ||
                      "Sorry! Something went wrong"}
                  </Typography>
                )}

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  startIcon={<Add />}
                  disabled={add.isPending}
                >
                  Add Item
                </Button>
              </div>
            </form>

            {/* items list */}
            <Paper className="!overflow-y-auto flex-1 overflow-hidden">
              <div className="px-2 py-3">
                <Typography variant="h6">Item List</Typography>
              </div>
              {/* loader  */}
              {loading && (
                <div className="">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton height={70} key={index} />
                  ))}
                </div>
              )}
              {/* display items */}
              {!loading && (
                <>
                  {Array.isArray(items) && items.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>UOM</TableCell>
                          <TableCell>Created At</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items?.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {item.name}
                              <br />
                              <span>
                                <b>Model:</b> {item.model?.name}
                              </span>
                            </TableCell>
                            <TableCell>{item.uom}</TableCell>
                            <TableCell>
                              {moment(item.createdAt).format("ll")}
                            </TableCell>
                            <TableCell>
                              <DeleteConfirm
                                title={
                                  <>
                                    Are you sure to delete <b>{item.name}</b>
                                  </>
                                }
                                confirm={() => deleteHandler(item)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Alert severity="error">
                      <Typography variant="body1">
                        No items available
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

import { Add, Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PopupState, { bindDialog } from "material-ui-popup-state";
import { bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SKUInputs } from "../../types/reactHookForm.types";
import { AxiosError } from "axios";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchSku } from "../../features/utilsSlice";
import skuCodeApi from "../../api/skuCode";
import { toast } from "react-toastify";

export default function AddSKUCode() {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // popup state
  const addPopup = usePopupState({ variant: "popover", popupId: "addSkuCode" });

  // react redux
  const { data: items } = useAppSelector((state) => state.utils.items);
  const dispatch = useAppDispatch();

  // react hook form
  const {
    control,
    formState: { errors },
    register,
    reset,
    setValue,
    handleSubmit,
  } = useForm<SKUInputs>({ defaultValues: { isDefective: false } });

  // add handler
  const addHandler: SubmitHandler<SKUInputs> = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      await skuCodeApi.create({
        name: data.name,
        isDefective: data.isDefective,
        itemId: data?.item?.id || "",
      });
      toast.success(`SKU code added successfully`);
      reset();
      setValue("item", null);
      dispatch(fetchSku());
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
      <PopupState variant="popover">
        {() => (
          <>
            <Button
              startIcon={<Add />}
              variant="contained"
              {...bindTrigger(addPopup)}
            >
              Add SKU Code
            </Button>

            <Dialog {...bindDialog(addPopup)}>
              <Paper className="!py-5 w-[96%] sm:w-[500px] max-h-full flex flex-col overflow-hidden">
                <div className="flex justify-between gap-5 items-center px-4 pb-2 border-b">
                  <Typography variant="h5">Add New SKU Code</Typography>
                  <IconButton onClick={addPopup.close}>
                    <Close />
                  </IconButton>
                </div>
                <div className="px-4 mt-3">
                  <form onSubmit={handleSubmit(addHandler)}>
                    <div className="flex flex-col gap-3">
                      <TextField
                        label="SKU Code"
                        fullWidth
                        type="text"
                        placeholder="SKU Code"
                        error={Boolean(errors["name"])}
                        {...register("name", { required: true })}
                      />

                      <Controller
                        control={control}
                        name="item"
                        rules={{ required: true }}
                        render={({
                          fieldState: { error },
                          field: { value, onChange },
                        }) => (
                          <Autocomplete
                            options={items}
                            value={value || null}
                            onChange={(_, val) => onChange(val)}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(a, b) => a.id === b.id}
                            noOptionsText="No items matched"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Item"
                                placeholder="Select Item"
                                error={Boolean(error)}
                              />
                            )}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name="isDefective"
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value}
                                onChange={(e) =>
                                  onChange(Boolean(e.target.checked))
                                }
                              />
                            }
                            label="Generate Defective"
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
                        Add Item
                      </Button>
                    </div>
                  </form>
                </div>
              </Paper>
            </Dialog>
          </>
        )}
      </PopupState>
    </>
  );
}

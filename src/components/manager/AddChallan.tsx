/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import PopupState, { bindDialog, bindTrigger } from "material-ui-popup-state";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { ChallanInputs } from "../../types/reactHookForm.types";
import { SKUCode } from "../../types/types";
import { useAppSelector } from "../../hooks";
import challanApi from "../../api/challan";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddItem = ({
  add,
  fields,
}: {
  add: (data: { skuCode: SKUCode; quantity: string }) => void;
  fields: any[];
}) => {
  // states
  const [quantity, setQuantity] = useState<string>("1");
  const [skuCode, setSkuCode] = useState<SKUCode | null>(null);

  // sku codes
  const { data: skuCodes } = useAppSelector((state) => state.utils.skuCodes);

  // add handler
  const addHandler = (close: () => void) => {
    if (!skuCode || parseInt(quantity) <= 0) return;
    add({ skuCode, quantity });
    setSkuCode(null);
    setQuantity("1");
    close();
  };

  return (
    <PopupState variant="popover">
      {(popupState) => (
        <>
          <Button
            variant="contained"
            className="!w-max"
            startIcon={<Add />}
            {...bindTrigger(popupState)}
          >
            Add Challan Item
          </Button>
          <Dialog {...bindDialog(popupState)}>
            <Paper className="px-4 py-5 w-[460px]">
              <Typography variant="h6">Add Challan Item</Typography>
              <div className="flex flex-col gap-5 mt-5">
                <Autocomplete
                  options={skuCodes}
                  noOptionsText="No sku matched"
                  value={skuCode}
                  onChange={(_, val) => setSkuCode(val)}
                  getOptionLabel={(opt) => opt.name}
                  getOptionDisabled={(opt) =>
                    !!fields?.find((i) => i?.skuCode?.id === opt.id)
                  }
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  renderOption={(props, option, state) => (
                    <li
                      {...props}
                      key={state.index}
                      className={`${props.className} !flex !flex-col !items-start`}
                    >
                      <span className="!font-semibold">{option.name}</span>
                      <span className="flex gap-4">
                        <small>Item: {option?.item?.name}</small>
                        <small>UOM: {option?.item?.uom}</small>
                      </span>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select SKU Code" />
                  )}
                />
                <TextField
                  placeholder="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-5 mt-5">
                <Button
                  variant="contained"
                  className="!flex-1"
                  color="success"
                  disabled={!skuCode || parseInt(quantity) <= 0}
                  onClick={() => addHandler(popupState.close)}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  className="!flex-1"
                  color="error"
                  onClick={() => {
                    setSkuCode(null);
                    setQuantity("1");
                    popupState.close();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Paper>
          </Dialog>
        </>
      )}
    </PopupState>
  );
};

export default function AddChallan({ refetch }: { refetch?: () => void }) {
  // states
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // react hook form
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<ChallanInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    rules: {
      required: "Please at least add one item",
    },
    name: "items",
  });

  // create handler
  const addHandler: SubmitHandler<ChallanInputs> = async (data) => {
    try {
      setSubmitting(true);
      setErrorMsg("");

      const dataObj: any = { ...data };
      dataObj.items = data.items.map((i) => ({
        quantity: parseFloat(i.quantity),
        skuCodeId: i.skuCode?.id,
      }));

      const res = await challanApi.create(dataObj);
      if (res.data?.id) navigate(`/challan/${res.data.id}`);
      setValue("items", []);
      reset();
      toast.success(`Challan created successfully`);
      if (typeof refetch === "function") refetch();
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
      <PopupState variant="popover">
        {(popupState) => (
          <>
            <Button
              variant="contained"
              startIcon={<Add />}
              {...bindTrigger(popupState)}
            >
              Add Challan
            </Button>

            <Dialog {...bindDialog(popupState)} className="overflow-y-auto">
              <Paper className="px-4 py-5 w-[460px]">
                <div className="flex justify-between items-center">
                  <Typography variant="h6">Create New Challan</Typography>
                  <IconButton onClick={popupState.close}>
                    <Close />
                  </IconButton>
                </div>
                <Divider />
                <div className="mt-4">
                  <form onSubmit={handleSubmit(addHandler)}>
                    <div className="flex flex-col gap-5">
                      <TextField
                        placeholder="Name"
                        error={Boolean(errors["name"])}
                        {...register("name", { required: true })}
                      />
                      <TextField
                        placeholder="Phone NO"
                        error={Boolean(errors["phone"])}
                        {...register("phone", {
                          required: true,
                          pattern: /^\d{10}$/,
                        })}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                +880
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                      <TextField
                        placeholder="Address"
                        error={Boolean(errors["address"])}
                        {...register("address", { required: true })}
                      />
                      <TextField
                        multiline
                        minRows={3}
                        placeholder="Description"
                        error={Boolean(errors["description"])}
                        {...register("description", { required: false })}
                      />
                      <AddItem
                        fields={fields}
                        add={({ skuCode, quantity }) =>
                          append({ skuCode, quantity })
                        }
                      />
                      <div className="flex flex-col gap-3">
                        {fields.map(({ id, skuCode, quantity }, index) => (
                          <Paper
                            className="!flex !items-center !justify-between px-4 py-2"
                            key={id}
                          >
                            <div>
                              <Typography>
                                <b>SKU Code:</b> {skuCode?.name}
                              </Typography>
                              <Typography>
                                <b>Quantity:</b> {quantity}
                              </Typography>
                            </div>
                            <IconButton onClick={() => remove(index)}>
                              <Close />
                            </IconButton>
                          </Paper>
                        ))}
                      </div>
                      {errors["items"]?.root?.message && (
                        <Typography className="!text-red-500">
                          {errors["items"]?.root?.message}
                        </Typography>
                      )}
                      {errorMsg && (
                        <Typography className="!text-red-500 !text-center">
                          {errorMsg}
                        </Typography>
                      )}

                      <Button
                        variant="contained"
                        disabled={submitting}
                        type="submit"
                      >
                        {submitting ? (
                          <CircularProgress size={22} color="inherit" />
                        ) : (
                          "Create Challan"
                        )}
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

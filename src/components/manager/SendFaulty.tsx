/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Close, Send } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  bindDialog,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { useState } from "react";
import { OwnStockType } from "../../types/types";
import { FaultyInputs } from "../../types/reactHookForm.types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SkuSelect } from "../shared/Inputs";
import { toast } from "react-toastify";
import stockApi from "../../api/stock";
import { AxiosError } from "axios";
import faultyApi from "../../api/faulty";

export default function SendFaulty() {
  // states
  const [ownStock, setOwnStock] = useState<OwnStockType | null>(null);
  const [stockLoading, setStockLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [list, setList] = useState<FaultyInputs[]>([]);

  // popup state
  const sendPopup = usePopupState({
    variant: "popover",
    popupId: "sendPopup",
  });
  const closePopup = usePopupState({
    variant: "popover",
    popupId: "closePopup",
  });

  // react hook form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FaultyInputs>();

  // add to transfer list
  const addToList: SubmitHandler<FaultyInputs> = (data) => {
    if (!ownStock) return;
    if (ownStock?.quantity < parseFloat(data?.quantity)) {
      toast.error(`Invalid quantity`);
      return;
    }
    const listArr = [...list, data];
    setList(listArr);
    setOwnStock(null);
    setValue("skuCode", null);
    reset();
  };

  // remove form the transfer list
  const remove = (index: number) => {
    const listArr = [...list];
    listArr.splice(index, 1);
    setList(listArr);
  };

  // fetch stock by sku id
  const stockBySkuId = async (skuId: string | undefined) => {
    if (!skuId) {
      setOwnStock(null);
      return;
    }
    try {
      setStockLoading(true);
      const res = await stockApi.getBySkuId(skuId || "");
      if (res?.data && typeof res?.data === "object") {
        const stock: OwnStockType = res?.data;
        const filteredList = list.filter((i) => i.skuCode?.id === skuId);
        const total = filteredList.reduce(
          (total, list) => total + parseFloat(list.quantity),
          0
        );
        stock.quantity = stock.quantity - total;
        setOwnStock(stock);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Sorry! Something went wrong.`);
    } finally {
      setStockLoading(false);
    }
  };

  // send faulty stock
  const sendHandler = async () => {
    try {
      setSubmitting(true);
      let newList: any[] = [...list];
      newList = list.map((i) => ({
        skuCodeId: i?.skuCode?.id,
        quantity: parseFloat(i?.quantity),
        reason: i.note,
      }));
      await faultyApi.create({ list: newList });
      setList([]);
      toast.success(`Faulty stock send successfully`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error?.response?.data?.message || "Sorry! Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // handle close function
  const handleClose = () => {
    sendPopup.close();
    closePopup.close();
    reset();
    setValue("skuCode", null);
    setList([]);
  };

  return (
    <>
      <Button startIcon={<Send />} {...bindTrigger(sendPopup)}>
        Send Faulty
      </Button>

      {/* popup state */}
      <Dialog
        open={sendPopup.isOpen}
        onClose={() => closePopup.setOpen(true)}
        PaperProps={{
          className: "px-5 py-5 !rounded-lg !max-w-[95vw] !w-[1000px]",
        }}
        style={{ overflowY: "auto" }}
      >
        <div className="flex justify-between items-center gap-4">
          <div className="flex flex-col">
            <Typography className="!text-lg !font-semibold">
              Send faulty
            </Typography>
            <Typography variant="body2">
              Send faulty stock from good stock
            </Typography>
          </div>
          <IconButton {...bindTrigger(closePopup)}>
            <Close />
          </IconButton>
        </div>
        <Divider className="!my-3" />
        <div className="flex items-start gap-5">
          {/* faulty add form */}
          <Paper className="px-5 py-5 flex-1 !rounded-md" elevation={3}>
            <Typography variant="h6">Faulty Form</Typography>
            <Divider className="!my-2" />
            <form onSubmit={handleSubmit(addToList)}>
              <div className="flex flex-col gap-4 pt-3">
                <Controller
                  control={control}
                  name="skuCode"
                  rules={{ required: true }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <SkuSelect
                      value={value}
                      disabled={stockLoading}
                      onChange={({ sku }) => {
                        onChange(sku);
                        stockBySkuId(sku?.id);
                      }}
                      error={Boolean(error)}
                    />
                  )}
                />

                <Typography>
                  <b>Available Quantity:</b> {ownStock?.quantity || 0}
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  label="Quantity"
                  placeholder="Quantity"
                  error={Boolean(errors["quantity"])}
                  {...register("quantity", {
                    required: true,
                    pattern: /^\d+(\.\d+)?$/,
                    min: 1,
                  })}
                />
                <TextField
                  multiline
                  minRows={3}
                  label="Reason"
                  placeholder="Reason"
                  error={Boolean(errors["note"])}
                  {...register("note", { required: true })}
                />

                <Button variant="contained" startIcon={<Add />} type="submit">
                  Add To Faulty List
                </Button>
              </div>
            </form>
          </Paper>

          {/* faulty list */}
          <Paper className="px-5 py-5  flex-1 !rounded-md" elevation={3}>
            <Typography variant="h6">Faulty List</Typography>
            <Divider className="!my-2" />
            <div className="pt-3 flex flex-col gap-3">
              {list?.map((item, index) => (
                <Paper
                  key={index}
                  elevation={3}
                  className="flex justify-between gap-4 px-4 py-4 items-center"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm flex gap-3">
                      <b className="w-14">SKU</b>
                      <span className="flex-1">{item.skuCode?.name}</span>
                    </p>
                    <p className="text-sm flex gap-3">
                      <b className="w-14">Quantity</b>
                      <span className="flex-1">{item.quantity}</span>
                    </p>
                    <p className="text-sm flex gap-3">
                      <b className="w-14">Reason</b>
                      <span className="flex-1">{item.note}</span>
                    </p>
                  </div>
                  <Tooltip title="Remove from list">
                    <IconButton onClick={() => remove(index)}>
                      <Close color="error" />
                    </IconButton>
                  </Tooltip>
                </Paper>
              ))}

              <Button
                variant="contained"
                startIcon={!submitting && <Send />}
                disabled={list?.length <= 0 || submitting}
                onClick={sendHandler}
              >
                {submitting ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Send Faulty"
                )}
              </Button>
            </div>
          </Paper>
        </div>
      </Dialog>

      {/* close popup */}
      <Dialog
        {...bindDialog(closePopup)}
        PaperProps={{ className: "px-4 py-5" }}
      >
        <Typography variant="body1" className="!font-semibold">
          Are you want to sure close this popup
        </Typography>
        <div className="flex items-center mt-4">
          <ButtonGroup fullWidth variant="outlined">
            <Button color="success" onClick={handleClose}>
              Yes
            </Button>
            <Button color="error" onClick={closePopup.close} aria-hidden="true">
              No
            </Button>
          </ButtonGroup>
        </div>
      </Dialog>
    </>
  );
}

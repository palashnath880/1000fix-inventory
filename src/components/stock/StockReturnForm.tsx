/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppSelector } from "../../hooks";
import { Add, Close, LocalShipping } from "@mui/icons-material";
import { StockReturnInputs } from "../../types/reactHookForm.types";
import { useState } from "react";
import { OwnStockType } from "../../types/types";
import { toast } from "react-toastify";
import stockApi from "../../api/stock";
import { AxiosError } from "axios";

export default function StockReturnForm() {
  // states
  const [ownStock, setOwnStock] = useState<OwnStockType | null>(null);
  const [stockLoading, setStockLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [returnList, setReturnList] = useState<StockReturnInputs[]>([]);

  // react redux
  const { data: skuCodes } = useAppSelector((state) => state.skuCodes);

  // react hook form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<StockReturnInputs>();

  // add to transfer list
  const addToList: SubmitHandler<StockReturnInputs> = (data) => {
    if (!ownStock) return;
    if (ownStock?.quantity < parseFloat(data?.quantity)) {
      toast.error(`Invalid quantity`);
      return;
    }
    const list = [...returnList, data];
    setReturnList(list);
    setOwnStock(null);
    setValue("skuCode", null);
    reset();
  };

  // remove form the transfer list
  const removeFromList = (index: number) => {
    const list = [...returnList];
    list.splice(index, 1);
    setReturnList(list);
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
        const filteredList = returnList.filter((i) => i.skuCode?.id === skuId);
        const totalQuantity = filteredList.reduce(
          (total, list) => total + parseFloat(list.quantity),
          0
        );
        stock.quantity = stock.quantity - totalQuantity;
        setOwnStock(stock);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Sorry! Something went wrong.`);
    } finally {
      setStockLoading(false);
    }
  };

  // transfer handler
  const transferHandler = async () => {
    try {
      setSubmitting(true);
      let list: any[] = [...returnList];
      list = list.map((i) => ({
        receiverId: i.branch?.id,
        skuCodeId: i?.skuCode?.id,
        quantity: parseFloat(i?.quantity),
      }));
      await stockApi.return({ list });
      setReturnList([]);
      toast.success(`Stock returned.`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error?.response?.data?.message || "Sorry! Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-start gap-5">
      {/* stock add form */}
      <div className="px-5 py-5 bg-slate-200 flex-1 rounded-md">
        <Typography variant="h6">Stock Return Form</Typography>
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
                <Autocomplete
                  disabled={stockLoading}
                  options={skuCodes}
                  value={value || null}
                  onChange={(_, val) => {
                    stockBySkuId(val?.id || "");
                    onChange(val);
                  }}
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  getOptionLabel={(opt) => opt.name}
                  noOptionsText="No sku matched"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select SKU Code"
                      placeholder="Select SKU Code"
                      error={Boolean(error)}
                    />
                  )}
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
              Add To Return List
            </Button>
          </div>
        </form>
      </div>

      {/* stock transfer list */}
      <div className="px-5 py-5 bg-slate-200 flex-1 rounded-md">
        <Typography variant="h6">Stock Return List</Typography>
        <Divider className="!my-2" />
        <div className="pt-3 flex flex-col gap-3">
          {returnList?.map((list, index) => (
            <Paper key={index}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="!font-bold">SKU Code</TableCell>
                    <TableCell className="!font-bold">Quantity</TableCell>
                    <TableCell className="!font-bold">Reason</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        title="remove from the return list"
                        onClick={() => removeFromList(index)}
                      >
                        <Close />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{list.skuCode?.name}</TableCell>
                    <TableCell>{list.quantity}</TableCell>
                    <TableCell>{list.note}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          ))}

          <Button
            variant="contained"
            startIcon={
              !submitting ? (
                <LocalShipping />
              ) : (
                <CircularProgress size={22} color="inherit" />
              )
            }
            disabled={returnList?.length <= 0 || submitting}
            onClick={transferHandler}
          >
            Return Stock
          </Button>
        </div>
      </div>
    </div>
  );
}

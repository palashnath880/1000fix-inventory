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
import { Header } from "../../components/shared/TopBar";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Add, AssignmentReturn, Close } from "@mui/icons-material";
import { useState } from "react";
import { OwnStockType } from "../../types/types";
import { useAppSelector } from "../../hooks";
import stockApi from "../../api/stock";
import { toast } from "react-toastify";
import { StockReturnInputs } from "../../types/reactHookForm.types";
import { AxiosError } from "axios";
import PurchaseReturnList from "../../components/manager/PurchaseReturnList";

export default function PurchaseReturn() {
  // states
  const [ownStock, setOwnStock] = useState<OwnStockType | null>(null);
  const [stockLoading, setStockLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [list, setList] = useState<StockReturnInputs[]>([]);

  // react-redux
  const { data: skuCodes } = useAppSelector((state) => state.skuCodes);

  // react hook form
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<StockReturnInputs>();

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
        const totalQuantity = filteredList.reduce(
          (total, val) => total + parseFloat(val.quantity),
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

  // add to list handler
  const addToList: SubmitHandler<StockReturnInputs> = (data) => {
    if (!ownStock) return;
    if (ownStock?.quantity < parseFloat(data?.quantity)) {
      toast.error(`Invalid quantity`);
      return;
    }
    const returnList = [...list, data];
    setList(returnList);
    setOwnStock(null);
    setValue("skuCode", null);
    reset();
  };

  // remove item from the return list
  const removeFromList = (index: number) => {
    const items = [...list];
    items.splice(index, 1);
    setList(items);
  };

  // return handler
  const returnHandler = async () => {
    try {
      setSubmitting(true);
      const data: unknown = list.map((i) => ({
        note: i.note,
        quantity: parseFloat(i.quantity),
        skuCodeId: i.skuCode?.id,
      }));
      await stockApi.purchaseReturn({ list: data });
      setList([]);
      toast.success(`Purchase items returned`);
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
    <div className="pb-10">
      <Header title="Purchase Return" />

      <div className="flex items-start gap-5">
        {/* stock return form */}
        <div className="px-5 py-5 bg-slate-200 flex-1 rounded-md">
          <Typography variant="h6">Return Form</Typography>
          <Divider className="!my-2" />
          <form onSubmit={handleSubmit(addToList)}>
            <div className="flex flex-col gap-4 pt-3">
              {/* sku code selector */}
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
              <Typography>
                <b>Average Price:</b> {ownStock?.avgPrice || 0}
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
                  max: ownStock?.quantity || 0,
                })}
              />
              <TextField
                fullWidth
                multiline
                minRows={3}
                type="text"
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

        {/* stock return list */}
        <div className="px-5 py-5 bg-slate-200 flex-1 rounded-md">
          <Typography variant="h6">Purchase Return List</Typography>
          <Divider className="!my-2" />
          <div className="pt-3 flex flex-col gap-3">
            {list?.map((item, index) => (
              <Paper key={index}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="!font-bold">SKU Code</TableCell>
                      <TableCell className="!font-bold">Quantity</TableCell>
                      <TableCell className="!font-bold">Note</TableCell>
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
                      <TableCell>{item.skuCode?.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.note}</TableCell>
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
                  <AssignmentReturn />
                ) : (
                  <CircularProgress size={22} color="inherit" />
                )
              }
              disabled={list?.length <= 0 || submitting}
              onClick={returnHandler}
            >
              Purchase Return
            </Button>
          </div>
        </div>
      </div>

      <PurchaseReturnList />
    </div>
  );
}

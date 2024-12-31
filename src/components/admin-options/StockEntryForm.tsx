import { Add, Close } from "@mui/icons-material";
import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
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
import type { StockFormInputs } from "../../types/reactHookForm.types";
import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import stockApi from "../../api/stock";
import { SkuSelect } from "../shared/Inputs";

export default function StockEntryForm() {
  // states
  const [entryList, setEntryList] = useState<StockFormInputs[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // react hook form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<StockFormInputs>();

  // add to entry list
  const addToEntryList: SubmitHandler<StockFormInputs> = (data) => {
    setEntryList([...entryList, data]);
    reset();
    setValue("skuCode", null);
  };

  // remove form the list
  const removeFromList = (index: number) => {
    const list = [...entryList];
    list.splice(index, 1);
    setEntryList(list);
  };

  // stock entry handler
  const entryHandler = async () => {
    if (isLoading || entryList.length <= 0) return;
    try {
      setIsLoading(true);
      setErrorMsg("");
      const list = [...entryList].map((i) => ({
        price: parseFloat(i.price),
        quantity: parseFloat(i.quantity),
        skuCodeId: i.skuCode?.id,
      }));
      await stockApi.entry({ list });
      setEntryList([]);
      toast.success(`Stock entry done.`);
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
    <div className="flex gap-5 items-start">
      {/* stock add form */}
      <div className="px-5 py-5 bg-slate-200 flex-1 rounded-md">
        <Typography variant="h6">Stock Entry Form</Typography>
        <Divider className="!my-2" />
        <form onSubmit={handleSubmit(addToEntryList)}>
          <div className="flex flex-col gap-4 pt-3">
            <Controller
              control={control}
              name="skuCode"
              rules={{ required: true }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <>
                  <SkuSelect
                    value={value}
                    error={Boolean(error)}
                    onChange={({ sku }) => onChange(sku)}
                  />
                </>
              )}
            />
            <TextField
              fullWidth
              type="text"
              label="Quantity"
              placeholder="Quantity"
              error={Boolean(errors["quantity"])}
              {...register("quantity", {
                required: true,
                pattern: /^\d+(\.\d+)?$/,
              })}
            />
            <TextField
              fullWidth
              type="text"
              label="Price"
              placeholder="Price"
              error={Boolean(errors["price"])}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">&#2547;</InputAdornment>
                  ),
                },
              }}
              {...register("price", {
                required: true,
                pattern: /^\d+(\.\d+)?$/,
              })}
            />

            <Button startIcon={<Add />} type="submit">
              Add To Entry List
            </Button>
          </div>
        </form>
      </div>

      {/* stock entry list */}
      <div className="px-5 py-5 bg-slate-200 flex-1 rounded-md">
        <Typography variant="h6">Stock Entry List</Typography>
        <Divider className="!my-2" />
        <div className="pt-3 flex flex-col gap-3">
          {entryList?.map((list, index) => (
            <Paper className="px-3 py-3" key={index}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="!font-bold">SKU Code</TableCell>
                    <TableCell className="!font-bold">Quantity</TableCell>
                    <TableCell className="!font-bold">Price</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        title="remove from the entry list"
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
                    <TableCell>&#2547; {list.price}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          ))}

          {errorMsg && (
            <Typography variant="body2" className="!text-center !text-red-500">
              {errorMsg}
            </Typography>
          )}

          <Button
            variant="contained"
            startIcon={<Add />}
            disabled={entryList?.length <= 0}
            onClick={entryHandler}
          >
            Add to Stock
          </Button>
        </div>
      </div>
    </div>
  );
}

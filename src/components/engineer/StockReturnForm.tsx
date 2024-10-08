/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { OwnStockType } from "../../types/types";
import { StockReturnInputs } from "../../types/reactHookForm.types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import engineerStockApi from "../../api/engineerStock";
import {
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
  Typography,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import SkuCodeSelect from "./SkuCodeSelect";
import QuantitySelector from "./QuantitySelector";
import { AxiosError } from "axios";

export default function StockReturnForm() {
  // states
  const [ownStock, setOwnStock] = useState<OwnStockType | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [returnList, setReturnList] = useState<StockReturnInputs[]>([]);

  // react hook form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<StockReturnInputs>();

  // remove form the transfer list
  const removeFromList = (index: number) => {
    const list = [...returnList];
    list.splice(index, 1);
    setReturnList(list);
  };

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

  const stockReturn = async () => {
    try {
      setSubmitting(true);
      const list = returnList.map((i) => {
        const obj: any = {
          quantity: parseFloat(i.quantity),
          skuCodeId: i.skuCode?.id,
        };
        return obj;
      });
      await engineerStockApi.return({ list });
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
    <div className="mt-5 flex flex-col gap-5">
      <div className="px-3 py-5 bg-slate-200 flex-1 rounded-md">
        <Typography variant="h6">Stock Return Form</Typography>
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
                <SkuCodeSelect
                  value={value}
                  error={error}
                  onChange={(val) => onChange(val)}
                  onStock={(stock) => setOwnStock(stock)}
                />
              )}
            />

            <Typography>
              <b>Available Quantity:</b> {ownStock?.quantity || 0}
            </Typography>

            <QuantitySelector
              error={Boolean(errors["quantity"])}
              params={{
                ...register("quantity", {
                  required: true,
                  pattern: /^\d+(\.\d+)?$/,
                  min: 1,
                }),
              }}
            />

            <Button variant="contained" startIcon={<Add />} type="submit">
              Add To Return List
            </Button>
          </div>
        </form>
      </div>

      {/* stock return list */}
      <div className="px-3 py-4 bg-slate-200 flex-1 rounded-md">
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
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          ))}

          <Button
            variant="contained"
            disabled={returnList?.length <= 0 || submitting}
            onClick={stockReturn}
          >
            {submitting ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Return Stock"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

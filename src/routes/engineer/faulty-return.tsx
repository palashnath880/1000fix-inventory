/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Close } from "@mui/icons-material";
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
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { StockReturnInputs } from "../../types/reactHookForm.types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { OwnStockType } from "../../types/types";
import engineerStockApi from "../../api/engineerStock";
import { AxiosError } from "axios";
import ReturnReport from "../../components/engineer/ReturnReport";
import SkuCodeSelect from "../../components/engineer/SkuCodeSelect";
import QuantitySelector from "../../components/engineer/QuantitySelector";
import { createFileRoute } from "@tanstack/react-router";

function FaultyReturn() {
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

  const faultyReturn = async () => {
    try {
      setSubmitting(true);
      const list = returnList.map((i) => {
        const obj: any = {
          quantity: parseFloat(i.quantity),
          skuCodeId: i.skuCode?.id,
          note: i.note,
        };
        return obj;
      });
      await engineerStockApi.faultyReturn({ list });
      setReturnList([]);
      toast.success(`Faulty stock returned.`);
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
      <Typography variant="h6">Faulty Stock Return</Typography>

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
              disabled={returnList?.length <= 0 || submitting}
              onClick={faultyReturn}
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

      <ReturnReport report="faulty" />
    </div>
  );
}

export const Route = createFileRoute("/engineer/faulty-return")({
  component: FaultyReturn,
});

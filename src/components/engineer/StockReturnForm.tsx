/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { AxiosErr, OwnStockType } from "../../types/types";
import { StockReturnInputs } from "../../types/reactHookForm.types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import engineerStockApi from "../../api/engineerStock";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import SkuCodeSelect from "./SkuCodeSelect";
import QuantitySelector from "./QuantitySelector";
import { useMutation } from "@tanstack/react-query";

export default function StockReturnForm() {
  // states
  const [ownStock, setOwnStock] = useState<OwnStockType | null>(null);
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

  // stock return controller
  const stockReturn = useMutation<any, AxiosErr, StockReturnInputs[]>({
    mutationFn: (list) => {
      const newList = list.map((i) => ({
        quantity: parseFloat(i.quantity),
        skuCodeId: i.skuCode?.id,
        note: i.note,
      }));
      return engineerStockApi.return({ list: newList });
    },
    onSuccess: () => {
      setReturnList([]);
      toast.success(`Stock returned.`);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Sorry! Something went wrong";
      toast.error(msg);
    },
  });

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
            <TextField
              multiline
              minRows={3}
              label="Remarks"
              placeholder="Remarks"
              {...register("note", { required: false })}
            />

            <Button startIcon={<Add />} type="submit">
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
            <Accordion key={index}>
              <AccordionSummary
                sx={{
                  ".MuiAccordionSummary-content": {
                    justifyContent: "space-between",
                  },
                }}
              >
                <Typography>
                  {list.skuCode?.item?.name}
                  <br />
                  Quantity: {list.quantity}
                </Typography>
                <IconButton
                  color="error"
                  title="remove from the return list"
                  onClick={() => removeFromList(index)}
                >
                  <Close />
                </IconButton>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  <b>SKU Code:</b> {list.skuCode?.name}
                </Typography>
                <Typography variant="body2">
                  <b>Remarks:</b> {list.note}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          <Button
            disabled={returnList?.length <= 0 || stockReturn.isPending}
            onClick={() => stockReturn.mutate(returnList)}
          >
            {stockReturn.isPending ? (
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

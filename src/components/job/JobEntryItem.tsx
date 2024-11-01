/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Autocomplete,
  Button,
  Dialog,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { OwnStockType, SKUCode, User } from "../../types/types";
import { useAppSelector } from "../../hooks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { JobItemInputs } from "../../types/reactHookForm.types";
import { Add, Close } from "@mui/icons-material";
import stockApi from "../../api/stock";
import { toast } from "react-toastify";
import { bindDialog } from "material-ui-popup-state";
import engineerStockApi from "../../api/engineerStock";

type JobEntryItemProps = {
  popup: any;
  fields: {
    price: string;
    quantity: string;
    skuCodeId: string | undefined;
  }[];
  add: (data: {
    price: string;
    quantity: string;
    skuCode: SKUCode;
    skuCodeId: string;
  }) => void;
  engineer: User | null | any;
};

export default function JobEntryItem({
  popup,
  fields,
  add,
  engineer,
}: JobEntryItemProps) {
  // states
  const [loading, setLoading] = useState<boolean>(false);
  const [stock, setStock] = useState<OwnStockType | null>(null);

  // react redux
  const { data: skuCodes } = useAppSelector((state) => state.utils.skuCodes);

  // react hook form
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<JobItemInputs>();

  // stock by sku code
  const stockBySkuId = async (skuId: string) => {
    if (!skuId) {
      setStock(null);
      return;
    }
    try {
      setLoading(true);

      let data: any = {};
      if (engineer) {
        const res = await engineerStockApi.stockBySku(engineer.id, skuId);
        data = res.data;
      } else {
        const res = await stockApi.getBySkuId(skuId);
        data = res.data;
      }
      setStock(data);
      setValue("price", data.avgPrice.toString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // add item handler
  const addItem: SubmitHandler<JobItemInputs> = (data) => {
    if (!stock) return;

    const stockQuantity: number =
      typeof stock?.quantity === "string"
        ? parseFloat(stock?.quantity)
        : stock?.quantity;

    if (parseFloat(data?.quantity) > stockQuantity) {
      toast.error("Invalid quantity");
      return;
    }

    const item: any = {
      price: data.price,
      quantity: data.quantity,
      skuCode: data.skuCode,
      skuCodeId: data.skuCode?.id,
    };
    add(item);
    reset();
    setValue("skuCode", null);
    setStock(null);
    popup?.close();
  };

  return (
    <Dialog {...bindDialog(popup)}>
      <Paper className="px-5 py-5 md:w-[450px]">
        <div className="flex justify-between items-center gap-3">
          <Typography variant="h6">Add New Job Item</Typography>
          <IconButton onClick={popup?.close}>
            <Close />
          </IconButton>
        </div>
        <Divider className="!my-3" />
        <form onSubmit={handleSubmit(addItem)}>
          <div className="flex flex-col gap-5">
            <Controller
              control={control}
              name="skuCode"
              rules={{ required: true }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Autocomplete
                  options={skuCodes}
                  disabled={loading}
                  value={value || null}
                  getOptionLabel={(opt) => opt.name}
                  getOptionDisabled={(opt) =>
                    !!fields.find((i) => i.skuCodeId === opt.id)
                  }
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  onChange={(_, value) => {
                    onChange(value);
                    stockBySkuId(value?.id || "");
                  }}
                  noOptionsText="No SKU code matched"
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

            {stock && (
              <>
                <div className="flex flex-col gap-0">
                  <Typography>
                    <span className="font-semibold">Category:</span>{" "}
                    {stock?.skuCode?.item?.model?.category?.name}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Model:</span>{" "}
                    {stock?.skuCode?.item?.model?.name}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Item:</span>{" "}
                    {stock?.skuCode?.item?.name}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">UOM:</span>{" "}
                    {stock?.skuCode?.item?.uom}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Price:</span>{" "}
                    {stock?.avgPrice}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Available Quantity:</span>{" "}
                    {stock?.quantity}
                  </Typography>
                </div>
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
              </>
            )}

            <Button type="submit" startIcon={<Add />} disabled={loading}>
              Add Item
            </Button>
          </div>
        </form>
      </Paper>
    </Dialog>
  );
}
